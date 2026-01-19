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

import java.util.List;

public class AccountStatementResponse {

    private ClientDto client;
    private AccountDto account;
    private List<TransactionDto> transactions;

    public AccountStatementResponse() {}

    public AccountStatementResponse(ClientDto client, AccountDto account, List<TransactionDto> transactions) {
        this.client = client;
        this.account = account;
        this.transactions = transactions;
    }

    // GETTERS et SETTERS

    public ClientDto getClient() {
        return client;
    }

    public void setClient(ClientDto client) {
        this.client = client;
    }

    public AccountDto getAccount() {
        return account;
    }

    public void setAccount(AccountDto account) {
        this.account = account;
    }

    public List<TransactionDto> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<TransactionDto> transactions) {
        this.transactions = transactions;
    }
}
