package com.vortexmakers.AuthServiceWillBank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AuthServiceWillBankApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceWillBankApplication.class, args);
    }
}

  /*
  "username": "camato",
  "email": "camato@willbank.com",
  "password": "administrator"
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInN1YiI6ImNhbWF0byIsImlhdCI6MTc2ODUxMjM1NiwiZXhwIjoxNzY4NTk4NzU2fQ.AOFgUC1lKKVX2Mg3CvhjOdbhKVgbak4MZQ2uKK10vRo"
  {
  "username": "bob",
  "password": "password123"
  }
{
  "username": "cam",
  "password": "12345678"
  }

*/