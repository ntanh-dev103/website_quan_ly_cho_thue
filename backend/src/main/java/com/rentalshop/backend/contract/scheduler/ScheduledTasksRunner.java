package com.rentalshop.backend.contract.scheduler;

import com.rentalshop.backend.common.repository.IdempotencyKeyRepository;
import com.rentalshop.backend.contract.entity.Contract;
import com.rentalshop.backend.contract.enums.ContractStatus;
import com.rentalshop.backend.contract.enums.EscrowStatus;
import com.rentalshop.backend.contract.enums.PaymentType;
import com.rentalshop.backend.contract.entity.Payment;
import com.rentalshop.backend.contract.repository.ContractRepository;
import com.rentalshop.backend.contract.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class ScheduledTasksRunner {

    private final ContractRepository contractRepository;
    private final PaymentRepository paymentRepository;
    private final IdempotencyKeyRepository idempotencyKeyRepository;

    // ═══════════════════════════════════════════════════════════════
    // V1.0: Cascade Alert for 24h Return Rule — runs every hour
    // ═══════════════════════════════════════════════════════════════
    @Scheduled(fixedRate = 3600000)
    public void cascadeAlertsForReturns() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime alertTimeStart = now.plusHours(3);
        LocalDateTime alertTimeEnd = now.plusHours(4);

        List<Contract> contracts = contractRepository.findAll();
        for (Contract contract : contracts) {
            if (contract.getStatus() == ContractStatus.ACTIVE) {
                if (contract.getEndDate().isAfter(alertTimeStart) && contract.getEndDate().isBefore(alertTimeEnd)) {
                    log.info("CASCADE ALERT: Zalo/SMS sent to customer {} for contract {}. Please return or extend (+12h).",
                            contract.getCustomer().getPhone(), contract.getId());
                }
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // V2.0 Rule 4: Idempotency Cleanup — purge keys older than 24h
    // Runs every hour
    // ═══════════════════════════════════════════════════════════════
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void purgeExpiredIdempotencyKeys() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        idempotencyKeyRepository.deleteByCreatedAtBefore(cutoff);
        log.info("Idempotency cleanup: purged keys older than {}", cutoff);
    }

    // ═══════════════════════════════════════════════════════════════
    // V2.0 Rule 8: Dispute SLA — auto-payout after 48h window
    // Runs every 15 minutes
    // ═══════════════════════════════════════════════════════════════
    @Scheduled(fixedRate = 900000)
    @Transactional
    public void executeEscrowPayoutsAfterDisputeWindow() {
        LocalDateTime now = LocalDateTime.now();
        List<Contract> contracts = contractRepository.findAll();

        for (Contract contract : contracts) {
            if (contract.getEscrowStatus() == EscrowStatus.ARBITRATION_PENDING
                    && contract.getDisputeDeadline() != null
                    && contract.getDisputeDeadline().isBefore(now)) {

                // 48h window expired without new evidence → execute payout
                contract.setEscrowStatus(EscrowStatus.PAYOUT_COMPLETED);

                // Record the escrow release in the ledger
                String trxPayout = UUID.randomUUID().toString();
                double payoutAmount = contract.getDepositAmount() - contract.getPenaltyFee() - contract.getCompensationFee();

                if (payoutAmount > 0) {
                    paymentRepository.save(Payment.builder()
                            .contract(contract)
                            .transactionId(trxPayout)
                            .accountId("SYS_ESCROW")
                            .paymentType(PaymentType.REFUND)
                            .debitAmount(payoutAmount)
                            .creditAmount(0.0)
                            .build());

                    paymentRepository.save(Payment.builder()
                            .contract(contract)
                            .transactionId(trxPayout)
                            .accountId("CUST_" + contract.getCustomer().getId())
                            .paymentType(PaymentType.REFUND)
                            .debitAmount(0.0)
                            .creditAmount(payoutAmount)
                            .build());
                }

                contractRepository.save(contract);
                log.info("ESCROW PAYOUT: Contract {} dispute window expired. Payout of {} executed. Status → PAYOUT_COMPLETED",
                        contract.getId(), payoutAmount);
            }
        }
    }
}
