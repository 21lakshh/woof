package com.project.woofadoption.service;

import com.project.woofadoption.dto.ReportRequest;
import com.project.woofadoption.dto.UpdateReportRequest;
import com.project.woofadoption.entity.Report;
import com.project.woofadoption.entity.ReportStatus;
import com.project.woofadoption.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    public Report createReport(ReportRequest request) {
        Report report = Report.builder()
                .location(request.getLocation())
                .imageUrl(request.getImageUrl())
                .description(request.getDescription())
                .diseaseAnalysis(request.getDiseaseAnalysis())
                .status(ReportStatus.REPORTED)
                .build();
        
        return reportRepository.save(report);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public List<Report> getReportsByStatus(ReportStatus status) {
        return reportRepository.findByStatus(status);
    }
    
    public Report updateReport(Long id, UpdateReportRequest request) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));

        if (request.getStatus() != null) {
            report.setStatus(request.getStatus());
        }
        if (request.getDogName() != null) report.setDogName(request.getDogName());
        if (request.getEstimatedAge() != null) report.setEstimatedAge(request.getEstimatedAge());
        if (request.getBreed() != null) report.setBreed(request.getBreed());
        if (request.getTemperament() != null) report.setTemperament(request.getTemperament());
        if (request.getIsVaccinated() != null) report.setIsVaccinated(request.getIsVaccinated());

        return reportRepository.save(report);
    }
}
