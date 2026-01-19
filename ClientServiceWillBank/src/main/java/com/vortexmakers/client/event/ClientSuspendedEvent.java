/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.client.event;

/**
 *
 * @author DELL
 */
import com.fasterxml.jackson.annotation.JsonFormat;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

public class ClientSuspendedEvent implements Serializable {

    private UUID clientId;
    private String email;
    private String reason;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime suspendedAt;

    // Constructeurs
    public ClientSuspendedEvent() {}

    public ClientSuspendedEvent(UUID clientId, String email, String reason) {
        this.clientId = clientId;
        this.email = email;
        this.reason = reason;
        this.suspendedAt = LocalDateTime.now();
    }

    // GETTERS et SETTERS

    public UUID getClientId() {
        return clientId;
    }

    public void setClientId(UUID clientId) {
        this.clientId = clientId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getSuspendedAt() {
        return suspendedAt;
    }

    public void setSuspendedAt(LocalDateTime suspendedAt) {
        this.suspendedAt = suspendedAt;
    }

    @Override
    public String toString() {
        return "ClientSuspendedEvent{" +
                "clientId=" + clientId +
                ", email='" + email + '\'' +
                ", reason='" + reason + '\'' +
                ", suspendedAt=" + suspendedAt +
                '}';
    }
}