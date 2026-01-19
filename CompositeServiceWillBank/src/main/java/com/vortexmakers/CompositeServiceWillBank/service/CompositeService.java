/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.CompositeServiceWillBank.service;

/**
 *
 * @author DELL
 */
import com.vortexmakers.CompositeServiceWillBank.client.*;
import com.vortexmakers.CompositeServiceWillBank.dto.AccountStatementResponse;
import com.vortexmakers.CompositeServiceWillBank.dto.DashboardResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CompositeService {

    private final ClientFeignClient clientFeignClient;
    private final AccountFeignClient accountFeignClient;
    private final TransactionFeignClient transactionFeignClient;

    public CompositeService(ClientFeignClient clientFeignClient,
            AccountFeignClient accountFeignClient,
            TransactionFeignClient transactionFeignClient) {
        this.clientFeignClient = clientFeignClient;
        this.accountFeignClient = accountFeignClient;
        this.transactionFeignClient = transactionFeignClient;
    }

    // Dashboard : agrégation des infos client + comptes + transactions récentes
    public DashboardResponse getDashboard(UUID customerId) {
        // Récupérer les infos du client
        ClientDto client = clientFeignClient.getClientById(customerId);

        // Récupérer tous les comptes du client
        List<AccountDto> accounts = accountFeignClient.getAccountsByCustomerId(customerId);

        // Calculer le solde total
        BigDecimal totalBalance = accounts.stream()
                .map(AccountDto::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Récupérer les 5 dernières transactions de tous les comptes
        List<TransactionDto> allTransactions = new ArrayList<>();
        for (AccountDto account : accounts) {
            List<TransactionDto> transactions = transactionFeignClient.getTransactionsByAccountId(account.getId());
            allTransactions.addAll(transactions);
        }

        // Trier par date décroissante et prendre les 5 dernières
        List<TransactionDto> recentTransactions = allTransactions.stream()
                .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
                .limit(5)
                .collect(Collectors.toList());

        return new DashboardResponse(client, accounts, totalBalance, recentTransactions);
    }

    // Relevé de compte : infos client + compte + toutes ses transactions
    public AccountStatementResponse getAccountStatement(UUID accountId) {
        // Récupérer le compte
        AccountDto account = accountFeignClient.getAccountById(accountId);

        // Récupérer le client
        ClientDto client = clientFeignClient.getClientById(account.getCustomerId());

        // Récupérer toutes les transactions du compte
        List<TransactionDto> transactions = transactionFeignClient.getTransactionsByAccountId(accountId);

        return new AccountStatementResponse(client, account, transactions);
    }

    // Recherche de transactions avec filtres
    public List<TransactionDto> searchTransactions(String type, String status, String from, String to, UUID accountId) {
        // Pour une implémentation simple, récupérer toutes les transactions et filtrer
        // En production, il faudrait un endpoint dédié dans TransactionService
        List<TransactionDto> allTransactions;

        if (accountId != null) {
            allTransactions = transactionFeignClient.getTransactionsByAccountId(accountId);
        } else {
            // Si pas de accountId spécifié, on pourrait récupérer toutes les transactions
            // Mais pour des raisons de performance, on limite à un accountId obligatoire
            throw new IllegalArgumentException("accountId is required for transaction search");
        }

        return allTransactions.stream()
                .filter(t -> type == null || t.getType().equalsIgnoreCase(type))
                .filter(t -> status == null || t.getStatus().equalsIgnoreCase(status))
                .filter(t -> from == null || t.getCreatedAt().toString().compareTo(from) >= 0)
                .filter(t -> to == null || t.getCreatedAt().toString().compareTo(to) <= 0)
                .collect(Collectors.toList());
    }
}
