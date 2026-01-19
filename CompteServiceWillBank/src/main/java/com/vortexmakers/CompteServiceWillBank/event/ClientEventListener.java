/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.CompteServiceWillBank.event;

/**
 *
 * @author DELL
 */
import com.vortexmakers.CompteServiceWillBank.service.AccountService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class ClientEventListener {

    private final AccountService accountService;

    public ClientEventListener(AccountService accountService) {
        this.accountService = accountService;
    }

    @RabbitListener(queues = "compte.client.events")
    public void handleClientSuspended(ClientSuspendedEvent event) {
        System.out.println("Événement reçu : " + event);

        try {
            accountService.blockAccountsByCustomerId(event.getClientId());
            System.out.println("Tous les comptes du client " + event.getClientId() + " ont été bloqués");
        } catch (Exception e) {
            System.err.println("Erreur lors du blocage des comptes : " + e.getMessage());
        }
    }
}
