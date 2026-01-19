/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.client.service;

/**
 *
 * @author DELL
 */
import com.vortexmakers.client.entity.Client;
import com.vortexmakers.client.event.ClientSuspendedEvent;
import com.vortexmakers.client.event.ClientCreatedEvent;
import com.vortexmakers.client.event.EventPublisher;
import com.vortexmakers.client.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final EventPublisher eventPublisher;

    public ClientService(ClientRepository clientRepository, EventPublisher eventPublisher) {
        this.clientRepository = clientRepository;
        this.eventPublisher = eventPublisher;
    }

    public Client createClient(Client client) {
        if (client.getAddress() == null) {
            client.setAddress("N/A");
        }

        if (client.getStatus() == null) {
            client.setStatus(Client.Status.ACTIVE);
        }

        if (client.getCreatedBy() == null) {
            client.setCreatedBy("SYSTEM");
        }

        Client savedClient = clientRepository.save(client);

        // Publier l'événement ClientCreated
        ClientCreatedEvent event = new ClientCreatedEvent(
                savedClient.getId(),
                savedClient.getFirstName(),
                savedClient.getLastName(),
                savedClient.getEmail(),
                savedClient.getPhone()
        );
        eventPublisher.publishClientCreated(event);

        return savedClient;
    }

    public Optional<Client> getClientById(UUID id) {
        return clientRepository.findById(id);
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Optional<Client> getByEmail(String email) {
        return clientRepository.findByEmail(email);
    }

    public Optional<Client> getByPhone(String phone) {
        return clientRepository.findByPhone(phone);
    }

    public Client updateClient(Client client) {
        return clientRepository.save(client);
    }

    public void suspendClient(UUID id) {
        clientRepository.findById(id).ifPresent(client -> {
            client.setStatus(Client.Status.SUSPENDED);
            clientRepository.save(client);

            // Publier l'événement
            ClientSuspendedEvent event = new ClientSuspendedEvent(
                    client.getId(),
                    client.getEmail(),
                    "Client suspendu par le système"
            );
            eventPublisher.publishClientSuspended(event);
        });
    }

    public void activateClient(UUID id) {
        clientRepository.findById(id).ifPresent(client -> {
            client.setStatus(Client.Status.ACTIVE);
            clientRepository.save(client);
        });
    }
}