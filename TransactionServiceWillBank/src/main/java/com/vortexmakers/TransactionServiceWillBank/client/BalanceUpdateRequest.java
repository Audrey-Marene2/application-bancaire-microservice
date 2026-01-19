/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.TransactionServiceWillBank.client;

/**
 *
 * @author DELL
 */
import java.math.BigDecimal;

public class BalanceUpdateRequest {

    private BigDecimal amount;
    private String operation; // "Ajouter" ou "Retirer"

    // Constructeurs vide
    public BalanceUpdateRequest() {}

    public BalanceUpdateRequest(BigDecimal amount, String operation) {
        this.amount = amount;
        this.operation = operation;
    }

    // GETTERS et SETTERS

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }
}
