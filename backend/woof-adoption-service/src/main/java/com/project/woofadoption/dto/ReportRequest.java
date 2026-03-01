package com.project.woofadoption.dto;

import lombok.Data;

@Data
public class ReportRequest {
    private String location;
    private String imageUrl;
    private String description;
    private String diseaseAnalysis;
}
