/*
 * TransactionServiceWillBank/src/main/java/com/vortexmakers/TransactionServiceWillBank/controller/TransactionController.java
 * VERSION CORRIGÉE AVEC LOGS DE DEBUG
 */
package com.vortexmakers.TransactionServiceWillBank.controller;

import com.vortexmakers.TransactionServiceWillBank.entity.Transaction;
import com.vortexmakers.TransactionServiceWillBank.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody TransactionRequest request) {
        try {
            // ========== LOGS DE DEBUG ==========
            System.out.println("=== REQUÊTE REÇUE ===");
            System.out.println("Type: " + request.getType());
            System.out.println("AccountId: " + request.getAccountId());
            System.out.println("Amount: " + request.getAmount());
            System.out.println("TargetAccountId: " + request.getTargetAccountId());

            // ========== VALIDATION ==========
            if (request.getType() == null || request.getType().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createError("Le type de transaction est requis"));
            }

            if (request.getAccountId() == null) {
                return ResponseEntity.badRequest().body(createError("L'ID du compte est requis"));
            }

            if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body(createError("Le montant doit être supérieur à zéro"));
            }

            // ========== TRAITEMENT SELON LE TYPE ==========
            Transaction transaction;

            switch (request.getType().toUpperCase()) {
                case "DEPOSIT":
                    System.out.println("💰 Traitement d'un DÉPÔT");
                    transaction = service.deposit(request.getAccountId(), request.getAmount());
                    break;

                case "WITHDRAWAL":
                    System.out.println("💸 Traitement d'un RETRAIT");
                    transaction = service.withdraw(request.getAccountId(), request.getAmount());
                    break;

                case "TRANSFER":
                    System.out.println("🔄 Traitement d'un VIREMENT");

                    // ✅ VALIDATION DU TARGET ACCOUNT
                    if (request.getTargetAccountId() == null) {
                        System.err.println("❌ targetAccountId manquant");
                        return ResponseEntity.badRequest().body(
                                createError("Le compte de destination est requis pour un virement"));
                    }

                    System.out.println("✅ Source: " + request.getAccountId());
                    System.out.println("✅ Destination: " + request.getTargetAccountId());

                    transaction = service.transfer(
                            request.getAccountId(),
                            request.getTargetAccountId(),
                            request.getAmount());
                    break;

                case "PAYMENT":
                    System.out.println("💳 Traitement d'un PAIEMENT");
                    transaction = service.create(createPaymentTransaction(request));
                    break;

                default:
                    System.err.println("❌ Type de transaction inconnu: " + request.getType());
                    return ResponseEntity.badRequest().body(
                            createError("Type de transaction invalide: " + request.getType()));
            }

            System.out.println("✅ Transaction créée avec succès: " + transaction.getId());
            return ResponseEntity.ok(transaction);

        } catch (IllegalStateException e) {
            System.err.println("❌ Erreur métier: " + e.getMessage());
            return ResponseEntity.badRequest().body(createError(e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Erreur inattendue: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(createError("Erreur lors de la transaction"));
        }
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Transaction>> getByAccount(@PathVariable UUID accountId) {
        return ResponseEntity.ok(service.getByAccount(accountId));
    }

    // ========== MÉTHODES UTILITAIRES ==========

    private Transaction createPaymentTransaction(TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setAccountId(request.getAccountId());
        transaction.setAmount(request.getAmount());
        transaction.setType(Transaction.TransactionType.PAYMENT);
        return transaction;
    }

    private Map<String, Object> createError(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("error", message);
        return error;
    }

    // ========== DTO INTERNE ==========

    public static class TransactionRequest {
        private UUID accountId;
        private String type;
        private BigDecimal amount;
        private UUID targetAccountId; // ✅ Pour les virements
        private String merchant; // Pour les paiements
        private String reference; // Pour les paiements

        public TransactionRequest() {
        }

        // GETTERS et SETTERS

        public UUID getAccountId() {
            return accountId;
        }

        public void setAccountId(UUID accountId) {
            this.accountId = accountId;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public UUID getTargetAccountId() {
            return targetAccountId;
        }

        public void setTargetAccountId(UUID targetAccountId) {
            this.targetAccountId = targetAccountId;
        }

        public String getMerchant() {
            return merchant;
        }

        public void setMerchant(String merchant) {
            this.merchant = merchant;
        }

        public String getReference() {
            return reference;
        }

        public void setReference(String reference) {
            this.reference = reference;
        }
    }
}