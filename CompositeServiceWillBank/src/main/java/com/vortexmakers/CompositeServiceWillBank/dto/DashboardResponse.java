/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.CompositeServiceWillBank.dto;

/**
 *
 * @author DELL
 */
import com.vortexmakers.CompositeServiceWillBank.client.AccountDto;
import com.vortexmakers.CompositeServiceWillBank.client.ClientDto;
import com.vortexmakers.CompositeServiceWillBank.client.TransactionDto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardResponse {

    private ClientDto client;
    private List<AccountDto> accounts;
    private BigDecimal totalBalance;
    private List<TransactionDto> recentTransactions;

    public DashboardResponse() {}

    public DashboardResponse(ClientDto client, List<AccountDto> accounts, BigDecimal totalBalance, List<TransactionDto> recentTransactions) {
        this.client = client;
        this.accounts = accounts;
        this.totalBalance = totalBalance;
        this.recentTransactions = recentTransactions;
    }

    // GETTERS et SETTERS

    public ClientDto getClient() {
        return client;
    }

    public void setClient(ClientDto client) {
        this.client = client;
    }

    public List<AccountDto> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<AccountDto> accounts) {
        this.accounts = accounts;
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(BigDecimal totalBalance) {
        this.totalBalance = totalBalance;
    }

    public List<TransactionDto> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionDto> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }
}