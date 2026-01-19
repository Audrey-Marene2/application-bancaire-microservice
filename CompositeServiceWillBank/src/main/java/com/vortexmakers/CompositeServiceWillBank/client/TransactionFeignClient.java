/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.CompositeServiceWillBank.client;

/**
 *
 * @author DELL
 */
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "TRANSACTION-SERVICE")
public interface TransactionFeignClient {

    @GetMapping("/transactions/account/{accountId}")
    List<TransactionDto> getTransactionsByAccountId(@PathVariable("accountId") UUID accountId);
}
