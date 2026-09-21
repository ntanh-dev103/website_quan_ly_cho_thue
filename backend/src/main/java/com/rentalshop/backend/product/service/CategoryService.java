package com.rentalshop.backend.product.service;

import com.rentalshop.backend.product.dto.response.CategoryResponse;
import com.rentalshop.backend.product.entity.Category;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.product.repository.CategoryRepository;
import java.util.List;
import java.util.stream.Collectors;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(Long id);
    CategoryResponse createCategory(CategoryResponse categoryDto);
    CategoryResponse updateCategory(Long id, CategoryResponse categoryDto);
    void deleteCategory(Long id);
}
