/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.NotificationServiceWillBank.service;

/**
 *
 * @author DELL
 */
import com.vortexmakers.NotificationServiceWillBank.entity.Notification;
import com.vortexmakers.NotificationServiceWillBank.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    // Récupérer toutes les notifications
    public List<Notification> getAll() {
        return repository.findAll();
    }

    // Créer et persister une notification
    public Notification createNotification(UUID customerId, 
                                          Notification.NotificationChannel channel,
                                          String title, 
                                          String message) {
        Notification notification = new Notification(
                customerId,
                channel,
                title,
                message,
                Notification.NotificationStatus.SENT
        );

        return repository.save(notification);
    }

    // Récupérer toutes les notifications d'un client
    public List<Notification> getNotificationsByCustomerId(UUID customerId) {
        return repository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    // Marquer une notification comme lue
    public void markAsRead(UUID notificationId) {
        repository.findById(notificationId).ifPresent(notification -> {
            notification.setStatus(Notification.NotificationStatus.READ);
            repository.save(notification);
        });
    }

    // Marquer une notification comme échouée
    public void markAsFailed(UUID notificationId) {
        repository.findById(notificationId).ifPresent(notification -> {
            notification.setStatus(Notification.NotificationStatus.FAILED);
            repository.save(notification);
        });
    }
}
