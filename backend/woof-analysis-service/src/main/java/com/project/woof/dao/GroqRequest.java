package com.project.woof.dao;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class GroqRequest {
    private String model;
    private List<Message> messages;
    private int max_tokens;

    @Data
    @Builder
    public static class Message {
        private String role;
        private List<Content> content;
    }

    @Data
    @Builder
    public static class Content {
        private String type;
        private String text;
        private ImageUrl image_url;
    }

    @Data
    @Builder
    public static class ImageUrl {
        private String url;
    }
}
