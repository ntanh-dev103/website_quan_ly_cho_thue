package com.rentalshop.backend.contract.service;

import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class PaymentGatewayService {

    /**
     * Mocks a pre-authorization hold flow for VIP customers.
     * @param amount the amount to hold
     * @return a mock transaction ID for the hold
     */
    public String authorizeHold(Double amount) {
        // In a real scenario, this would call a payment gateway
        System.out.println("PRE-AUTHORIZATION HOLD SUCCESS for amount: " + amount);
        return "HOLD_" + UUID.randomUUID().toString();
    }
}
