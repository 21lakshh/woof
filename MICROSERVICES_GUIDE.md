# Woof Backend - Microservices Implementation Guide

This guide outlines the structure and endpoints for the new Java Spring Boot microservices backend for **Woof**.

## Project Structure

The `backend/` directory has been created with one service folder:

1.  `woof-analysis-service`: Handles image analysis using Llama 3.2 Vision (via Groq).

---

## 1. Woof Analysis Service

**Responsibility**: Receive dog images, validate them, and analyze them using an AI model to check for health conditions.

### Dependencies (Recommended)
-   Spring Web
-   Spring Boot DevTools
-   Lombok
-   HttpClient (Java 11+) or a library like `OkHttp` or `Retrofit` for external API calls.

### Endpoints

#### `POST /api/v1/analyze`

**Request:**
-   **Content-Type**: `multipart/form-data`
-   **Body**:
    -   `file`: The image file (JPEG/PNG).
    -   `additionalInfo`: (Optional) String containing user notes.

**Logic to Implement:**
1.  **Validation**: Ensure the file is a valid image (JPEG/PNG) and not empty.
2.  **Encoding**: Convert the image `byte[]` to a Base64 encoded string.
3.  **AI Call**: Send a POST request to Groq API (`https://api.groq.com/openai/v1/chat/completions`).

**Groq API Payload:**
```json
{
  "model": "llama-3.2-90b-vision-preview",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Determine if the uploaded image contains a dog. Please be very specific just say 'yes its a dog' or 'no its not a dog' for this particular request. Give a structured answer for the following for easier understanding with bold statements. Analyze the dog's condition in the given image and classify it into one of the following categories: 🟢 Healthy, 🟡 Mildly Injured/Sick, 🟠 Moderately Injured/Sick, 🔴 Critical Condition. Provide a detailed explanation justifying your classification based on visible signs such as posture, wounds, fur condition, facial expression, or any other indicators of health or distress. Suggest immediate actions the person can take to help the dog before seeking professional veterinary assistance. These recommendations should be practical and based on the severity of the condition. Additional user notes: [USER_NOTES_HERE]"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,[BASE64_IMAGE_STRING]"
          }
        }
      ]
    }
  ],
  "max_tokens": 4000
}
```
**Headers**:
-   `Authorization`: `Bearer ${GROQ_API_KEY}`
-   `Content-Type`: `application/json`

**Response**:
Return the JSON response from Groq or a simplified version containing the classification and advice.

---

## Getting Started

1.  **Initialize Project**: Use [Spring Initializr](https://start.spring.io/) to generate the boilerplates for `woof-analysis-service`.
2.  **Unzip & Move**: Extract the generated project into the `backend/woof-analysis-service` folder.
3.  **Environment Variables**: Remember to set your `GROQ_API_KEY` in the environment variables for the analysis service.
4.  **Run**: `./mvnw spring-boot:run` (or `./gradlew bootRun`) inside the service directory.
