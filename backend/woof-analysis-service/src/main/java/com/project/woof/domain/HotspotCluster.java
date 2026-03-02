package com.project.woof.domain;

import java.util.List;

public class HotspotCluster {
    private double centerLatitude;
    private double centerLongitude;
    private String priorityLevel;
    private int numberOfReports;
    private List<ReportPoint> points;

    public HotspotCluster(double centerLatitude, double centerLongitude, String priorityLevel, int numberOfReports, List<ReportPoint> points) {
        this.centerLatitude = centerLatitude;
        this.centerLongitude = centerLongitude;
        this.priorityLevel = priorityLevel;
        this.numberOfReports = numberOfReports;
        this.points = points;
    }

    public double getCenterLatitude() { return centerLatitude; }
    public void setCenterLatitude(double centerLatitude) { this.centerLatitude = centerLatitude; }
    public double getCenterLongitude() { return centerLongitude; }
    public void setCenterLongitude(double centerLongitude) { this.centerLongitude = centerLongitude; }
    public String getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(String priorityLevel) { this.priorityLevel = priorityLevel; }
    public int getNumberOfReports() { return numberOfReports; }
    public void setNumberOfReports(int numberOfReports) { this.numberOfReports = numberOfReports; }
    public List<ReportPoint> getPoints() { return points; }
    public void setPoints(List<ReportPoint> points) { this.points = points; }
}
