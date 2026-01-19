/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.CompositeServiceWillBank.controller;

/**
 *
 * @author DELL
 */
import com.vortexmakers.CompositeServiceWillBank.dto.AccountStatementResponse;
import com.vortexmakers.CompositeServiceWillBank.dto.DashboardResponse;
import com.vortexmakers.CompositeServiceWillBank.service.CompositeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping
public class CompositeController {

    private final CompositeService compositeService;

    public CompositeController(CompositeService compositeService) {
        this.compositeService = compositeService;
    }

    @GetMapping("/dashboard/{customerId}")
    public ResponseEntity<DashboardResponse> getDashboard(@PathVariable UUID customerId) {
        try {
            DashboardResponse dashboard = compositeService.getDashboard(customerId);
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/accounts/{accountId}/statement")
    public ResponseEntity<AccountStatementResponse> getAccountStatement(@PathVariable UUID accountId) {
        try {
            AccountStatementResponse statement = compositeService.getAccountStatement(accountId);
            return ResponseEntity.ok(statement);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/transactions/search")
    public ResponseEntity<?> searchTransactions(@RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) UUID accountId) {
        try {
            var results = compositeService.searchTransactions(type, status, from, to, accountId);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}