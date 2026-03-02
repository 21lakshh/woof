package com.project.woof.domain;

import java.time.LocalDateTime;

public class ReportPoint {
    private Long id;
    private double latitude;
    private double longitude;
    private String severity;
    private LocalDateTime reportedAt;

    public ReportPoint() {}

    public ReportPoint(Long id, double latitude, double longitude, String severity, LocalDateTime reportedAt) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.severity = severity;
        this.reportedAt = reportedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public LocalDateTime getReportedAt() { return reportedAt; }
    public void setReportedAt(LocalDateTime reportedAt) { this.reportedAt = reportedAt; }
}
