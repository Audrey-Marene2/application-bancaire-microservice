/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.CompteServiceWillBank.controller;

/**
 *
 * @author DELL
 */
import com.vortexmakers.CompteServiceWillBank.entity.Account;
import com.vortexmakers.CompteServiceWillBank.service.AccountService;
import com.vortexmakers.CompteServiceWillBank.dto.BalanceUpdateRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService service;

    public AccountController(AccountService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Account> create(@RequestBody Account account) {
        try {
            return ResponseEntity.ok(service.createAccount(account));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Account>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Récupérer les comptes d'un client
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Account>> getByCustomerId(@PathVariable UUID customerId) {
        return ResponseEntity.ok(service.getByCustomerId(customerId));
    }

    // Geler un compte
    @PutMapping("/{id}/freeze")
    public ResponseEntity<Account> freeze(@PathVariable UUID id) {
        try {
            Account account = service.freezeAccount(id);
            return ResponseEntity.ok(account);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Bloquer un compte
    @PutMapping("/{id}/block")
    public ResponseEntity<Account> block(@PathVariable UUID id) {
        try {
            Account account = service.blockAccount(id);
            return ResponseEntity.ok(account);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Activer un compte
    @PutMapping("/{id}/activate")
    public ResponseEntity<Account> activate(@PathVariable UUID id) {
        try {
            Account account = service.activateAccount(id);
            return ResponseEntity.ok(account);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Fermer un compte
    @PutMapping("/{id}/close")
    public ResponseEntity<Account> close(@PathVariable UUID id) {
        try {
            Account account = service.closeAccount(id);
            return ResponseEntity.ok(account);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        try {
            service.closeAccount(id);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Mise à jour du solde (endpoint interne, appelé par Transaction Service)
    @PutMapping("/{id}/balance")
    public ResponseEntity<Void> updateBalance(
            @PathVariable UUID id,
            @RequestBody BalanceUpdateRequest request) {
        try {
            service.updateBalance(id, request);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
