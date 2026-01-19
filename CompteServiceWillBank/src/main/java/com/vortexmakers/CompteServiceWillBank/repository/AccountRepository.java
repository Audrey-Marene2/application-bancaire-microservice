/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.CompteServiceWillBank.repository;

/**
 *
 * @author DELL
 */
import com.vortexmakers.CompteServiceWillBank.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {

    Optional<Account> findByCustomerIdAndType(
            UUID customerId,
            Account.AccountType type
    );
    
    // NOUVEAU : Récupérer tous les comptes d'un client
    List<Account> findByCustomerId(UUID customerId);
}
