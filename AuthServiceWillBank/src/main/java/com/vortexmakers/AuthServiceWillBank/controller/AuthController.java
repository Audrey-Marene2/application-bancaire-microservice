/*
 * AuthServiceWillBank/src/main/java/com/vortexmakers/AuthServiceWillBank/controller/AuthController.java
 * VERSION CORRIGÉE AVEC MEILLEURE GESTION DES ERREURS
 */
package com.vortexmakers.AuthServiceWillBank.controller;

import com.vortexmakers.AuthServiceWillBank.dto.AuthResponse;
import com.vortexmakers.AuthServiceWillBank.dto.LoginRequest;
import com.vortexmakers.AuthServiceWillBank.dto.RegisterRequest;
import com.vortexmakers.AuthServiceWillBank.entity.User;
import com.vortexmakers.AuthServiceWillBank.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Validation des champs
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Le nom d'utilisateur est requis"));
            }

            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("L'email est requis"));
            }

            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Le mot de passe est requis"));
            }

            // Créer l'utilisateur
            User user = authService.register(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword());

            // Retourner une réponse de succès
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Utilisateur créé avec succès");
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'inscription : " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur interne du serveur"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Log pour debug
            System.out.println("📥 Tentative de connexion pour : " + request.getUsername());

            // Validation des champs
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                System.err.println("❌ Username vide");
                return ResponseEntity.badRequest().body(createErrorResponse("Le nom d'utilisateur est requis"));
            }

            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                System.err.println("❌ Password vide");
                return ResponseEntity.badRequest().body(createErrorResponse("Le mot de passe est requis"));
            }

            // Authentification
            String token = authService.login(request.getUsername(), request.getPassword());

            System.out.println("✅ Connexion réussie pour : " + request.getUsername());

            // Retourner le token
            return ResponseEntity.ok(new AuthResponse(token));

        } catch (IllegalArgumentException e) {
            System.err.println("❌ Erreur d'authentification : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la connexion : " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur interne du serveur"));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                boolean isValid = authService.validateToken(token);

                Map<String, Object> response = new HashMap<>();
                response.put("valid", isValid);

                return ResponseEntity.ok(response);
            }

            return ResponseEntity.badRequest()
                    .body(createErrorResponse("Token manquant ou invalide"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur lors de la validation du token"));
        }
    }

    // Méthode utilitaire pour créer une réponse d'erreur
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("error", message);
        return error;
    }
}