package com.project.woof.service;

import com.project.woof.dao.AnalysisResponse;
import com.project.woof.dao.GroqRequest;
import com.project.woof.dao.GroqResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.List;

@Service
public class AnalysisService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private final RestClient restClient;

    public AnalysisService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.groq.com/openai/v1")
                .build();
    }

    public AnalysisResponse analyze(MultipartFile file, String additionalInfo) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String base64Image;
        try {
            base64Image = Base64.getEncoder().encodeToString(file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Error reading file content", e);
        }

        String userPrompt = "Determine if the uploaded image contains a dog. Please be very specific just say 'yes its a dog' or 'no its not a dog' for this particular request. Give a structured answer for the following for easier understanding with bold statements. Analyze the dog's condition in the given image and classify it into one of the following categories: 🟢 Healthy, 🟡 Mildly Injured/Sick, 🟠 Moderately Injured/Sick, 🔴 Critical Condition. Provide a detailed explanation justifying your classification based on visible signs such as posture, wounds, fur condition, facial expression, or any other indicators of health or distress. Suggest immediate actions the person can take to help the dog before seeking professional veterinary assistance. These recommendations should be practical and based on the severity of the condition. Additional user notes:" + (additionalInfo != null ? additionalInfo : "None");

        GroqRequest requestPayload = GroqRequest.builder()
                .model("meta-llama/llama-4-maverick-17b-128e-instruct")
                .messages(Collections.singletonList(
                        GroqRequest.Message.builder()
                                .role("user")
                                .content(List.of(
                                        GroqRequest.Content.builder()
                                                .type("text")
                                                .text(userPrompt)
                                                .build(),
                                        GroqRequest.Content.builder()
                                                .type("image_url")
                                                .image_url(GroqRequest.ImageUrl.builder()
                                                        .url("data:image/jpeg;base64," + base64Image)
                                                        .build())
                                                .build()
                                ))
                                .build()
                ))
                .max_tokens(4000)
                .build();

        GroqResponse response = restClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + groqApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestPayload)
                .retrieve()
                .body(GroqResponse.class);

        if (response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
            String content = response.getChoices().get(0).getMessage().getContent();
            return AnalysisResponse.builder()
                    .classification("Analyzed") // Simplified mapping, ideally parse the content
                    .advice(content)
                    .build();
        } else {
            return AnalysisResponse.builder()
                    .classification("Error")
                    .advice("Failed to analyze image")
                    .build();
        }
    }
}
