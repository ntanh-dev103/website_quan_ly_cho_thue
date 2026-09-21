package com.rentalshop.backend.contract.service;

import com.rentalshop.backend.contract.dto.request.CreateContractRequest;
import com.rentalshop.backend.contract.dto.request.ReturnItemsRequest;
import com.rentalshop.backend.contract.dto.response.ContractResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ContractService {
    ContractResponse createContract(CreateContractRequest request);
    ContractResponse returnItems(Long id, ReturnItemsRequest request);
    ContractResponse cancelContract(Long id);
    Page<ContractResponse> getContracts(Pageable pageable);
    ContractResponse getContractById(Long id);
    ContractResponse extendContract(Long id);
}
