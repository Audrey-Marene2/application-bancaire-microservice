package com.vortexmakers.AuthServiceWillBank.service;

import com.vortexmakers.AuthServiceWillBank.entity.User;
import com.vortexmakers.AuthServiceWillBank.repository.UserRepository;
import com.vortexmakers.AuthServiceWillBank.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // =========================
    // REGISTER
    // =========================
    public User register(String username, String email, String password) {

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username déjà utilisé");
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }

        User user = new User(
                username,
                email,
                passwordEncoder.encode(password),
                "USER");

        return userRepository.save(user);
    }

    // =========================
    // LOGIN AVEC EMAIL UNIQUEMENT
    // =========================
    public String login(String email, String password) {

        System.out.println("🔐 Tentative de connexion (email) : " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Mot de passe incorrect");
        }

        // JWT basé sur le username (interne)
        return jwtService.generateToken(
                user.getUsername(),
                user.getRole());
    }

    // =========================
    // VALIDATION JWT
    // =========================
    public boolean validateToken(String token) {
        return jwtService.validateToken(token);
    }
}
