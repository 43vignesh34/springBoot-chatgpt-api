package com.example.learning.controller;

import com.example.learning.service.ChatService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {

    @Autowired
    ChatService chatService;

    @PostMapping("/ask")
    public String greet(@RequestBody Map<String, String> request) {

        String input = request.get("input");
        String sessionId = request.get("sessionId");
        String output = chatService.askChatGPT(sessionId, input);

        return output;

    }

}
