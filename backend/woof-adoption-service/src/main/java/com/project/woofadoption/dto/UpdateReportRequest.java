package com.project.woofadoption.dto;

import com.project.woofadoption.entity.ReportStatus;
import lombok.Data;

@Data
public class UpdateReportRequest {
    private ReportStatus status;
    private String dogName;
    private Integer estimatedAge;
    private String breed;
    private String temperament;
    private Boolean isVaccinated;
}
