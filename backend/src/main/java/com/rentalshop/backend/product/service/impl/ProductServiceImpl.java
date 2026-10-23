package com.rentalshop.backend.product.service.impl;

import com.rentalshop.backend.product.service.ProductService;
import com.rentalshop.backend.product.dto.response.ProductResponse;
import com.rentalshop.backend.product.entity.Category;
import com.rentalshop.backend.product.entity.Product;
import com.rentalshop.backend.auth.entity.User;
import com.rentalshop.backend.auth.repository.UserRepository;
import com.rentalshop.backend.common.exception.NotFoundException;
import com.rentalshop.backend.product.repository.CategoryRepository;
import com.rentalshop.backend.product.repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import com.rentalshop.backend.common.response.PaginationResponse;
import com.rentalshop.backend.product.repository.ProductSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import java.util.Map;

import com.rentalshop.backend.product.dto.response.ProductAvailabilityResponse;
import com.rentalshop.backend.product.dto.response.DateRangeDto;
import com.rentalshop.backend.product.entity.ProductItem;
import com.rentalshop.backend.product.enums.ItemStatus;
import com.rentalshop.backend.product.repository.ProductItemRepository;
import com.rentalshop.backend.contract.entity.Contract;
import com.rentalshop.backend.contract.repository.ContractRepository;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProductItemRepository productItemRepository;
    private final ContractRepository contractRepository;

    @PostConstruct
    public void initProductData() {
        if (categoryRepository.count() == 0) {
            Category cat1 = categoryRepository.save(Category.builder().name("Máy ảnh & Quay phim").description("Máy ảnh mirrorless, cinema, lens cao cấp").build());
            Category cat2 = categoryRepository.save(Category.builder().name("Thiết bị Âm thanh - Ánh sáng").description("Loa biểu diễn, mixer, đèn studio").build());
            Category cat3 = categoryRepository.save(Category.builder().name("Phương tiện di chuyển").description("Xe máy phượt, ô tô du lịch tự lái").build());
            Category cat4 = categoryRepository.save(Category.builder().name("Trang phục sự kiện").description("Áo dài, veston dạ hội, cosplay cao cấp").build());
            Category cat5 = categoryRepository.save(Category.builder().name("Flycam & Gimbal").description("Drone quay 4K/8K, gimbal chống rung").build());
            Category cat6 = categoryRepository.save(Category.builder().name("Dã ngoại & Cắm trại").description("Lều glamping, túi ngủ, bàn ghế dã ngoại").build());

            if (productRepository.count() == 0) {
                User merchant = userRepository.findByUsernameOrEmail("merchant@demo.com")
                        .orElse(userRepository.findAll().stream().filter(u -> u.getRole().name().contains("MERCHANT")).findFirst().orElse(null));

                seedProduct("Sony FX3 Cinema Line Full-Frame", 
                        "Máy quay phim chuẩn điện ảnh 4K/120fps, cảm biến BSI full-frame 12.1MP với quạt tản nhiệt chủ động.",
                        850000.0, 15000000.0, cat1, merchant,
                        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
                        "TP. Hồ Chí Minh", "Quận 1", true, 4.9, 38,
                        "{\"brand\":\"Sony\",\"mount\":\"E-mount\",\"sensor\":\"Full-Frame\",\"resolution\":\"12.1MP\",\"frameRate\":\"120fps\"}");

                seedProduct("Canon EOS R5 Mirrorless 8K Video", 
                        "Body máy ảnh Canon R5 cảm biến 45MP, lấy nét Dual Pixel AF II mượt mà, hỗ trợ quay video 8K RAW.",
                        750000.0, 12000000.0, cat1, merchant,
                        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
                        "Hà Nội", "Cầu Giấy", true, 4.8, 24,
                        "{\"brand\":\"Canon\",\"mount\":\"RF-mount\",\"sensor\":\"Full-Frame\",\"resolution\":\"45MP\",\"frameRate\":\"120fps\"}");

                seedProduct("DJI Mavic 3 Pro Cine Combo Flycam", 
                        "Flycam 3 camera quang học Hasselblad 4/3 CMOS, cảm biến đa hướng, thời lượng pin 43 phút.",
                        950000.0, 18000000.0, cat5, merchant,
                        "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
                        "Đà Nẵng", "Hải Châu", true, 5.0, 19,
                        "{\"brand\":\"DJI\",\"sensor\":\"4/3 CMOS\",\"resolution\":\"5.1K\",\"flightTime\":\"43 phút\"}");

                seedProduct("Vespa Primavera 125cc Du Lịch Đà Lạt", 
                        "Xe tay ga phong cách cổ điển thanh lịch, máy êm, tiết kiệm xăng, trang bị sẵn giá đèo đồ.",
                        220000.0, 3000000.0, cat3, merchant,
                        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
                        "Đà Lạt", "Phường 1", true, 4.9, 52,
                        "{\"brand\":\"Piaggio\",\"engineCapacity\":\"125cc\",\"fuelCapacity\":\"7L\",\"transmission\":\"Tự động\"}");

                seedProduct("Gói Âm Thanh Sự Kiện JBL EON ONE", 
                        "Hệ thống loa array liền công suất all-in-one công suất 380W, mixer 6 kênh kết nối Bluetooth tiện lợi.",
                        600000.0, 8000000.0, cat2, merchant,
                        "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
                        "TP. Hồ Chí Minh", "Bình Thạnh", true, 4.7, 15,
                        "{\"brand\":\"JBL\",\"power\":\"380W\",\"connectivity\":\"Bluetooth\"}");

                seedProduct("Set Lều Glamping Naturehike Village 13", 
                        "Lều cắm trại biệt thự 2 phòng ngủ chống mưa gió vượt trội, đi kèm thảm cách nhiệt và đèn bão vintage.",
                        350000.0, 2500000.0, cat6, merchant,
                        "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80",
                        "Hà Nội", "Tây Hồ", true, 4.8, 29, 64,
                        "{\"brand\":\"Naturehike\",\"capacity\":\"4-8 người\",\"material\":\"Oxford 210D\"}");

                seedProduct("Váy Dạ Hội Đỏ Ruby Haute Couture", 
                        "Đầm dạ hội đuôi cá thiết kế đính kết pha lê thủ công, phù hợp thảm đỏ tiệc tối và sự kiện cao cấp.",
                        450000.0, 2000000.0, cat4, merchant,
                        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
                        "TP. Hồ Chí Minh", "Quận 3", true, 4.9, 41, 88,
                        "{\"brand\":\"Haute Couture\",\"size\":\"M\",\"color\":\"Đỏ Ruby\",\"material\":\"Lụa\"}");

                seedProduct("Bộ Vest Tuxedo Ý Cao Cấp Kèm Nơ", 
                        "Bộ suit dạ tiệc chuẩn may đo phong cách Ý, chất liệu len pha cashmere cao cấp, chống nhăn thoáng khí.",
                        380000.0, 1800000.0, cat4, merchant,
                        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
                        "Hà Nội", "Ba Đình", true, 4.8, 33, 72,
                        "{\"brand\":\"Milano Tailor\",\"size\":\"L\",\"color\":\"Đen\",\"material\":\"Wool Cashmere\"}");

                seedProduct("VinFast VF8 Plus SUV Điện Thông Minh", 
                        "Xe điện tự lái 5 chỗ cao cấp, quãng đường 471km/lần sạc, trang bị ADAS cấp độ 2, màn hình 15.6 inch.",
                        1400000.0, 15000000.0, cat3, merchant,
                        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
                        "TP. Hồ Chí Minh", "Quận 7", true, 5.0, 28, 45,
                        "{\"brand\":\"VinFast\",\"power\":\"402hp\",\"range\":\"471km\",\"transmission\":\"Tự động\"}");
            }
        }
    }

    private void seedProduct(String name, String desc, Double rent, Double deposit, Category cat, User merchant,
                             String thumb, String city, String district, boolean featured, Double rating, Integer reviews, Integer rentals, String attributes) {
        Product p = Product.builder()
                .name(name)
                .description(desc)
                .rentPrice(rent)
                .depositPrice(deposit)
                .category(cat)
                .merchant(merchant)
                .thumbnail(thumb)
                .images(thumb)
                .city(city)
                .district(district)
                .featured(featured)
                .rating(rating)
                .totalReviews(reviews)
                .totalRentals(rentals)
                .attributes(attributes)
                .build();
        Product saved = productRepository.save(p);
        if (productItemRepository.findByProductId(saved.getId()).isEmpty()) {
            for (int i = 1; i <= 3; i++) {
                String cleanName = saved.getName().replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
                String prefix = cleanName.length() >= 6 ? cleanName.substring(0, 6) : cleanName;
                productItemRepository.save(ProductItem.builder()
                        .product(saved)
                        .skuCode(prefix + "-00" + i)
                        .status(ItemStatus.AVAILABLE)
                        .notes("Mới 99%, đầy đủ phụ kiện & kiểm định")
                        .build());
            }
        }
    }

    private void seedProduct(String name, String desc, Double rent, Double deposit, Category cat, User merchant,
                             String thumb, String city, String district, boolean featured, Double rating, Integer reviews, String attributes) {
        seedProduct(name, desc, rent, deposit, cat, merchant, thumb, city, district, featured, rating, reviews, reviews * 2 + 5, attributes);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public PaginationResponse<ProductResponse> searchProducts(
            String keyword,
            Long categoryId,
            String category,
            Double minPrice,
            Double maxPrice,
            String city,
            String district,
            String merchantTier,
            Double rating,
            Map<String, String> eavFilters,
            Pageable pageable
    ) {
        Specification<Product> spec = ProductSpecification.filterBy(
                keyword, categoryId, category, minPrice, maxPrice,
                city, district, merchantTier, rating, eavFilters
        );
        Page<Product> page = productRepository.findAll(spec, pageable);
        List<ProductResponse> dtos = page.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return PaginationResponse.<ProductResponse>builder()
                .content(dtos)
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .currentPage(page.getNumber())
                .pageSize(page.getSize())
                .build();
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm với ID: " + id));
        return mapToDto(product);
    }

    public ProductAvailabilityResponse getProductAvailability(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        List<ProductItem> items = productItemRepository.findByProductId(id);
        int totalItems = items.isEmpty() ? 3 : items.size();
        long availableCount = items.isEmpty() ? 3 : items.stream().filter(i -> i.getStatus() == ItemStatus.AVAILABLE).count();

        List<Contract> contracts = contractRepository.findActiveContractsByProductId(id);
        List<DateRangeDto> busyRanges = contracts.stream()
                .filter(c -> c.getStartDate() != null && c.getEndDate() != null)
                .map(c -> DateRangeDto.builder()
                        .startDate(c.getStartDate())
                        .endDate(c.getEndDate())
                        .build())
                .collect(Collectors.toList());

        return ProductAvailabilityResponse.builder()
                .productId(product.getId())
                .productName(product.getName())
                .totalItems(totalItems)
                .availableItems((int) availableCount)
                .isAvailable(availableCount > 0)
                .bookedDateRanges(busyRanges)
                .build();
    }


    public ProductResponse createProduct(ProductResponse productDto) {
        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy danh mục với ID: " + productDto.getCategoryId()));

        Product product = Product.builder()
                .name(productDto.getName())
                .description(productDto.getDescription())
                .rentPrice(productDto.getRentPrice())
                .depositPrice(productDto.getDepositPrice())
                .category(category)
                .thumbnail(productDto.getThumbnail())
                .images(productDto.getImages())
                .city(productDto.getCity())
                .district(productDto.getDistrict())
                .featured(productDto.getFeatured() != null ? productDto.getFeatured() : false)
                .rating(productDto.getRating() != null ? productDto.getRating() : 5.0)
                .totalReviews(productDto.getTotalReviews() != null ? productDto.getTotalReviews() : 0)
                .totalRentals(productDto.getTotalRentals() != null ? productDto.getTotalRentals() : 0)
                .build();
                
        return mapToDto(productRepository.save(product));
    }

    public ProductResponse updateProduct(Long id, ProductResponse productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm với ID: " + id));
                
        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy danh mục với ID: " + productDto.getCategoryId()));

        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setRentPrice(productDto.getRentPrice());
        product.setDepositPrice(productDto.getDepositPrice());
        product.setCategory(category);
        if (productDto.getThumbnail() != null) product.setThumbnail(productDto.getThumbnail());
        if (productDto.getImages() != null) product.setImages(productDto.getImages());
        if (productDto.getCity() != null) product.setCity(productDto.getCity());
        if (productDto.getDistrict() != null) product.setDistrict(productDto.getDistrict());
        if (productDto.getFeatured() != null) product.setFeatured(productDto.getFeatured());
        if (productDto.getTotalRentals() != null) product.setTotalRentals(productDto.getTotalRentals());
        
        return mapToDto(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new NotFoundException("Không tìm thấy sản phẩm với ID: " + id);
        }
        productRepository.deleteById(id);
    }

    private ProductResponse mapToDto(Product product) {
        User merchant = product.getMerchant();
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .rentPrice(product.getRentPrice())
                .depositPrice(product.getDepositPrice())
                .pricePerDay(product.getRentPrice())
                .depositAmount(product.getDepositPrice())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : "")
                .thumbnail(product.getThumbnail())
                .images(product.getImages())
                .city(product.getCity() != null ? product.getCity() : "Toàn quốc")
                .district(product.getDistrict() != null ? product.getDistrict() : "")
                .featured(product.getFeatured() != null ? product.getFeatured() : false)
                .rating(product.getRating() != null ? product.getRating() : 5.0)
                .totalReviews(product.getTotalReviews() != null ? product.getTotalReviews() : 0)
                .totalRentals(product.getTotalRentals() != null ? product.getTotalRentals() : 0)
                .status("AVAILABLE")
                .merchantId(merchant != null ? merchant.getId() : null)
                .merchantName(merchant != null ? (merchant.getCompanyName() != null ? merchant.getCompanyName() : merchant.getFullName()) : "RentHub Official")
                .merchantAvatar(merchant != null ? merchant.getAvatar() : null)
                .merchantTier(merchant != null ? merchant.getMerchantTier() : "M1")
                .attributes(product.getAttributes())
                .build();
    }
}

