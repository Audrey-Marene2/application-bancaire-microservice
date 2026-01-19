/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.APIGatewayWillBank.security;

/**
 *
 * @author DELL
 */
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtService jwtService;

    // Routes publiques (sans authentification)
    private static final List<String> PUBLIC_ROUTES = List.of(
            "/auth/register",
            "/auth/login",
            "/auth/validate"
    );

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        // Permettre l'accès aux routes publiques
        if (isPublicRoute(path)) {
            System.out.println("Route publique autorisée : " + path);
            return chain.filter(exchange);
        }

        // Vérifier la présence du header Authorization
        if (!request.getHeaders().containsKey("Authorization")) {
            System.err.println("Token manquant pour : " + path);
            return onError(exchange, "Token manquant", HttpStatus.UNAUTHORIZED);
        }

        String authHeader = request.getHeaders().getFirst("Authorization");

        // Vérifier le format "Bearer {token}"
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.err.println("Format de token invalide pour : " + path);
            return onError(exchange, "Format de token invalide", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);

        // Valider le token JWT
        if (!jwtService.validateToken(token)) {
            System.err.println("Token invalide pour : " + path);
            return onError(exchange, "Token invalide ou expiré", HttpStatus.UNAUTHORIZED);
        }

        // Extraire les infos du token et les ajouter aux headers
        try {
            String username = jwtService.extractUsername(token);
            String role = jwtService.extractRole(token);

            // Ajouter les infos au header pour les microservices
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-User-Username", username)
                    .header("X-User-Role", role)
                    .build();

            System.out.println("Token valide pour " + username + " (" + role + ") - " + path);

            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (Exception e) {
            System.err.println("Erreur lors de l'extraction du token : " + e.getMessage());
            return onError(exchange, "Erreur lors de la validation du token", HttpStatus.UNAUTHORIZED);
        }
    }

    // Vérifier si la route est publique
    private boolean isPublicRoute(String path) {
        return PUBLIC_ROUTES.stream().anyMatch(path::startsWith);
    }

    // Gérer les erreurs d'authentification
    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        return response.setComplete();
    }

    @Override
    public int getOrder() {
        return -1; // Exécuter ce filtre en premier
    }
}