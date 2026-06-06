package com.example.learning.dto;

/**
 * A DTO (Data Transfer Object) is a simple object used to transfer data between the client and server.
 * 
 * In Spring Boot, when a POST request contains JSON like {"name": "Vignesh"},
 * the Jackson library (built into Spring Web) automatically matches the JSON keys to 
 * the fields in this class and populates them using the setter methods.
 */
public class GreetingRequest {

    // The field name must match the JSON key: {"name": "..."}
    private String name;

    // A default constructor is needed for the JSON parser to instantiate this class
    public GreetingRequest() {
    }

    // Getter method (used by Spring/Jackson or by our code to read the value)
    public String getName() {
        return name;
    }

    // Setter method (used by Spring/Jackson to populate the value from JSON)
    public void setName(String name) {
        this.name = name;
    }

}
