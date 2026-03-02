package com.project.woof.service.hotspot;

import com.project.woof.domain.HotspotCluster;
import com.project.woof.domain.ReportPoint;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class HotspotClusteringService {

    // Earth's radius in kilometers
    private static final double R = 6371.0;
    
    // DBSCAN Parameters
    private static final double EPSILON_KM = 2.0; // 2 km radius
    private static final int MIN_PTS = 3;

    public List<HotspotCluster> calculateHotspots(List<ReportPoint> reports) {
        List<HotspotCluster> clusters = new ArrayList<>();
        Set<ReportPoint> visited = new HashSet<>();
        Set<ReportPoint> noise = new HashSet<>();

        for (ReportPoint point : reports) {
            if (visited.contains(point)) continue;

            visited.add(point);
            List<ReportPoint> neighbors = regionQuery(point, reports);

            if (calculateWeightedDensity(neighbors) < MIN_PTS) {
                noise.add(point);
            } else {
                HotspotCluster cluster = new HotspotCluster(0, 0, "LOW", 0, new ArrayList<>());
                expandCluster(point, neighbors, cluster, visited, noise, reports);
                
                // Calculate center and priority after cluster is formed
                finalizeCluster(cluster);
                clusters.add(cluster);
            }
        }
        
        return clusters;
    }

    private void expandCluster(ReportPoint point, List<ReportPoint> neighbors, HotspotCluster cluster,
                             Set<ReportPoint> visited, Set<ReportPoint> noise, List<ReportPoint> allPoints) {
        cluster.getPoints().add(point);
        
        for (int i = 0; i < neighbors.size(); i++) {
            ReportPoint neighbor = neighbors.get(i);
            
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                List<ReportPoint> neighborPts = regionQuery(neighbor, allPoints);
                
                if (calculateWeightedDensity(neighborPts) >= MIN_PTS) {
                    for (ReportPoint n : neighborPts) {
                        if (!neighbors.contains(n)) {
                            neighbors.add(n);
                        }
                    }
                }
            }
            
            if (!cluster.getPoints().contains(neighbor)) {
                cluster.getPoints().add(neighbor);
                if (noise.contains(neighbor)) {
                    noise.remove(neighbor);
                }
            }
        }
    }

    private List<ReportPoint> regionQuery(ReportPoint center, List<ReportPoint> allPoints) {
        List<ReportPoint> neighbors = new ArrayList<>();
        for (ReportPoint point : allPoints) {
            if (haversineDistance(center, point) <= EPSILON_KM) {
                neighbors.add(point);
            }
        }
        return neighbors;
    }

    // Custom weighted distance calculation matching Python requirements
    private double calculateWeightedDensity(List<ReportPoint> points) {
        double density = 0;
        LocalDateTime now = LocalDateTime.now();
        
        for (ReportPoint p : points) {
            double severityWeight = getSeverityWeight(p.getSeverity());
            
            // Time decay factor: older reports have less weight
            long daysOld = p.getReportedAt() != null ? 
                ChronoUnit.DAYS.between(p.getReportedAt(), now) : 0;
            double timeWeight = Math.exp(-0.1 * daysOld); // Exponential decay
            
            density += (severityWeight * timeWeight);
        }
        return density;
    }

    private void finalizeCluster(HotspotCluster cluster) {
        List<ReportPoint> points = cluster.getPoints();
        cluster.setNumberOfReports(points.size());
        
        double sumLat = 0, sumLon = 0, maxSeverity = 0;
        
        for (ReportPoint p : points) {
            sumLat += p.getLatitude();
            sumLon += p.getLongitude();
            maxSeverity = Math.max(maxSeverity, getSeverityWeight(p.getSeverity()));
        }
        
        cluster.setCenterLatitude(sumLat / points.size());
        cluster.setCenterLongitude(sumLon / points.size());
        
        // Determine overall priority based on max severity in cluster
        if (maxSeverity >= 3.0 || points.size() > 10) {
            cluster.setPriorityLevel("HIGH"); // Red
        } else if (maxSeverity >= 2.0 || points.size() > 5) {
            cluster.setPriorityLevel("MEDIUM"); // Orange
        } else {
            cluster.setPriorityLevel("LOW"); // Green
        }
    }

    private double getSeverityWeight(String severity) {
        if (severity == null) return 1.0;
        return switch (severity.toLowerCase()) {
            case "critical" -> 4.0;
            case "injured" -> 3.0;
            case "aggressive" -> 2.5;
            case "healthy" -> 1.0;
            default -> 1.0;
        };
    }

    // Calculate distance using Haversine formula
    private double haversineDistance(ReportPoint p1, ReportPoint p2) {
        double dLat = Math.toRadians(p2.getLatitude() - p1.getLatitude());
        double dLon = Math.toRadians(p2.getLongitude() - p1.getLongitude());
        
        double lat1 = Math.toRadians(p1.getLatitude());
        double lat2 = Math.toRadians(p2.getLatitude());
        
        double a = Math.pow(Math.sin(dLat / 2), 2) +
                   Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
                   
        double c = 2 * Math.asin(Math.sqrt(a));
        return R * c;
    }
}
