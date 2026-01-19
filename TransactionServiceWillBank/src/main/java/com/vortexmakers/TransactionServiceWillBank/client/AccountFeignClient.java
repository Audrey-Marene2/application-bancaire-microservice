/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.TransactionServiceWillBank.client;

/**
 *
 * @author DELL
 */
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@FeignClient(name = "COMPTE-SERVICE")
public interface AccountFeignClient {

    @GetMapping("/accounts/{id}")
    AccountDto getAccountById(@PathVariable("id") UUID id);

    @PutMapping("/accounts/{id}/balance")
    void updateBalance(@PathVariable("id") UUID id, @RequestBody BalanceUpdateRequest request);
}
