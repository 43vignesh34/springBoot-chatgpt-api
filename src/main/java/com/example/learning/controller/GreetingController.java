package com.example.learning.controller;

import com.example.learning.dto.GreetingRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * The @RestController annotation is a combination of @Controller and @ResponseBody.
 * It tells Spring that this class contains web endpoints, and that the return values 
 * of the methods should be written directly to the HTTP response body (like returning a string or JSON in Flask).
 *
 * In Flask, this is similar to creating an app route:
 *   @app.route('/', methods=['GET'])
 */
@RestController
public class GreetingController {

    /**
     * @GetMapping maps HTTP GET requests to this specific handler method.
     * 
     * Flask equivalent:
     *   @app.route('/', methods=['GET'])
     *   def home():
     *       return "Spring Boot is running!"
     */
    @GetMapping("/")
    public String home() {
        return "Spring Boot is running!";
    }

    /**
     * @PostMapping maps HTTP POST requests to this specific handler method.
     * 
     * The @RequestBody annotation tells Spring to automatically parse the incoming JSON payload
     * and map its fields into the GreetingRequest object. This is equivalent to Flask's `request.json`.
     *
     * Flask equivalent:
     *   @app.route('/greet', methods=['POST'])
     *   def greet():
     *       data = request.json
     *       return f"Hello {data['name']}"
     */
    @PostMapping("/greet")
    public String greet(@RequestBody GreetingRequest request) {
        return "Hello " + request.getName();
    }

}
