package com.example.learning;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * This is the main entry point of a Spring Boot application.
 * 
 * In Flask, you might use:
 *   if __name__ == '__main__':
 *       app.run()
 *
 * In Spring Boot, the `@SpringBootApplication` annotation does three things automatically:
 * 1. Configuration: Tags this class as a source of bean definitions for the application context.
 * 2. EnableAutoConfiguration: Tells Spring Boot to start adding beans based on classpath settings (e.g., since we have spring-boot-starter-web, it sets up Tomcat and Spring MVC).
 * 3. ComponentScan: Tells Spring to look for other components, configurations, and services in the 'com.example.learning' package, allowing it to find our Controllers.
 */
@SpringBootApplication
public class LearningApplication {

    public static void main(String[] args) {
        // This line fires up the Spring application, starting the embedded web server.
        SpringApplication.run(LearningApplication.class, args);
    }

}
