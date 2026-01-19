package com.vortexmakers.CompteServiceWillBank;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class CompteServiceWillBankApplication {

    public static void main(String[] args) {
        SpringApplication.run(CompteServiceWillBankApplication.class, args);
    }
}

// Info UUID client + Compte 
//bf176233-a22b-4ade-9318-319de72bb13f //18d573c5-23a1-4afd-ad2b-7cd14d39f847
//5c186875-e0d5-4bd0-9484-f7e2aadfecf0 //9d1e8ea1-2dbf-428e-b84a-381a3d97ff2a
//b7414aad-1dd9-4db3-b727-7ff943e246e8 //09598918-b6e7-4d78-a16d-a2c74ea2f0fa