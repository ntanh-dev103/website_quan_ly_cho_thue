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
| **Task 2: Trang Chủ & Khám Phá (Home Page)** | 15% | **65%** | 🟡 **Đang hoàn thiện** | Public API, Hero Banner, Category Showcase, Ghost Cart Storage, Fix Array Sort |
| **Task 3: Danh Mục & Tìm Kiếm Nâng Cao (Catalog)** | 15% | **25%** | ⚪ *Đang triển khai* | Spotlight Search `Cmd+K`, Bộ lọc đa chiều, Thuộc tính động EAV, Server Pagination |
| **Task 4: Chi Tiết Sản Phẩm & Máy Tính Giá Thuê** | 15% | **30%** | ⚪ *Kế hoạch* | Bộ tính giá cọc theo Tier (C1-C4), Lịch chọn ngày thuê, Gallery ảnh, Thông số kỹ thuật |
| **Task 5: Vòng Đời Hợp Đồng & Kiểm Tra Hư Hại** | 15% | **20%** | ⚪ *Kế hoạch* | Checkout đặt cọc, State machine hợp đồng, Biên bản bàn giao & đền bù sự cố |
| **Task 6: Kênh Quản Trị Đối Tác (Merchant Portal)** | 15% | **35%** | ⚪ *Kế hoạch* | Quản lý kho theo Sê-ri/Barcode, Duyệt đơn thuê, Hoa hồng theo Tier (M1-M4) |
| **Task 7: Kênh Quản Trị Hệ Thống (Admin Portal)** | 10% | **40%** | ⚪ *Kế hoạch* | Duyệt shop GPKD, Cây danh mục kéo-thả `@dnd-kit`, Quản lý EAV, Thống kê doanh thu |

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

#### 🟡 Task 2: Hoàn thiện Trang Chủ & Khám Phá Sản Phẩm (ĐANG TRIỂN KHAI)
*Mục tiêu: Đảm bảo khách vãng lai và người dùng trải nghiệm mượt mà trang chủ với dữ liệu thực tế từ backend.*
- [ ] **Backend:**
  - Cấu hình `SecurityConfig`: Mở quyền truy cập công khai (`permitAll()`) cho các endpoint đọc:
    - `GET /api/categories/**` (Danh sách cây danh mục)
    - `GET /api/products/**` (Danh sách sản phẩm nổi bật, sản phẩm mới, chi tiết sản phẩm)
  - Cập nhật Entity `Product`: Bổ sung các trường `thumbnail`, `images` (danh sách URL ảnh), `location` (Tỉnh/Thành phố), `merchantId`, `ratingAverage`, `totalRentals`.
  - Seed dữ liệu mẫu phong phú: Thiết bị công nghệ (Sony FX3, Canon R5), xe máy du lịch, trang phục sự kiện, flycam DJI.
- [ ] **Frontend:**
  - Khắc phục lỗi render: Sửa lỗi sắp xếp mảng in-place (`products.sort(...)` gây lỗi với frozen state từ Zustand) trong [HomePage.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/public/HomePage.tsx) và [ProductGrid.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/search/ProductGrid.tsx).
  - Tích hợp middleware `persist` cho [useGhostCartStore.ts](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/entities/cart/useGhostCartStore.ts) để lưu giữ giỏ hàng tạm khi reload trang.
  - Kết nối Category Slider và Featured Products Grid trực tiếp với API backend (kèm fallback mock mượt mà nếu offline).
  - Đồng bộ Banner ưu đãi, giới thiệu chính sách miễn cọc C4 và quyền lợi đối tác B2B.

---

#### ⚪ Task 3: Bộ Lọc Danh Mục & Tìm Kiếm Toàn Năng (Catalog & Spotlight Search)
*Mục tiêu: Người dùng dễ dàng tìm thấy chính xác thiết bị cần thuê qua đa tiêu chí.*
- [ ] **Backend:**
  - Xây dựng API tìm kiếm linh hoạt `GET /api/products/search`:
    - Tìm theo từ khóa (tên, thương hiệu, mô tả).
    - Lọc theo khoảng giá thuê mỗi ngày (`minPrice`, `maxPrice`).
    - Lọc theo khu vực địa lý (`city` / `district`).
    - Lọc theo thuộc tính động EAV (ví dụ: máy ảnh theo ngàm `Sony E-mount`, phân giải `4K/120fps`).
    - Phân trang chuẩn Spring Data (`Pageable`, `sort`).
- [ ] **Frontend:**
  - Hoàn thiện giao diện [CatalogPage.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/public/CatalogPage.tsx) với Sidebar bộ lọc đa tiêu chí (danh mục, khoảng giá slider, địa điểm, hạng shop).
  - Tối ưu thanh tìm kiếm thông minh [SpotlightCmdBar.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/search/SpotlightCmdBar.tsx) kích hoạt nhanh bằng phím tắt `⌘K` / `Ctrl+K`.
  - Áp dụng kỹ thuật ảo hóa danh sách `@tanstack/react-virtual` khi hiển thị hàng trăm sản phẩm để đạt 60fps mượt mà.

---

#### ⚪ Task 4: Trang Chi Tiết Thiết Bị & Bộ Tính Giá Thuê Tự Động
*Mục tiêu: Minh bạch hóa toàn bộ chi phí thuê, tiền cọc và lịch trình khả dụng của thiết bị.*
- [ ] **Backend:**
  - Cung cấp API `GET /api/products/{id}/availability`: Trả về các khoảng thời gian thiết bị đã có người đặt trước để vô hiệu hóa trên lịch.
  - API `POST /api/rental/calculate`: Tính toán chi phí dự kiến dựa trên số ngày, địa chỉ giao nhận và Customer Tier của người thuê.
- [ ] **Frontend:**
  - Hoàn thiện [ProductDetailPage.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/public/ProductDetailPage.tsx):
    - Thư viện ảnh sản phẩm tương tác, phóng to chi tiết.
    - Bảng thông số kỹ thuật động EAV theo từng loại thiết bị.
    - Khối thông tin gian hàng cho thuê (Huy hiệu Tier M1-M4, đánh giá sao, tỷ lệ phản hồi).
  - Tích hợp **Rental Calculator Component**: Khách chọn ngày bắt đầu - ngày kết thúc trên Date Range Picker, hệ thống tự động:
    - Tính số ngày thuê thực tế.
    - Áp dụng công thức cọc theo Tier hiện tại (C1: 40% -> C4: 0đ Miễn cọc).
    - Hiển thị nút "Thêm vào giỏ thuê" hoặc "Thuê ngay hỏa tốc".

---

#### ⚪ Task 5: Quy Trình Đặt Thuê & Vòng Đời Hợp Đồng (Contract Lifecycle)
*Mục tiêu: Số hóa toàn diện quy trình thuê thiết bị, quản lý rủi ro và xử lý hư hại minh bạch.*
- [ ] **Backend:**
  - Quản lý State Machine cho Entity `Contract`:
    - `DRAFT` ➔ `PENDING_DEPOSIT` ➔ `ACTIVE` ➔ `RETURNED` ➔ `COMPLETED` / `OVERDUE` / `CANCELLED`.
  - Endpoint tạo đơn thuê và cập nhật trạng thái đặt cọc.
  - Endpoint lập biên bản bàn giao và biên bản thẩm định hư hại:
    - Tính toán trừ tiền phạt hư hỏng từ tiền cọc của khách, hoàn trả số dư cọc còn lại.
- [ ] **Frontend:**
  - Hoàn thiện luồng Checkout: Xác nhận thông tin người nhận, địa chỉ giao hàng, lựa chọn phương thức cọc / thanh toán.
  - Quản lý hợp đồng trong trang Cá nhân [AccountDashboardPage.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/account/AccountDashboardPage.tsx):
    - Xem danh sách hợp đồng theo tab trạng thái.
    - Tải hợp đồng điện tử PDF hoặc xem điều khoản cam kết.
    - Modal xác nhận nhận máy và yêu cầu trả máy khi hết hạn.

---

#### ⚪ Task 6: Kênh Quản Trị Dành Cho Đối Tác (Merchant Portal)
*Mục tiêu: Công cụ đắc lực giúp chủ cửa hàng và cá nhân quản lý kho tài sản và tối đa hóa doanh thu.*
- [ ] **Backend:**
  - Quản lý thực thể `Item` (Từng cá thể thiết bị thực tế trong kho theo mã số sê-ri / barcode / IMEI).
  - Trạng thái Item: `AVAILABLE` (Sẵn sàng), `RENTED` (Đang thuê), `MAINTENANCE` (Bảo trì), `RETIRED` (Hỏng/Thanh lý).
  - Tự động trừ phí hoa hồng sàn theo Tier của Merchant khi đơn hoàn thành (M1: 15% ➔ M4: 2%).
- [ ] **Frontend:**
  - [MerchantInventory.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/inventory/MerchantInventory.tsx): Quản lý danh mục tài sản, thêm mới thiết bị, gán số sê-ri, cập nhật tình trạng bảo trì.
  - [MerchantContracts.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/merchant/MerchantContracts.tsx): Phê duyệt đơn khách đặt, xác nhận giao máy.
  - [ReturnInspectionModal.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/features/account/components/ReturnInspectionModal.tsx): Lập biên bản kiểm tra tình trạng khi nhận lại máy, đính kèm ảnh bằng chứng nếu có xước vỡ.
  - Báo cáo doanh thu thực nhận sau khi sàn đã khấu trừ chiết khấu hoa hồng theo hạng.

---

#### ⚪ Task 7: Kênh Quản Trị Hệ Thống Toàn Quyền (Admin Portal)
*Mục tiêu: Đảm bảo toàn bộ sàn vận hành đúng quy chế, an toàn pháp lý và kiểm soát chất lượng.*
- [ ] **Backend:**
  - Endpoint quản lý người dùng: Khóa/mở tài khoản, thăng/hạ Customer Tier & Merchant Tier thủ công hoặc tự động theo doanh số.
  - Endpoint phê duyệt Merchant B2B: Kiểm tra tính hợp lệ của Mã số thuế và Giấy phép kinh doanh.
  - Quản trị cấu hình hệ thống: Biểu phí cọc, tỷ lệ hoa hồng từng hạng, danh mục EAV.
- [ ] **Frontend:**
  - [AdminApproval.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/admin/AdminApproval.tsx): Giao diện duyệt hồ sơ đăng ký đối tác (xem trước file GPKD, MST, thông tin đại diện).
  - [AdminCategories.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/admin/AdminCategories.tsx): Quản lý cây danh mục kéo thả với thư viện `@dnd-kit`, thêm sửa xóa thuộc tính động EAV.
  - [AdminDashboard.tsx](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/frontend/src/pages/admin/AdminDashboard.tsx): Biểu đồ tăng trưởng người dùng, doanh số toàn sàn, tổng giá trị tài sản đang cho thuê (`Recharts`).

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