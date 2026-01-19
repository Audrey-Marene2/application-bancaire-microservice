/*
 * APIGatewayWillBank/src/main/java/com/vortexmakers/APIGatewayWillBank/config/CorsConfig.java
 * CONFIGURATION CORS CORRIGÉE POUR REACT NATIVE WEB
 */
package com.vortexmakers.APIGatewayWillBank.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // ========== ORIGINES AUTORISÉES ==========
        // Ajoutez TOUS les ports possibles de votre frontend
        corsConfig.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:*", // Tous les ports localhost
                "http://127.0.0.1:*", // Tous les ports 127.0.0.1
                "http://localhost:8087", // Port React Native Web (actuel)
                "http://localhost:5173", // Vite (React)
                "http://localhost:5174", // Vite alternatif
                "http://localhost:3000", // Create React App
                "http://localhost:8081", // Expo Web
                "http://10.0.2.2:*", // Android Emulator
                "http://192.168.*.*:*" // Devices sur réseau local
        ));

        // ========== MÉTHODES HTTP AUTORISÉES ==========
        corsConfig.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS",
                "PATCH",
                "HEAD"));

        // ========== HEADERS AUTORISÉS ==========
        corsConfig.setAllowedHeaders(Arrays.asList(
                "*" // Tous les headers autorisés
        ));

        // ========== HEADERS EXPOSÉS ==========
        corsConfig.setExposedHeaders(Arrays.asList(
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials",
                "Authorization",
                "Content-Type"));

        // ========== CREDENTIALS ==========
        corsConfig.setAllowCredentials(true);

        // ========== DURÉE DE CACHE ==========
        corsConfig.setMaxAge(3600L);

        // ========== APPLICATION DE LA CONFIG ==========
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}