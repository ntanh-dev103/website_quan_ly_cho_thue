package com.rentalshop.backend.contract.service;

import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class ThirdPartyLogisticsService {

    private static final String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private final Random random = new Random();

    /**
     * Attempts to create a return shipment via the 3PL API.
     * @param contractId the contract ID
     * @return tracking number from 3PL
     * @throws RuntimeException if 3PL API is unavailable
     */
    public String createReturnShipment(Long contractId) {
        // Mock: simulate a 3PL API call that may fail
        // In production, this would call DHL/GHN/GHTK/etc.
        System.out.println("3PL API: Creating return shipment for contract " + contractId);
        
        // Simulate occasional failure (for demo; in prod this would be a real HTTP call)
        if (random.nextInt(10) < 3) {
            throw new RuntimeException("3PL API unavailable: Connection timeout");
        }
        
        return "3PL-TRK-" + contractId + "-" + System.currentTimeMillis();
    }

    /**
     * Generates a manual return code (RET-XXXX) for the customer to write on the package
     * when 3PL API fails.
     */
    public String generateManualReturnCode() {
        StringBuilder code = new StringBuilder("RET-");
        for (int i = 0; i < 4; i++) {
            code.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        return code.toString();
    }
}
