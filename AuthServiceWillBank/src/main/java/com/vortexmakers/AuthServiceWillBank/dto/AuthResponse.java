/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.AuthServiceWillBank.dto;

/**
 *
 * @author DELL
 */
public class AuthResponse {

    private String token;
    private String type = "Bearer";

    public AuthResponse() {}

    public AuthResponse(String token) {
        this.token = token;
    }

    // GETTERS et SETTERS

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
