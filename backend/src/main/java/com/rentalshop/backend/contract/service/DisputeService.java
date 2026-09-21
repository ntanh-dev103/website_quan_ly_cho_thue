package com.rentalshop.backend.contract.service;

import com.rentalshop.backend.contract.dto.response.ContractResponse;

public interface DisputeService {
    ContractResponse openDispute(Long contractId);
    ContractResponse arbitrate(Long contractId);
    ContractResponse counterAppeal(Long contractId, String newEvidence);
    ContractResponse releaseEscrow(Long contractId);
}
