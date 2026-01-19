/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.NotificationServiceWillBank.event;

/**
 *
 * @author DELL
 */
import com.vortexmakers.NotificationServiceWillBank.client.AccountDto;
import com.vortexmakers.NotificationServiceWillBank.client.AccountFeignClient;
import com.vortexmakers.NotificationServiceWillBank.entity.Notification;
import com.vortexmakers.NotificationServiceWillBank.service.NotificationService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class EventListener {

    private final NotificationService notificationService;
    private final AccountFeignClient accountFeignClient;

    public EventListener(NotificationService notificationService, AccountFeignClient accountFeignClient) {
        this.notificationService = notificationService;
        this.accountFeignClient = accountFeignClient;
    }
    
    @RabbitListener(queues = "notification.transaction.events")
    public void handleTransactionCompleted(TransactionCompletedEvent event) {
        System.out.println("");
        System.out.println("NOTIFICATION - Transaction complétée");
        System.out.println("");
        System.out.println("Transaction ID: " + event.getTransactionId());
        System.out.println("Compte ID: " + event.getAccountId());
        System.out.println("Type: " + event.getType());
        System.out.println("Montant: " + event.getAmount());
        System.out.println("Date: " + event.getCompletedAt());
        System.out.println("");
        
        // Concerver la notification
        try {
            // Récupérer le customerId via le compte
            AccountDto account = accountFeignClient.getAccountById(event.getAccountId());
            UUID customerId = account.getCustomerId();

            String title = "Transaction " + event.getType();
            String message = String.format(
                    "Votre transaction de type %s d'un montant de %.2fFCFA a été effectuée avec succès.",
                    event.getType(),
                    event.getAmount()
            );

            Notification notification = notificationService.createNotification(
                    customerId,
                    Notification.NotificationChannel.EMAIL,
                    title,
                    message
            );

            System.out.println("Notification enregistrée avec l'ID : " + notification.getId());
        } catch (Exception e) {
            System.err.println("Erreur lors de la persistance : " + e.getMessage());
        }
    }

    @RabbitListener(queues = "notification.client.events")
    public void handleClientCreated(ClientCreatedEvent event) {
        System.out.println("");
        System.out.println("NOTIFICATION - Nouveau client créé");
        System.out.println("");
        System.out.println("Client ID: " + event.getClientId());
        System.out.println("Nom: " + event.getFirstName() + " " + event.getLastName());
        System.out.println("Email: " + event.getEmail());
        System.out.println("Téléphone: " + event.getPhone());
        System.out.println("Date: " + event.getCreatedAt());
        System.out.println("");
        System.out.println("Email de bienvenue envoyé à : " + event.getEmail());
        System.out.println("");
        
        try {
            String title = "Bienvenue chez WillBank";
            String message = String.format(
                    "Bonjour %s %s, bienvenue chez WillBank ! Votre compte a été créé avec succès.",
                    event.getFirstName(),
                    event.getLastName()
            );

            Notification notification = notificationService.createNotification(
                    event.getClientId(),
                    Notification.NotificationChannel.EMAIL,
                    title,
                    message
            );

            System.out.println("Notification enregistrée avec l'ID : " + notification.getId());
        } catch (Exception e) {
            System.err.println("Erreur lors de la persistance : " + e.getMessage());
        }
    }

    @RabbitListener(queues = "notification.account.events")
    public void handleAccountCreated(AccountCreatedEvent event) {
        System.out.println("");
        System.out.println("NOTIFICATION - Nouveau compte créé");
        System.out.println("");
        System.out.println("Compte ID: " + event.getAccountId());
        System.out.println("Client ID: " + event.getCustomerId());
        System.out.println("Type: " + event.getType());
        System.out.println("Solde initial: " + event.getBalance());
        System.out.println("Date: " + event.getCreatedAt());
        System.out.println("");
        System.out.println("Email de confirmation d'ouverture de compte envoyé");
        System.out.println("");
        
        try {
            String title = "Nouveau compte créé";
            String message = String.format(
                    "Votre compte %s a été créé avec succès. Solde initial : %.2fFCFA",
                    event.getType(),
                    event.getBalance()
            );

            Notification notification = notificationService.createNotification(
                    event.getCustomerId(),
                    Notification.NotificationChannel.EMAIL,
                    title,
                    message
            );

            System.out.println("Notification enregistrée avec l'ID : " + notification.getId());
        } catch (Exception e) {
            System.err.println("Erreur lors de la persistance : " + e.getMessage());
        }
    }
    
    //Ici plus tard l'envoi d'email ou de notification push
}
