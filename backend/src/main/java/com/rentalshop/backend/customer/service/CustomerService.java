package com.rentalshop.backend.customer.service;

import com.rentalshop.backend.customer.dto.request.CreateCustomerRequest;
import com.rentalshop.backend.customer.dto.response.CustomerResponse;
import com.rentalshop.backend.customer.dto.request.UpdateCustomerRequest;
import com.rentalshop.backend.customer.entity.Customer;
import com.rentalshop.backend.common.exception.ConflictException;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.customer.repository.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerService {
    Page<CustomerResponse> getAllCustomers(String keyword, Pageable pageable);
    CustomerResponse getCustomerById(Long id);
    CustomerResponse createCustomer(CreateCustomerRequest request);
    CustomerResponse updateCustomer(Long id, UpdateCustomerRequest request);
    void deleteCustomer(Long id);
}
