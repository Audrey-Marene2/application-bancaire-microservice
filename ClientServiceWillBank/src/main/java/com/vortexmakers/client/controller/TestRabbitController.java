/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.client.controller;

/**
 *
 * @author DELL
 */
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestRabbitController {

    private final RabbitTemplate rabbitTemplate;

    public TestRabbitController(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @GetMapping("/rabbit")
    public String testRabbit() {
        rabbitTemplate.convertAndSend("willbank.events", "client.test", "Test message");
        return "Message envoyé à RabbitMQ !";
    }
}
