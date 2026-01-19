/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.client.controller;

/**
 *
 * @author DELL
 */

import com.vortexmakers.client.entity.Client;
import com.vortexmakers.client.service.ClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody Client client) {
        return ResponseEntity.ok(clientService.createClient(client));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClient(@PathVariable UUID id) {
        return clientService.getClientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @GetMapping("/email")
    public ResponseEntity<Client> getByEmail(@RequestParam String email) {
        return clientService.getByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/phone")
    public ResponseEntity<Client> getByPhone(@RequestParam String phone) {
        return clientService.getByPhone(phone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable UUID id, @RequestBody Client updatedClient) {
        return clientService.getClientById(id)
                .map(client -> {
                    updatedClient.setId(client.getId());
                    return ResponseEntity.ok(clientService.updateClient(updatedClient));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<Void> suspendClient(@PathVariable UUID id) {
        clientService.suspendClient(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<Void> activateClient(@PathVariable UUID id) {
        clientService.activateClient(id);
        return ResponseEntity.ok().build();
    }
}

