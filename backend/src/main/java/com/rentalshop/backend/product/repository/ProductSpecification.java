package com.rentalshop.backend.product.repository;

import com.rentalshop.backend.product.entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ProductSpecification {

    public static Specification<Product> filterBy(
            String keyword,
            Long categoryId,
            String category,
            Double minPrice,
            Double maxPrice,
            String city,
            String district,
            String merchantTier,
            Double rating,
            Map<String, String> eavFilters
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Keyword search (Name, Description, Attributes / Brand)
            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), pattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                Predicate attrMatch = cb.like(cb.lower(root.get("attributes")), pattern);
                predicates.add(cb.or(nameMatch, descMatch, attrMatch));
            }

            // 2. Category ID
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            // 3. Category Name / Slug
            if (category != null && !category.trim().isEmpty()) {
                String catPattern = "%" + category.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("category").get("name")), catPattern));
            }

            // 4. Min Price
            if (minPrice != null && minPrice > 0) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rentPrice"), minPrice));
            }

            // 5. Max Price
            if (maxPrice != null && maxPrice > 0) {
                predicates.add(cb.lessThanOrEqualTo(root.get("rentPrice"), maxPrice));
            }

            // 6. City
            if (city != null && !city.trim().isEmpty() && !city.equalsIgnoreCase("all")) {
                predicates.add(cb.like(cb.lower(root.get("city")), "%" + city.trim().toLowerCase() + "%"));
            }

            // 7. District
            if (district != null && !district.trim().isEmpty() && !district.equalsIgnoreCase("all")) {
                predicates.add(cb.like(cb.lower(root.get("district")), "%" + district.trim().toLowerCase() + "%"));
            }

            // 8. Merchant Tier
            if (merchantTier != null && !merchantTier.trim().isEmpty()) {
                predicates.add(cb.equal(cb.upper(root.get("merchant").get("merchantTier")), merchantTier.trim().toUpperCase()));
            }

            // 9. Minimum Rating
            if (rating != null && rating > 0) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), rating));
            }

            // 10. Dynamic EAV attributes search inside attributes JSON
            if (eavFilters != null && !eavFilters.isEmpty()) {
                for (Map.Entry<String, String> entry : eavFilters.entrySet()) {
                    String val = entry.getValue();
                    if (val != null && !val.trim().isEmpty()) {
                        String pattern = "%" + val.trim().toLowerCase() + "%";
                        predicates.add(cb.like(cb.lower(root.get("attributes")), pattern));
                    }
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
