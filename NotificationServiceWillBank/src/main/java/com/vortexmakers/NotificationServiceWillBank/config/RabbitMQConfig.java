/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.vortexmakers.NotificationServiceWillBank.config;

/**
 *
 * @author DELL
 */
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "willbank.events";
    public static final String TRANSACTION_QUEUE = "notification.transaction.events";
    public static final String CLIENT_QUEUE = "notification.client.events";
    public static final String ACCOUNT_QUEUE = "notification.account.events";

    @Bean
    public TopicExchange eventExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    // Queue pour les transactions
    @Bean
    public Queue transactionQueue() {
        return new Queue(TRANSACTION_QUEUE, true);
    }

    @Bean
    public Binding transactionBinding(Queue transactionQueue, TopicExchange eventExchange) {
        return BindingBuilder
                .bind(transactionQueue)
                .to(eventExchange)
                .with("transaction.*");
    }

    // Queue pour les clients
    @Bean
    public Queue clientQueue() {
        return new Queue(CLIENT_QUEUE, true);
    }

    @Bean
    public Binding clientBinding(Queue clientQueue, TopicExchange eventExchange) {
        return BindingBuilder
                .bind(clientQueue)
                .to(eventExchange)
                .with("client.created"); // On écoute seulement client.created
    }

    // Queue pour les comptes
    @Bean
    public Queue accountQueue() {
        return new Queue(ACCOUNT_QUEUE, true);
    }

    @Bean
    public Binding accountBinding(Queue accountQueue, TopicExchange eventExchange) {
        return BindingBuilder
                .bind(accountQueue)
                .to(eventExchange)
                .with("account.*");
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }

    @Bean
    public MessageConverter jsonMessageConverter(ObjectMapper objectMapper) {
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter jsonMessageConverter) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter);
        return rabbitTemplate;
    }
}
