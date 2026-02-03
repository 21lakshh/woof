package com.project.woof.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.woof.dao.AnalysisResponse;
import com.project.woof.service.AnalysisService;

@RestController
@RequestMapping("/api/v1/analyze")
@org.springframework.web.bind.annotation.CrossOrigin(origins = "*") // Enable CORS for all origins
public class AnalysisController {

    private final AnalysisService analysisService;
    AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }
    
    @PostMapping
    public AnalysisResponse analyze(@RequestParam("file") MultipartFile file, 
                                  @RequestParam(value = "additionalInfo", required = false) String additionalInfo) {
        return analysisService.analyze(file, additionalInfo);
    }
}
