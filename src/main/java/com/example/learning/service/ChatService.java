package com.example.learning.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ChatService {

    @Value("${OPENAI_API_KEY}")
    private String apiKey;

    private Map<String, List<Map<String, String>>> conversationStore = new HashMap<>();

    public String askChatGPT(String sessionId, String userInput) {

        conversationStore.putIfAbsent(
                sessionId,
                new ArrayList<>());
        List<Map<String, String>> history = conversationStore.get(sessionId);

        history.add(
                Map.of(
                        "role", "user",
                        "content", userInput));
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-4o-mini",
                "input", history);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        String response = restTemplate.postForObject(
                "https://api.openai.com/v1/responses",
                request,
                String.class);

        try {
            com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode root = objectMapper.readTree(response);

            String responseText = root.path("output")
                    .get(0)
                    .path("content")
                    .get(0)
                    .path("text")
                    .asText();

            history.add(Map.of(
                    "role", "assistant",
                    "content", responseText));

            return responseText;
            
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            e.printStackTrace();
            return "Error parsing JSON from OpenAI";
        }
    }
}
