package com.tribe.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:8081",           // Vite dev server
                    "http://localhost:5173",           // Local dev
                    "http://localhost:3000",           // Alternative local dev
                    "http://127.0.0.1:8081",
                    "http://127.0.0.1:5173",
                    "http://127.0.0.1:3000"
                )
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
