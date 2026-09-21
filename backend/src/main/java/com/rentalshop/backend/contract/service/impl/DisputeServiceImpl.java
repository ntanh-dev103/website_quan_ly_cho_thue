package com.rentalshop.backend.contract.service.impl;

import com.rentalshop.backend.common.exception.BadRequestException;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.contract.dto.response.ContractDetailResponse;
import com.rentalshop.backend.contract.dto.response.ContractResponse;
import com.rentalshop.backend.contract.entity.Contract;
import com.rentalshop.backend.contract.enums.EscrowStatus;
import com.rentalshop.backend.contract.enums.PaymentType;
import com.rentalshop.backend.contract.entity.Payment;
import com.rentalshop.backend.contract.repository.ContractRepository;
import com.rentalshop.backend.contract.repository.PaymentRepository;
import com.rentalshop.backend.contract.service.DisputeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DisputeServiceImpl implements DisputeService {

    private final ContractRepository contractRepository;
    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public ContractResponse openDispute(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hợp đồng"));

        if (contract.getEscrowStatus() != EscrowStatus.HELD) {
            throw new BadRequestException("Chỉ có thể mở tranh chấp khi escrow đang ở trạng thái HELD");
        }

        contract.setEscrowStatus(EscrowStatus.DISPUTED);
        log.info("Dispute opened for contract {}", contractId);
        return mapToDto(contractRepository.save(contract));
    }

    @Override
    @Transactional
    public ContractResponse arbitrate(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hợp đồng"));

        if (contract.getEscrowStatus() != EscrowStatus.DISPUTED) {
            throw new BadRequestException("Chỉ có thể phân xử khi escrow đang ở trạng thái DISPUTED");
        }

        // V2.0 Rule 8: Set 48h counter-appeal window
        contract.setEscrowStatus(EscrowStatus.ARBITRATION_PENDING);
        contract.setDisputeDeadline(LocalDateTime.now().plusHours(48));
        log.info("Arbitration completed for contract {}. Counter-appeal window open until {}",
                contractId, contract.getDisputeDeadline());
        return mapToDto(contractRepository.save(contract));
    }

    @Override
    @Transactional
    public ContractResponse counterAppeal(Long contractId, String newEvidence) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hợp đồng"));

        if (contract.getEscrowStatus() != EscrowStatus.ARBITRATION_PENDING) {
            throw new BadRequestException("Chỉ có thể phản đối khi escrow đang ở trạng thái ARBITRATION_PENDING");
        }

        if (contract.getDisputeDeadline() != null && LocalDateTime.now().isAfter(contract.getDisputeDeadline())) {
            throw new BadRequestException("Cửa sổ phản đối 48h đã hết hạn");
        }

        // Reset to DISPUTED for re-arbitration with new evidence
        contract.setEscrowStatus(EscrowStatus.DISPUTED);
        contract.setDisputeDeadline(null);
        log.info("Counter-appeal received for contract {} with new evidence. Reset to DISPUTED.", contractId);
        return mapToDto(contractRepository.save(contract));
    }

    @Override
    @Transactional
    public ContractResponse releaseEscrow(Long contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hợp đồng"));

        if (contract.getEscrowStatus() == EscrowStatus.RELEASED
                || contract.getEscrowStatus() == EscrowStatus.PAYOUT_COMPLETED) {
            throw new BadRequestException("Escrow đã được giải phóng hoặc đã thanh toán");
        }

        contract.setEscrowStatus(EscrowStatus.RELEASED);

        // Record escrow release in ledger
        double payoutAmount = contract.getDepositAmount() - contract.getPenaltyFee() - contract.getCompensationFee();
        if (payoutAmount > 0) {
            String trx = UUID.randomUUID().toString();
            paymentRepository.save(Payment.builder()
                    .contract(contract)
                    .transactionId(trx)
                    .accountId("SYS_ESCROW")
                    .paymentType(PaymentType.REFUND)
                    .debitAmount(payoutAmount)
                    .creditAmount(0.0)
                    .build());
            paymentRepository.save(Payment.builder()
                    .contract(contract)
                    .transactionId(trx)
                    .accountId("CUST_" + contract.getCustomer().getId())
                    .paymentType(PaymentType.REFUND)
                    .debitAmount(0.0)
                    .creditAmount(payoutAmount)
                    .build());
        }

        log.info("Escrow released for contract {}. Payout: {}", contractId, payoutAmount);
        return mapToDto(contractRepository.save(contract));
    }

    private ContractResponse mapToDto(Contract contract) {
        return ContractResponse.builder()
                .id(contract.getId())
                .customerId(contract.getCustomer().getId())
                .customerName(contract.getCustomer().getFullName())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .totalRentFee(contract.getTotalRentFee())
                .depositAmount(contract.getDepositAmount())
                .penaltyFee(contract.getPenaltyFee())
                .compensationFee(contract.getCompensationFee())
                .paymentMethod(contract.getPaymentMethod())
                .status(contract.getStatus())
                .escrowStatus(contract.getEscrowStatus())
                .manualReturnCode(contract.getManualReturnCode())
                .details(contract.getDetails() != null ? contract.getDetails().stream()
                        .map(d -> ContractDetailResponse.builder()
                                .id(d.getId())
                                .itemId(d.getItem().getId())
                                .skuCode(d.getItem().getSkuCode())
                                .actualReturnDate(d.getActualReturnDate())
                                .isReturned(d.getIsReturned())
                                .isDamaged(d.getIsDamaged())
                                .build())
                        .collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }
}
