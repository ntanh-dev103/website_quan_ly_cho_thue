# Hệ Thống Quản Lý & Sàn Giao Dịch Cho Thuê Thiết Bị (Rental Management System - RentHub)

> **Đồ Án Tốt Nghiệp / Dự Án Quản Lý & Sàn Thương Mại Điện Tử Cho Thuê Đa Năng**  
> Nền tảng kết nối người có nhu cầu thuê thiết bị (máy ảnh, thiết bị số, trang phục sự kiện, phương tiện di chuyển...) với các đối tác thương gia cho thuê (B2B & Cá nhân), tích hợp cơ chế xếp hạng tín nhiệm đa tầng (Tier System) và quản lý vòng đời hợp đồng chặt chẽ.

---

## 📌 Mục Lục
1. [Giới Thiệu Tổng Quan](#-giới-thiệu-tổng-quan)
2. [Tiến Độ Dự Án & Kế Hoạch Triển Khai (Roadmap)](#-tiến-độ-dự-án--kế-hoạch-triển-khai-roadmap)
3. [Điểm Sáng Nghiệp Vụ & Kiến Trúc](#-điểm-sáng-nghiệp-vụ--kiến-trúc)
4. [Công Nghệ Sử Dụng (Tech Stack)](#-công-nghệ-sử-dụng-tech-stack)
5. [Hệ Thống Phân Quyền & Phân Tầng (Roles & Tiers)](#-hệ-thống-phân-quyền--phân-tầng-roles--tiers)
6. [Cấu Trúc Thư Mục Dự Án](#-cấu-trúc-thư-mục-dự-án)
7. [Hướng Dẫn Cài Đặt & Khởi Chạy](#-hướng-dẫn-cài-đặt--khởi-chạy)
8. [Tài Khoản Thử Nghiệm (Demo Accounts)](#-tài-khoản-thử-nghiệm-demo-accounts)
9. [Tài Liệu API (Swagger)](#-tài-liệu-api-swagger)

---

## 🌟 Giới Thiệu Tổng Quan

Dự án giải quyết trọn vẹn các rủi ro và bất cập trong mô hình cho thuê truyền thống:
* **Khách thuê (Customer):** Thường e ngại mức tiền đặt cọc quá cao và thủ tục rườm rà. Hệ thống áp dụng **Customer Tier (C1 - C4)** – khách thuê uy tín, hoàn tất nhiều hợp đồng đúng hạn sẽ được giảm tiền cọc từ 40% xuống mức **0% (Miễn cọc hoàn toàn)**.
* **Thương gia (Merchant):** Hỗ trợ cả 2 mô hình **Doanh nghiệp B2B** (quản lý kho lớn, hóa đơn VAT, hoa hồng sàn 2%) và **Đối tác Cá nhân** (cho thuê xe máy, máy ảnh nhàn rỗi, thủ tục nhanh). Quản lý thiết bị theo sê-ri / barcode với vòng đời trạng thái minh bạch.
* **Quản trị viên (Admin):** Kiểm duyệt đối tác, phê duyệt hồ sơ giấy phép kinh doanh, cấu hình biểu phí sàn, quản lý cây danh mục kéo-thả và thuộc tính động (EAV).

---

## 🚦 Tiến Độ Dự Án & Kế Hoạch Triển Khai (Roadmap)

### 📊 Bảng Tổng Hợp Tiến Độ Các Phân Hệ

| Phân Hệ / Task | Trọng Số | Tiến Độ | Trạng Thái | Mô Tả Trọng Tâm |
| :--- | :---: | :---: | :---: | :--- |
| **Task 1: Xác thực & Phân quyền (Auth / RBAC)** | 15% | **100%** | 🟢 **Hoàn thành** | JWT Bearer, Spring Security BCrypt, Multi-role, Seed Demo, Axios Interceptor |
| **Task 2: Trang Chủ & Khám Phá (Home Page)** | 15% | **100%** | 🟢 **Hoàn thành** | Public API, Hero Banner, Category Showcase, Ghost Cart Storage, Fix Array Sort |
| **Task 3: Danh Mục & Tìm Kiếm Nâng Cao (Catalog)** | 15% | **100%** | 🟢 **Hoàn thành** | Spotlight Search `Cmd+K`, Bộ lọc đa chiều (Giá/Khu vực/Hạng shop/Rating/EAV), Virtual Table `@tanstack/react-virtual` 60fps, Server Pagination |
| **Task 4: Chi Tiết Sản Phẩm & Máy Tính Giá Thuê** | 15% | **100%** | 🟢 **Hoàn thành** | Availability API, Máy tính giá cọc theo Tier (C1-C4), Date Range Picker, Dynamic EAV Specs, Dual Action Buttons (Giỏ thuê & Thuê hỏa tốc) |
| **Task 5: Vòng Đời Hợp Đồng & Kiểm Tra Hư Hại** | 15% | **100%** | 🟢 **Hoàn thành** | Luồng Checkout `/checkout`, State Machine Hợp đồng, Ký quỹ Escrow, Hợp đồng PDF in/lưu, Biên bản thẩm định hư hại & hoàn cọc |
| **Task 6: Kênh Quản Trị Đối Tác (Merchant Portal)** | 15% | **100%** | 🟢 **Hoàn thành** | Quản lý kho theo Sê-ri/Barcode/IMEI, Item State Machine, Delete Guard (chặn xóa máy đang thuê), Duyệt đơn thuê & Auto-Approve, Chiết khấu hoa hồng theo Tier (M1: 15% -> M4: 2%) |
| **Task 7: Kênh Quản Trị Hệ Thống (Admin Portal)** | 10% | **100%** | 🟢 **Hoàn thành** | Quản lý người dùng & phân quyền Tier, Duyệt hồ sơ Merchant B2B, Cấu hình tỷ lệ cọc/hoa hồng trực tiếp, Thống kê KPI toàn sàn, Cây danh mục EAV |

---

### 📝 Chi Tiết Kế Hoạch & Đầu Việc Từng Task

#### 🟢 Task 1: Xác thực & Phân quyền Đa tầng (ĐÃ HOÀN THÀNH)
- [x] **Backend:**
  - Mở rộng Enum `Role` hỗ trợ `CUSTOMER` và `MERCHANT`.
  - Mở rộng Entity `User` với các trường hồ sơ: `email` (unique), `customerTier`, `merchantTier`, `companyName`, `taxCode`, `phone`.
  - Đăng nhập linh hoạt bằng cả **Email** hoặc **Username** thông qua `CustomUserDetailsService`.
  - Mã hóa mật khẩu chuẩn BCrypt, cấp phát cặp JWT Token (`accessToken` 15 phút, `refreshToken` 7 ngày).
  - Tự động seed tài khoản Admin, Merchant và các cấp khách hàng VIP với mật khẩu mặc định `123456`.
- [x] **Frontend:**
  - Cấu hình Vite Proxy chuyển hướng `/api` sang máy chủ `http://localhost:8080`.
  - Xây dựng `axiosClient.ts` tự động gắn `Authorization: Bearer` và xử lý refresh token ngầm khi 401.
  - Tích hợp `useAuthStore` (Zustand) đồng bộ Token vào `localStorage` kèm cơ chế graceful offline fallback.
  - Hoàn thiện UI: `LoginForm.tsx` (có Quick-select Demo Pills), `CustomerRegisterForm.tsx`, `MerchantRegisterForm.tsx` (hỗ trợ nộp GPKD cho B2B), `AuthPage.tsx` và `ProtectedRoute.tsx`.
  - Kiểm tra biên dịch: Backend Maven `BUILD SUCCESS` & Frontend `tsc -b && vite build` sạch 100% lỗi.

---

#### 🟢 Task 2: Hoàn thiện Trang Chủ & Khám Phá Sản Phẩm (ĐÃ HOÀN THÀNH)
- [x] **Backend:**
  - Cấu hình `SecurityConfig`: Mở quyền truy cập công khai (`permitAll()`) cho các endpoint đọc `GET /api/categories/**` và `GET /api/products/**`.
  - Cập nhật Entity `Product` & DTO `ProductResponse`: Bổ sung các trường `thumbnail`, `images`, `city`, `district`, `merchant` (User), `featured`, `rating`, `totalReviews`, `pricePerDay`, `depositAmount`.
  - Tự động seed dữ liệu mẫu phong phú: Máy ảnh cinema Sony FX3, Canon R5, Flycam DJI Mavic 3 Pro Cine, xe máy Vespa Primavera du lịch, loa JBL EON ONE, lều cắm trại glamping Naturehike.
- [x] **Frontend:**
  - Khắc phục triệt để lỗi render: Sửa lỗi sắp xếp mảng in-place (`products.sort(...)`) trong [HomePage.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/public/HomePage.tsx) và [ProductGrid.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/catalog/ProductGrid.tsx) bằng clone array bất biến (`[...products]`).
  - Xây dựng [catalog.api.ts](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/api/catalog.api.ts) kết nối API Backend thực tế kèm fallback mock data mượt mà nếu offline.
  - Tích hợp middleware `persist` cho [useGhostCartStore.ts](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/entities/cart/useGhostCartStore.ts) để lưu giữ giỏ hàng tạm trong `localStorage`.
  - Đồng bộ hiển thị Hero Banner, Bộ tính cọc nhanh theo Tier C1-C4, Category Quick Links, Sản phẩm nổi bật (Horizontal Scroll) và Lưới sản phẩm mới nhất trên sàn với bộ lọc sắp xếp (Mới nhất, Phổ biến, Giá tăng dần).
  - Kiểm tra nghiệm thu: Biên dịch sạch cả Backend Maven và Frontend Vite.

---

#### 🟢 Task 3: Bộ Lọc Danh Mục & Tìm Kiếm Toàn Năng (Catalog & Spotlight Search) (ĐÃ HOÀN THÀNH)
- [x] **Backend:**
  - Xây dựng API tìm kiếm linh hoạt `GET /api/products/search`:
    - Tìm kiếm từ khóa đa trường (tên, thương hiệu, mô tả).
    - Lọc theo khoảng giá thuê mỗi ngày (`minPrice`, `maxPrice`).
    - Lọc theo khu vực địa lý (`city` / `district`).
    - Lọc theo phân hạng đối tác (`merchantTier` M1-M4) & đánh giá tối thiểu (`rating`).
    - Lọc theo thuộc tính động EAV (ngàm lens, độ phân giải 4K/120fps, phân khối xe,... qua `ProductSpecification`).
    - Phân trang chuẩn Spring Data (`Pageable`, `sort`, `PaginationResponse`).
- [x] **Frontend:**
  - Hoàn thiện giao diện [CatalogPage.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/public/CatalogPage.tsx) với Sidebar [CatalogFilters.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/catalog/CatalogFilters.tsx):
    - Cây danh mục 2 cấp đóng/mở trực quan (Cấp 1 & Cấp 2).
    - Khoảng giá thuê min - max kèm nút xóa nhanh.
    - Bộ lọc địa phương theo Quận/Huyện.
    - Bộ chọn Hạng Đối Tác Cho Thuê (M1 - M4) và Đánh giá sao tối thiểu (4.0★+, 4.5★+).
    - Bộ lọc thuộc tính động EAV theo đặc thù từng danh mục.
    - Nút "Đặt lại tất cả bộ lọc" (`RotateCcw`).
  - Tích hợp thanh tìm kiếm thông minh [SpotlightCmdBar.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/search/SpotlightCmdBar.tsx):
    - Kích hoạt nhanh toàn cục bằng phím tắt `⌘K` / `Ctrl+K` và click từ Navbar.
    - Tự động debounce gọi API `/api/products/search`, tìm kiếm danh mục và phím tắt điều hướng nhanh.
  - Tối ưu hiển thị đa chế độ tại [ProductGrid.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/catalog/ProductGrid.tsx):
    - Hỗ trợ chuyển đổi linh hoạt: **Chế độ Lưới (Grid View)** và **Chế độ Bảng Ảo Hóa (Virtual Table)** với `@tanstack/react-virtual` đạt hiệu năng 60fps mượt mà khi dữ liệu lớn.
    - Phân trang server-side (`PaginationResponse`), tự động reset về trang 0 khi thay đổi bất kỳ tiêu chí lọc nào.
  - Nghiệm thu: Biên dịch sạch cả Backend Maven (`BUILD SUCCESS`) và Frontend Vite (`tsc -b && vite build` 0 lỗi).

---

#### 🟢 Task 4: Trang Chi Tiết Thiết Bị & Bộ Tính Giá Thuê Tự Động (ĐÃ HOÀN THÀNH)
*Mục tiêu: Minh bạch hóa toàn bộ chi phí thuê, tiền cọc và lịch trình khả dụng của thiết bị.*
- [x] **Backend:**
  - Cung cấp API `GET /api/products/{id}/availability`: Trả về tổng số lượng thiết bị khả dụng trong kho và danh sách các khoảng thời gian đã được đặt trước (`bookedDateRanges`) tại [ProductController.java](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/backend/src/main/java/com/rentalshop/backend/product/controller/ProductController.java) & [ProductServiceImpl.java](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/backend/src/main/java/com/rentalshop/backend/product/service/ProductServiceImpl.java).
  - Cung cấp API `POST /api/rental/calculate`: Tính toán chi phí thuê chi tiết (tiền thuê theo ngày, tỉ lệ cọc linh hoạt C1: 40% ➔ C4: 0%, tiền cọc được giảm, phí vận chuyển ước tính, tổng thanh toán ban đầu) tại [RentalCalculationController.java](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/backend/src/main/java/com/rentalshop/backend/contract/controller/RentalCalculationController.java) & [RentalCalculationServiceImpl.java](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/backend/src/main/java/com/rentalshop/backend/contract/service/RentalCalculationServiceImpl.java).
  - Cấu hình [SecurityConfig.java](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/backend/src/main/java/com/rentalshop/backend/config/SecurityConfig.java) cho phép khách vãng lai tính giá thuê và xem lịch khả dụng công khai.
- [x] **Frontend:**
  - Hoàn thiện [ProductDetailPage.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/public/ProductDetailPage.tsx):
    - Tích hợp gọi API thực tế qua [catalog.api.ts](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/api/catalog.api.ts) (`getProductById`).
    - Thư viện ảnh sản phẩm tương tác, xem ảnh phóng to chi tiết.
    - Bảng thông số kỹ thuật động EAV (dịch thuật nhãn tiếng Việt rõ ràng theo loại thiết bị).
    - Khối thông tin gian hàng Merchant (Huy hiệu Tier M1–M4 qua [TierBadge.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/components/common/TierBadge.tsx), đánh giá sao, số lượt thuê, huy hiệu đối tác xác thực).
  - Nâng cấp **Rental Calculator Component** tại [RentalCalculator.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/rental/RentalCalculator.tsx):
    - Tự động gọi API lấy lịch khả dụng và cảnh báo trùng lịch nếu chọn khoảng ngày đã được thuê.
    - Gọi API tính giá tự động theo Customer Tier người dùng (C1–C4), hiển thị tỉ lệ cọc và số tiền cọc được miễn giảm.
    - Tích hợp 2 nút hành động: **"Thêm vào giỏ thuê"** (lưu thời gian thuê vào Ghost Cart Store [useGhostCartStore.ts](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/entities/cart/useGhostCartStore.ts)) và **"Thuê ngay hỏa tốc"** (chuyển thẳng đến trang Checkout).
  - Nghiệm thu: Biên dịch sạch cả Backend Maven (`BUILD SUCCESS`) và Frontend Vite (`tsc -b && vite build` 0 lỗi).

---

#### 🟢 Task 5: Quy Trình Đặt Thuê & Vòng Đời Hợp Đồng (ĐÃ HOÀN THÀNH)
*Mục tiêu: Số hóa toàn diện quy trình thuê thiết bị, quản lý rủi ro và xử lý hư hại minh bạch.*
- [x] **Backend:**
  - Quản lý State Machine cho Entity [Contract.java](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/backend/src/main/java/com/rentalshop/backend/contract/entity/Contract.java):
    - Đầy đủ các trạng thái chuẩn: `DRAFT` ➔ `PENDING_DEPOSIT` ➔ `ACTIVE` ➔ `RETURNED` ➔ `COMPLETED` / `OVERDUE` / `CANCELED`.
    - Phân tách độc lập trạng thái Hợp đồng và trạng thái Ký quỹ Escrow (`EscrowStatus.HELD` ➔ `RELEASED`).
  - Endpoint tạo đơn thuê và cập nhật trạng thái đặt cọc:
    - `POST /api/contracts`: Hỗ trợ tạo hợp đồng linh hoạt theo cả `productId` (tự động phân bổ thiết bị sẵn sàng trong kho) hoặc `itemIds` cụ thể, tự động tính cọc theo Customer Tier C1–C4.
    - `PUT /api/contracts/{id}/deposit`: Xác nhận đặt cọc thành công, kích hoạt trạng thái `ACTIVE`, chuyển trạng thái thiết bị sang `RENTED` và hạch toán sổ cái kép (Zero-Sum Ledger) cho cả tiền thuê và tiền cọc.
    - `PUT /api/contracts/{id}/handover`: Biên bản bàn giao thiết bị trực tiếp cho khách hàng.
    - `POST /api/contracts/{id}/return-items`: Tiếp nhận trả thiết bị, chuyển trạng thái sang `RETURNED` chờ thẩm định hiện trạng.
  - Endpoint lập biên bản thẩm định hư hại & hoàn cọc:
    - `POST /api/contracts/{id}/damage-assessment`: Tiếp nhận danh sách thiết bị hư hại, ghi chú hiện trạng và chi phí bồi thường (`compensationFee`).
    - Tính toán khấu trừ chi phí bồi thường và phạt trễ hạn từ tiền cọc của khách hàng:
      - Nếu `depositAmount >= totalDeduction`: Hoàn trả số dư cọc còn lại (`refundAmount`), hạch toán sổ cái `PaymentType.REFUND`.
      - Nếu `depositAmount < totalDeduction`: Ghi nhận công nợ bồi thường bổ sung (`PaymentType.DEBT`).
    - Chuyển trạng thái hợp đồng sang `COMPLETED` và giải phóng ký quỹ `EscrowStatus.RELEASED`.
- [x] **Frontend:**
  - Hoàn thiện luồng Checkout tại [CheckoutPage.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/public/CheckoutPage.tsx):
    - Tuyến đường `/checkout` với giao diện chuyên nghiệp, breadcrumb định hướng các bước.
    - Form thông tin người nhận, số điện thoại, địa chỉ bàn giao tận nơi và ghi chú.
    - Lựa chọn phương thức vận chuyển: Hỏa tốc 2 giờ / Tiêu chuẩn trong ngày / Nhận tại kho RentNest.
    - Lựa chọn phương thức cọc / thanh toán: Quét mã QR VietQR Napas 24/7 / Ký quỹ bảo chứng Escrow Safe / Thẻ quốc tế / Tiền mặt.
    - Bảng tổng kết chi phí: Tiền thuê, tiền cọc (highlight ưu đãi giảm cọc theo Tier hội viên C1–C4), phí ship, tổng thanh toán ban đầu.
    - Cam kết điều khoản hợp đồng thuê điện tử trước khi ký.
  - Quản lý hợp đồng trong trang Cá nhân [RentingInTab.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/account/tabs/RentingInTab.tsx):
    - Bộ lọc hợp đồng theo tab trạng thái: Tất cả / Chờ cọc / Đang thuê / Chờ thẩm định trả / Đã hoàn thành / Quá hạn.
    - Tích hợp [ContractPdfModal.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/contract/ContractPdfModal.tsx): Xem văn bản hợp đồng thuê song phương có đầy đủ Quốc hiệu, căn cứ pháp lý, bảng thiết bị, điều khoản ký quỹ Escrow, dấu mộc điện tử đỏ và nút In / Lưu PDF (`window.print()`).
    - Nút hành động trực tiếp: "Xác nhận nhận máy" (kích hoạt hợp đồng), "Yêu cầu trả máy" (mở modal ProofCamera E-Audit).
    - Tích hợp [DamageAssessmentModal.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/contract/DamageAssessmentModal.tsx): Lập biên bản kiểm tra thiết bị khi thu hồi (nguyên vẹn vs có hư hại), nhập chi phí đền bù, tự động cấn trừ vào tiền cọc và xác nhận hoàn trả tiền cọc còn lại.
  - Tích hợp API layer tại [contract.api.ts](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/api/contract.api.ts) và Zustand store [useContractStore.ts](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/entities/contract/useContractStore.ts).
  - Nghiệm thu: Biên dịch sạch cả Backend Maven (`BUILD SUCCESS`) và Frontend Vite (`tsc -b && vite build` 0 lỗi).

---

#### 🟢 Task 6: Kênh Quản Trị Dành Cho Đối Tác (Merchant Portal - ĐÃ HOÀN THÀNH)
*Mục tiêu: Công cụ đắc lực giúp chủ cửa hàng và cá nhân quản lý kho tài sản và tối đa hóa doanh thu.*
- [x] **Backend:**
  - Quản lý thực thể thiết bị vật lý `ProductItem` gắn liền với số Sê-ri/IMEI (`serialNumber`), mã vạch (`barcode`), điểm tình trạng máy (`conditionScore` 0-100) và vị trí lưu kho (`warehouseLocation`).
  - Quản lý vòng đời máy chặt chẽ (`AVAILABLE`, `RENTED`, `MAINTENANCE`, `DAMAGED`, `RETIRED`).
  - **Quy tắc bất biến (Delete Guard):** Chặn hoàn toàn việc xóa bất kỳ thiết bị vật lý nào đang có trạng thái `RENTED` trong hợp đồng thuê trực tiếp (`BadRequestException`).
  - **Tự động tính và khấu trừ hoa hồng sàn theo hạng Merchant Tier:**
    - `M1 (Starter)`: Chiết khấu 15% (Giới hạn tối đa 20 sản phẩm).
    - `M2 (Pro Merchant)`: Chiết khấu 10% (Không giới hạn sản phẩm, mở khóa tính năng Auto-Approve).
    - `M3 (Enterprise)`: Chiết khấu 5% (Ưu tiên truyền thông, miễn phí kho bãi đối tác).
    - `M4 (Flagship Partner)`: Chiết khấu 2% (Hỗ trợ giải ngân B2B Net-30).
  - API endpoints hoàn chỉnh:
    - `GET /api/inventory/items?merchantId={id}`: Tra cứu danh sách thiết bị vật lý trong kho của merchant.
    - `POST /api/products/{id}/items`: Nhập thiết bị mới vào kho với số Serial/IMEI, Barcode, Condition score, Vị trí kho.
    - `PUT /api/inventory/items/{id}/status`: Cập nhật trạng thái bảo dưỡng, vị trí kho và điểm tình trạng.
    - `DELETE /api/inventory/items/{id}`: Xóa thiết bị khỏi kho (có kiểm tra an toàn trạng thái `RENTED`).
    - `GET /api/merchant/stats`: Thống kê doanh thu gộp, hoa hồng sàn, doanh thu thực nhận, số đơn đang chạy và tỷ lệ lấp đầy kho.
    - `GET /api/merchant/contracts`: Lấy danh sách hợp đồng cho thuê theo Merchant.
    - `PUT /api/merchant/contracts/{id}/approve` & `PUT /api/merchant/contracts/{id}/reject`: Phê duyệt đơn hàng và từ chối đơn hàng (tự động giải tỏa Escrow hoàn cọc cho khách).
- [x] **Frontend:**
  - [merchant.api.ts](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/api/merchant.api.ts): Tích hợp toàn diện các phương thức CRUD item, duyệt đơn, và lấy số liệu thống kê.
  - [AddItemModal.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/inventory/AddItemModal.tsx): Modal nhập máy vật lý vào kho với số Serial/IMEI, Barcode, Slider điểm tình trạng (Condition score) và Vị trí kệ kho.
  - [ItemStatusModal.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/inventory/ItemStatusModal.tsx): Modal chuyển trạng thái vận hành (`AVAILABLE`, `MAINTENANCE`, `RETIRED`), cập nhật lịch sử bảo dưỡng.
  - [InventoryTable.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/inventory/InventoryTable.tsx): Tích hợp quản lý máy con theo từng sản phẩm cha (nút `Serial ({count})`), mở modal xem danh sách các máy vật lý, thêm máy mới, sửa tình trạng và xóa máy có Delete Guard.
  - [MerchantContracts.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/merchant/MerchantContracts.tsx) & [ContractTable.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/contract/ContractTable.tsx): Nút `Xác nhận chuẩn bị hàng` (Approve), `Từ chối` (Reject kèm lý do), hiển thị trạng thái ký quỹ Escrow và Toggle `Auto-Approve` có FeatureGate theo cấp M2+.
  - [CommissionRateCard.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/merchant/CommissionRateCard.tsx): Hiển thị biểu phí hoa hồng 15% -> 2%, bảng so sánh 4 cấp M1-M4, bộ tính toán mô phỏng mức tiết kiệm tiền ròng theo doanh thu hàng tháng và nút nâng cấp M2 Pro 1-click.
  - [MerchantDashboard.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/merchant/MerchantDashboard.tsx): Hiển thị số liệu doanh thu thực nhận (Net), phí sàn khấu trừ, tỷ lệ lấp đầy kho (Occupancy rate) và thẻ hoa hồng sàn.
  - Nghiệm thu: Backend Maven `BUILD SUCCESS` & Frontend Vite `tsc -b && vite build` sạch 100% lỗi.

---

#### 🟢 Task 7: Kênh Quản Trị Hệ Thống Toàn Quyền (Admin Portal - ĐÃ HOÀN THÀNH)
*Mục tiêu: Đảm bảo toàn bộ sàn vận hành đúng quy chế, an toàn pháp lý và kiểm soát chất lượng.*
- [x] **Backend:**
  - **Quản lý người dùng & Phân hạng (User Management & Tier Hierarchy):**
    - `GET /api/admin/users`: Tra cứu danh sách thành viên toàn sàn có phân trang, lọc theo Vai trò (`CUSTOMER`, `MERCHANT`, `ADMIN`) và tìm kiếm từ khóa (tên, email, số điện thoại).
    - `PUT /api/admin/users/{id}/status`: Khóa (`LOCKED`) hoặc kích hoạt lại (`ACTIVE`) tài khoản vi phạm quy chế sàn.
    - `PUT /api/admin/users/{id}/tier`: Điều chỉnh hạng thành viên trực tiếp — hỗ trợ cả Customer Tier (`C1` - `C4`) và Merchant Tier (`M1` - `M4`).
  - **Phê duyệt hồ sơ đối tác Merchant B2B (KYC Verification):**
    - `GET /api/admin/merchants/applications`: Danh sách hồ sơ đăng ký đối tác kèm thông tin Mã số thuế, Giấy phép kinh doanh, Người đại diện.
    - `PUT /api/admin/merchants/applications/{userId}/approve`: Phê duyệt hồ sơ đối tác, kích hoạt tài khoản và cấp hạng khởi điểm (`M1` - `M4`).
    - `PUT /api/admin/merchants/applications/{userId}/reject`: Từ chối hồ sơ kèm lý do phản hồi minh bạch cho đối tác.
  - **Quản trị cấu hình hệ thống & Biểu phí thời gian thực:**
    - `GET /api/admin/tiers`: Lấy bảng định cấu hình tỷ lệ đặt cọc của Khách hàng (`C1` 40% -> `C4` 0%) và hoa hồng sàn của Đối tác (`M1` 15% -> `M4` 2%).
    - `PUT /api/admin/tiers/{tierId}`: Cập nhật động tỷ lệ % và hạn mức thuê, có hiệu lực ngay lập tức toàn hệ thống.
  - **Thống kê KPI & Giám sát vận hành sàn:**
    - `GET /api/admin/stats`: Tổng hợp số lượng người dùng (Khách thuê, Đối tác), số lượng thiết bị niêm yết, hợp đồng đang chạy, doanh thu luân chuyển toàn sàn và số hồ sơ B2B đang chờ duyệt.
  - Cấu hình an ninh bảo mật tại [SecurityConfig.java](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/backend/src/main/java/com/rentalshop/backend/config/SecurityConfig.java) phân quyền chặt chẽ các endpoint `/api/admin/**`.
- [x] **Frontend:**
  - [admin.api.ts](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/api/admin.api.ts): API client đầy đủ cho toàn bộ nghiệp vụ Quản trị (Stats, Users, KYC Approval, Tiers).
  - [AdminUsers.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/admin/AdminUsers.tsx): Trang quản lý người dùng chuyên nghiệp:
    - Tìm kiếm tức thì, bộ lọc theo Vai trò (Tất cả / Customer / Merchant / Admin).
    - Thẻ thống kê tỷ lệ phân bổ thành viên.
    - Bảng danh sách hiển thị Avatar, Email, SĐT, Doanh nghiệp/MST, Cấp bậc Tier, Trạng thái hoạt động.
    - Nút Khóa / Mở khóa tài khoản có xác nhận an toàn.
    - Modal Chỉnh sửa Hạng (Tier): Cho phép Admin thăng/hạ hạng C1-C4 hoặc M1-M4 có preview quyền lợi tương ứng.
  - [AdminDashboard.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/admin/AdminDashboard.tsx): Kết nối API thời gian thực với 4 KPI trọng yếu, cảnh báo hồ sơ B2B chờ duyệt, biểu đồ phân bổ ngành hàng và hành động nhanh.
  - [AdminApproval.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/admin/AdminApproval.tsx): Giao diện duyệt hồ sơ đối tác B2B trực quan với thông tin pháp lý, mã số thuế, giấy phép kinh doanh, chọn hạng cấp phát và modal lý do từ chối.
  - [AdminTiers.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/admin/AdminTiers.tsx): Quản trị cấu hình biểu phí hệ thống: Chuyển tab C1-C4 (Tỷ lệ cọc) / M1-M4 (Hoa hồng sàn), modal sửa tỷ lệ % và hạn mức với cập nhật tức thời qua API.
  - [AdminCategories.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/admin/AdminCategories.tsx): Quản lý cây danh mục kéo thả với thư viện `@dnd-kit`, thêm sửa xóa thuộc tính động EAV.
  - Đăng ký định tuyến đầy đủ tại [AdminRoutes.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/app/routes/AdminRoutes.tsx) và thanh điều hướng tại [AdminSidebar.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/shared/ui/AdminSidebar.tsx).
  - Nghiệm thu: Biên dịch sạch cả Backend Maven (`BUILD SUCCESS`) và Frontend Vite (`tsc -b && vite build` 0 lỗi).

---

## 💡 Điểm Sáng Nghiệp Vụ & Kiến Trúc

1. **Bộ Tính Phí Thuê & Tiền Cọc Động (Rental Calculator):**
   * Tính toán thời gian thực: `Tổng thanh toán = (Số ngày thuê x Đơn giá) + Phí giao nhận + Tiền đặt cọc`.
   * Tỷ lệ tiền cọc được **tính tự động theo Tier của tài khoản đang đăng nhập** (C1: 40% ➔ C4: 0%), minh bạch trước khi chốt hợp đồng.
2. **Quản Lý Vòng Đời Hợp Đồng Toàn Diện (Contract Lifecycle):**
   * `DRAFT` (Nháp) ➔ `PENDING_DEPOSIT` (Chờ đặt cọc) ➔ `ACTIVE` (Đang thuê) ➔ `COMPLETED` (Hoàn thành) / `OVERDUE` (Quá hạn).
   * Tích hợp **Biên bản kiểm tra hư hại (`DamageReportModal`)**: Khi nhận lại thiết bị, thương gia có thể ghi nhận sự cố, đính kèm ảnh minh chứng và trừ tiền phạt trực tiếp từ tiền cọc.
3. **Cấu Trúc Thuộc Tính Động (EAV - Entity Attribute Value):**
   * Cho phép Admin mở rộng thông số kỹ thuật đặc thù cho từng danh mục mà không cần thay đổi cấu trúc bảng SQL (ví dụ: Máy ảnh có *Ngàm lens, Cảm biến, ISO*; Xe máy có *Phân khối, Dung tích bình xăng*).
4. **Cây Danh Mục Kéo Thả Trực Quan (`@dnd-kit`):**
   * Admin dễ dàng sắp xếp thứ tự và lồng danh mục con vào danh mục cha với thao tác kéo thả mượt mà.
5. **Bộ Điều Khiển Demo Tức Thì (Demo Controller Widget):**
   * Widget nổi ở góc màn hình giúp người đánh giá chuyển đổi nhanh vai trò (`Guest`, `C1-C4`, `M1-M4`, `Admin`) hoặc chọn nhanh tài khoản tại màn hình đăng nhập chỉ với 1 click.

---

## 🛠 Công Nghệ Sử Dụng (Tech Stack)

### Frontend
* **Core:** React 19, TypeScript 5.8, Vite 8
* **Styling & UI:** Tailwind CSS v4, Radix UI Primitives, Lucide Icons, Sonner (Toast Notifications)
* **Kiến trúc:** Feature-Sliced Design (FSD)
* **Quản lý trạng thái:** Zustand (kèm middleware `persist` lưu `localStorage`)
* **Tối ưu & Tương tác:** `@tanstack/react-virtual` (Ảo hóa danh sách), `@dnd-kit` (Kéo thả danh mục), `recharts` (Biểu đồ số liệu)
* **Networking:** Axios Client (Proxy `/api` tới backend, tự động đính kèm JWT Bearer và refresh token ngầm khi 401)

### Backend
* **Core:** Java 21, Spring Boot 4.x
* **Bảo mật & Xác thực:** Spring Security, BCrypt Password Encoder, JWT (`io.jsonwebtoken 0.11.5`)
* **Dữ liệu & ORM:** Spring Data JPA, Hibernate, Microsoft SQL Server (MSSQL)
* **Tiện ích:** Project Lombok, Jakarta Validation (`@Valid`)
* **Tài liệu hóa:** Springdoc OpenAPI 3.x (Swagger UI)

---

## 👥 Hệ Thống Phân Quyền & Phân Tầng (Roles & Tiers)

### 1. Vai Trò (Roles)
* **GUEST:** Xem danh mục, tìm kiếm thiết bị, xem chi tiết và trải nghiệm bộ tính giá thuê.
* **CUSTOMER:** Đăng ký thuê, quản lý đơn hợp đồng cá nhân, nhận ưu đãi giảm tiền cọc theo hạng.
* **MERCHANT:** Đăng ký gian hàng (B2B hoặc Cá nhân), quản lý kho thiết bị, duyệt hợp đồng, lập biên bản sự cố hư hại.
* **ADMIN:** Quản trị người dùng, duyệt hồ sơ Merchant, cấu hình biểu phí sàn và quản lý danh mục.

### 2. Phân Hạng Khách Hàng (Customer Tiers)
| Hạng | Tên Hạng | Biểu Tượng | Tỷ Lệ Đặt Cọc | Quyền Lợi |
| :---: | :---: | :---: | :---: | :--- |
| **C1** | Khách mới | 🔹 | **40%** | Mức cọc tiêu chuẩn cho thành viên mới |
| **C2** | Bạc | 🥈 | **30%** | Giảm 10% tiền cọc |
| **C3** | Vàng | 👑 | **15%** | Giảm 25% tiền cọc, ưu tiên giao nhận |
| **C4** | Kim Cương | 💎 | **0%** | **Miễn hoàn toàn tiền đặt cọc (0đ)**, duyệt đơn hỏa tốc |

### 3. Phân Hạng Thương Gia (Merchant Tiers)
| Hạng | Tên Hạng | Biểu Tượng | Phí Hoa Hồng Sàn | Quyền Lợi |
| :---: | :---: | :---: | :---: | :--- |
| **M1** | Tiêu chuẩn | 🔹 | **15%** | Gian hàng đối tác cơ bản |
| **M2** | Bạc | 🥈 | **10%** | Giảm 5% phí hoa hồng sàn |
| **M3** | Vàng | 👑 | **5%** | Huy hiệu Shop Uy Tín, hỗ trợ truyền thông |
| **M4** | Kim Cương | 💎 | **2%** | Mức phí ưu đãi tốt nhất, hiển thị ưu tiên đầu trang chủ |

---

## 📂 Cấu Trúc Thư Mục Dự Án

```plaintext
website_quan_ly_cho_thue/
├── frontend/                     # Ứng dụng Frontend (React + Vite + TypeScript)
│   ├── src/
│   │   ├── api/                  # Axios Client, Auth API, Products API, Interceptors
│   │   ├── app/                  # Router (Public, Merchant, Admin), Layouts, ProtectedRoute
│   │   ├── entities/             # Zustand Store & Types: User, Product, Cart, Contract
│   │   ├── features/             # Feature logic: Auth, Search, Cart, Rental, Inventory...
│   │   ├── pages/                # Màn hình: Public (Home, Catalog, Detail), Auth, Merchant, Admin
│   │   └── shared/               # UI components dùng chung (Button, Input, Modal, Badge...)
│   ├── package.json
│   └── vite.config.ts            # Cấu hình Vite & Proxy API sang Backend
│
├── backend/                      # Ứng dụng Backend (Spring Boot + Java 21)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/rentalshop/backend/
│   │   │   │   ├── auth/         # Entity User/Role, DTOs Login/Register, JWT Provider & Filter
│   │   │   │   ├── common/       # ApiResponse chuẩn, Global Exception Handler
│   │   │   │   ├── config/       # SecurityConfig, CorsConfig, OpenApiConfig
│   │   │   │   ├── contract/     # Nghiệp vụ hợp đồng thuê & biên bản xử lý sự cố
│   │   │   │   ├── customer/     # Xếp hạng và tích điểm khách hàng
│   │   │   │   ├── maintenance/  # Quản lý bảo trì thiết bị
│   │   │   │   ├── product/      # Sản phẩm, Kho hàng (Item theo sê-ri), Danh mục, EAV
│   │   │   │   ├── report/       # Báo cáo doanh số & thống kê vận hành
│   │   │   │   └── security/     # CustomUserDetailsService, UserPrincipal
│   │   │   └── resources/        # application.yml cấu hình DB MSSQL, JWT Secret
│   │   └── test/
│   ├── pom.xml
│   └── mvnw.cmd
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu Cầu Môi Trường (Prerequisites)
* **Node.js:** Phiên bản `>= 20.x` (Khuyên dùng Node 20 LTS hoặc Node 22)
* **Java SDK:** Phiên bản `>= 21` (Đã kiểm thử biên dịch chuẩn trên JDK 21 / 25)
* **Cơ sở dữ liệu:** Microsoft SQL Server 2019 / 2022 / SQL Express (Cổng mặc định `1433`)

---

### 2. Cấu Hình Cơ Sở Dữ Liệu
1. Mở **SQL Server Management Studio (SSMS)** hoặc Azure Data Studio, kết nối tới SQL Server và tạo cơ sở dữ liệu:
   ```sql
   CREATE DATABASE rental_db;
   ```
2. Mở file [`backend/src/main/resources/application.yml`](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/backend/src/main/resources/application.yml), kiểm tra thông tin tài khoản SQL Server:
   ```yaml
   spring:
     datasource:
       url: jdbc:sqlserver://localhost:1433;databaseName=rental_db;encrypt=true;trustServerCertificate=true
       username: sa
       password: <Mat_Khau_SQL_Cua_Ban>
   ```
   *(Cơ chế Hibernate `ddl-auto: update` sẽ tự động khởi tạo bảng khi ứng dụng chạy lần đầu)*.

---

### 3. Khởi Chạy Backend
Mở terminal tại thư mục `backend`:

```powershell
cd backend

# Cách 1: Chạy trực tiếp qua Maven Wrapper
.\mvnw.cmd spring-boot:run

# Cách 2: Đóng gói và chạy file JAR
.\mvnw.cmd package -DskipTests
java -jar target\rental-management-0.0.1-SNAPSHOT.jar
```
Backend sẽ khởi động tại cổng: `http://localhost:8080`.

---

### 4. Khởi Chạy Frontend
Mở một terminal khác tại thư mục `frontend`:

```powershell
cd frontend

# Cài đặt gói thư viện (nếu mới clone repo)
npm install

# Khởi chạy chế độ phát triển
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173` (hoặc cổng được hiển thị trên console).

---

## 🔑 Tài Khoản Thử Nghiệm (Demo Accounts)

Hệ thống đã tự động seed sẵn các tài khoản demo khi Backend khởi động. Mật khẩu mặc định cho tất cả tài khoản là: **`123456`**.

| Vai Trò | Cấp Bậc | Email Đăng Nhập | Tên Hiển Thị | Quyền Hạn & Đặc Quyền |
| :--- | :---: | :--- | :--- | :--- |
| **Quản trị viên** | A1 | `admin@demo.com` *(hoặc `admin@test.com`)* | Admin Hệ Thống | Toàn quyền quản trị, duyệt shop, quản lý danh mục |
| **Thương gia VIP** | M4 | `merchant4@demo.com` | Luxury Event Group | Phí hoa hồng sàn ưu đãi nhất (**2%**) |
| **Thương gia Vàng** | M3 | `merchant3@demo.com` | Cinematic Gear Studio | Phí hoa hồng sàn **5%** |
| **Thương gia chuẩn** | M2 | `merchant@demo.com` *(hoặc `merchant@test.com`)* | AutoRent Pro HCM | Phí hoa hồng sàn **10%** |
| **Khách hàng Kim Cương** | C4 | `vip@demo.com` | Nguyễn Hoàng VIP | **Miễn hoàn toàn tiền đặt cọc (0đ)** |
| **Khách hàng Vàng** | C3 | `gold@demo.com` *(hoặc `gold@test.com`)* | Trần Kim Vàng | Đặt cọc ưu đãi **15%** |
| **Khách hàng Bạc** | C2 | `silver@demo.com` | Lê Thanh Bạc | Đặt cọc **30%** |
| **Khách hàng mới** | C1 | `customer@demo.com` *(hoặc `user@test.com`)* | Phạm Văn Thuê | Đặt cọc tiêu chuẩn **40%** |

> 💡 **Mẹo:** Bạn có thể bấm trực tiếp vào các nút chọn nhanh tài khoản (Pills) ngay tại trang **Đăng nhập (`/login`)** hoặc dùng **Demo Widget** ở góc màn hình để chuyển đổi vai trò ngay tức khắc.

---

## 📖 Tài Liệu API (Swagger)

Sau khi khởi chạy Backend, truy cập đường dẫn sau trên trình duyệt để kiểm tra và tương tác trực tiếp với API:
* **Swagger UI:** `http://localhost:8080/swagger-ui.html`
* **OpenAPI JSON Docs:** `http://localhost:8080/v3/api-docs`

---
*Dự án phục vụ đồ án chuyên ngành / bảo vệ tốt nghiệp, hướng tới tiêu chuẩn hoàn thiện cao cả về kiến trúc kỹ thuật lẫn trải nghiệm người dùng thực tế.*