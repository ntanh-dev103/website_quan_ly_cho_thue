package com.rentalshop.backend.contract.service;

import com.rentalshop.backend.contract.dto.request.CreateContractRequest;
import com.rentalshop.backend.contract.dto.request.DamageAssessmentRequest;
import com.rentalshop.backend.contract.dto.request.ReturnItemsRequest;
import com.rentalshop.backend.contract.dto.response.ContractResponse;
import com.rentalshop.backend.contract.enums.ContractStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContractService {
    ContractResponse createContract(CreateContractRequest request);
    ContractResponse depositContract(Long id);
    ContractResponse handoverContract(Long id);
    ContractResponse returnItems(Long id, ReturnItemsRequest request);
    ContractResponse assessDamage(Long id, DamageAssessmentRequest request);
    ContractResponse cancelContract(Long id);
    Page<ContractResponse> getContracts(Pageable pageable);
    Page<ContractResponse> getContracts(Long customerId, ContractStatus status, Pageable pageable);
    ContractResponse getContractById(Long id);
    ContractResponse extendContract(Long id);
}

