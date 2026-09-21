package com.rentalshop.backend.customer.service.impl;

import com.rentalshop.backend.customer.service.CustomerService;

import com.rentalshop.backend.customer.dto.request.CreateCustomerRequest;
import com.rentalshop.backend.customer.dto.response.CustomerResponse;
import com.rentalshop.backend.customer.dto.request.UpdateCustomerRequest;
import com.rentalshop.backend.customer.entity.Customer;
import com.rentalshop.backend.common.exception.ConflictException;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public Page<CustomerResponse> getAllCustomers(String keyword, Pageable pageable) {
        Page<Customer> customers;
        if (keyword != null && !keyword.trim().isEmpty()) {
            customers = customerRepository.findByFullNameContainingIgnoreCaseOrPhoneContaining(keyword, keyword, pageable);
        } else {
            customers = customerRepository.findAll(pageable);
        }
        return customers.map(this::mapToDto);
    }

    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy khách hàng với ID: " + id));
        return mapToDto(customer);
    }

    public CustomerResponse createCustomer(CreateCustomerRequest request) {
        if (customerRepository.existsByPhone(request.getPhone())) {
            throw new ConflictException("Số điện thoại đã tồn tại trong hệ thống");
        }
        
        if (customerRepository.existsByCccd(request.getCccd())) {
            throw new ConflictException("Số CCCD đã tồn tại trong hệ thống");
        }

        Customer customer = Customer.builder()
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .cccd(request.getCccd())
                .address(request.getAddress())
                .build();

        return mapToDto(customerRepository.save(customer));
    }

    public CustomerResponse updateCustomer(Long id, UpdateCustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy khách hàng với ID: " + id));

        // Kiểm tra unique phone nếu có thay đổi
        if (!customer.getPhone().equals(request.getPhone()) && customerRepository.existsByPhone(request.getPhone())) {
            throw new ConflictException("Số điện thoại đã tồn tại trong hệ thống");
        }

        // Kiểm tra unique cccd nếu có thay đổi
        if (!customer.getCccd().equals(request.getCccd()) && customerRepository.existsByCccd(request.getCccd())) {
            throw new ConflictException("Số CCCD đã tồn tại trong hệ thống");
        }

        customer.setFullName(request.getFullName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setCccd(request.getCccd());
        customer.setAddress(request.getAddress());

        return mapToDto(customerRepository.save(customer));
    }

    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new NotFoundException("Không tìm thấy khách hàng với ID: " + id);
        }
        // Hibernate soft delete takes over here
        customerRepository.deleteById(id);
    }

    private CustomerResponse mapToDto(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .fullName(customer.getFullName())
                .phone(customer.getPhone())
                .email(customer.getEmail())
                .cccd(customer.getCccd())
                .address(customer.getAddress())
                .totalSpent(customer.getTotalSpent())
                .tier(customer.getTier())
                .createdAt(customer.getCreatedAt())
                .build();
    }
}
