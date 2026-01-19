/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.CompteServiceWillBank.event;

/**
 *
 * @author DELL
 */
import com.fasterxml.jackson.annotation.JsonFormat;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class AccountCreatedEvent implements Serializable {

    private UUID accountId;
    private UUID customerId;
    private String type; // CURRENT, SAVINGS
    private BigDecimal balance;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    // Constructeurs
    public AccountCreatedEvent() {}

    public AccountCreatedEvent(UUID accountId, UUID customerId, String type, BigDecimal balance) {
        this.accountId = accountId;
        this.customerId = customerId;
        this.type = type;
        this.balance = balance;
        this.createdAt = LocalDateTime.now();
    }

    // GETTERS et SETTERS

    public UUID getAccountId() {
        return accountId;
    }

    public void setAccountId(UUID accountId) {
        this.accountId = accountId;
    }

    public UUID getCustomerId() {
        return customerId;
    }

    public void setCustomerId(UUID customerId) {
        this.customerId = customerId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "AccountCreatedEvent{" +
                "accountId=" + accountId +
                ", customerId=" + customerId +
                ", type='" + type + '\'' +
                ", balance=" + balance +
                ", createdAt=" + createdAt +
                '}';
    }
}
