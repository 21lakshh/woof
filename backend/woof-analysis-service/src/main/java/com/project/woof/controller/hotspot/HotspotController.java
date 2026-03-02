package com.project.woof.controller.hotspot;

import com.project.woof.domain.HotspotCluster;
import com.project.woof.domain.ReportPoint;
import com.project.woof.service.hotspot.HotspotClusteringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/hotspots")
@org.springframework.web.bind.annotation.CrossOrigin(origins = "*") // Enable CORS for all origins
public class HotspotController {

    private final HotspotClusteringService clusteringService;

    // TODO: In a real app, this would be injected from a repository,
    // For now we'll serve an empty map endpoint to avoid frontend 404s until the DB layer is fully integrated
    public HotspotController(HotspotClusteringService clusteringService) {
        this.clusteringService = clusteringService;
    }

    @GetMapping("/clusters")
    public ResponseEntity<List<HotspotCluster>> getHotspots() {
        // Fetch all active/recent reports from DB here.
        // For now, returning an empty list.
        List<ReportPoint> mockReports = Collections.emptyList();
        return ResponseEntity.ok(clusteringService.calculateHotspots(mockReports));
    }
}
