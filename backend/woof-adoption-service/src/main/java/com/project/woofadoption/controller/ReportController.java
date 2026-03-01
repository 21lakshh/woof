package com.project.woofadoption.controller;

import com.project.woofadoption.dto.ReportRequest;
import com.project.woofadoption.dto.UpdateReportRequest;
import com.project.woofadoption.entity.Report;
import com.project.woofadoption.entity.ReportStatus;
import com.project.woofadoption.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/adoption")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/reports")
    public ResponseEntity<Report> submitReport(@RequestBody ReportRequest request) {
        return ResponseEntity.ok(reportService.createReport(request));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/dogs")
    public ResponseEntity<List<Report>> getDogsForAdoption() {
        return ResponseEntity.ok(reportService.getReportsByStatus(ReportStatus.AVAILABLE_FOR_ADOPTION));
    }

    @PutMapping("/reports/{id}")
    public ResponseEntity<Report> updateReportStatus(@PathVariable Long id, @RequestBody UpdateReportRequest request) {
        return ResponseEntity.ok(reportService.updateReport(id, request));
    }
}
