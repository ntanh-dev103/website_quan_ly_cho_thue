package com.rentalshop.backend.contract.controller;

import com.rentalshop.backend.common.response.ApiResponse;
import com.rentalshop.backend.common.response.PaginationResponse;
import com.rentalshop.backend.contract.dto.response.ContractResponse;
import com.rentalshop.backend.contract.dto.request.CreateContractRequest;
import com.rentalshop.backend.contract.dto.request.ReturnItemsRequest;
import com.rentalshop.backend.contract.service.ContractService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @PostMapping
    public ResponseEntity<ApiResponse<ContractResponse>> createContract(@Valid @RequestBody CreateContractRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created(contractService.createContract(request)));
    }

    @PostMapping("/{id}/return-items")
    public ResponseEntity<ApiResponse<ContractResponse>> returnItems(
            @PathVariable Long id,
            @RequestBody ReturnItemsRequest request) {
        return ResponseEntity.ok(ApiResponse.success(contractService.returnItems(id, request)));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<ContractResponse>> cancelContract(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(contractService.cancelContract(id)));
    }

    @PostMapping("/{id}/extend")
    public ResponseEntity<ApiResponse<ContractResponse>> extendContract(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(contractService.extendContract(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PaginationResponse<ContractResponse>>> getContracts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ContractResponse> contracts = contractService.getContracts(pageable);
        return ResponseEntity.ok(ApiResponse.success(PaginationResponse.from(contracts)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContractResponse>> getContractById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(contractService.getContractById(id)));
    }
}
