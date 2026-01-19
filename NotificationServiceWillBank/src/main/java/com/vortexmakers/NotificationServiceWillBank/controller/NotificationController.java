/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.NotificationServiceWillBank.controller;

/**
 *
 * @author DELL
 */
import com.vortexmakers.NotificationServiceWillBank.entity.Notification;
import com.vortexmakers.NotificationServiceWillBank.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Récupérer toutes les notifications
    @GetMapping
    public ResponseEntity<List<Notification>> getAll() {
        return ResponseEntity.ok(notificationService.getAll());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Notification>> getNotificationsByCustomerId(@PathVariable UUID customerId) {
        List<Notification> notifications = notificationService.getNotificationsByCustomerId(customerId);
        return ResponseEntity.ok(notifications);
    }

    // Marquer une notification comme lue
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        try {
            notificationService.markAsRead(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint de test pour envoyer une notification
    @PostMapping("/test")
    public ResponseEntity<Notification> sendTestNotification(@RequestBody TestNotificationRequest request) {
        try {
            Notification notification = notificationService.createNotification(
                request.getCustomerId(),
                Notification.NotificationChannel.valueOf(request.getChannel()),
                request.getTitle(),
                request.getMessage()
            );
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // DTO pour les requêtes de test
    public static class TestNotificationRequest {
        private UUID customerId;
        private String channel;
        private String title;
        private String message;

        public UUID getCustomerId() { return customerId; }
        public void setCustomerId(UUID customerId) { this.customerId = customerId; }
        public String getChannel() { return channel; }
        public void setChannel(String channel) { this.channel = channel; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
