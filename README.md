# Hệ Thống Quản Lý & Sàn Giao Dịch Cho Thuê Thiết Bị (Rental Management System)

> **Đồ Án Tốt Nghiệp / Dự Án Quản Lý Cho Thuê Đa Năng**  
> Nền tảng kết nối người có nhu cầu thuê thiết bị (máy ảnh, đồ công nghệ, thiết bị sự kiện, phương tiện...) với các thương gia cho thuê, tích hợp cơ chế xếp hạng tín nhiệm đa tầng (Tier System) và quản lý vòng đời hợp đồng chặt chẽ.

---

## 📌 Mục Lục
1. [Giới Thiệu Tổng Quan](#-giới-thiệu-tổng-quan)
2. [Điểm Sáng Nghiệp Vụ & Kiến Trúc](#-điểm-sáng-nghiệp-vụ--kiến-trúc)
3. [Công Nghệ Sử Dụng (Tech Stack)](#-công-nghệ-sử-dụng-tech-stack)
4. [Hệ Thống Phân Quyền & Phân Tầng (Roles & Tiers)](#-hệ-thống-phân-quyền--phân-tầng-roles--tiers)
5. [Cấu Trúc Thư Mục Dự Án](#-cấu-trúc-thư-mục-dự-án)
6. [Hướng Dẫn Cài Đặt & Khởi Chạy](#-hướng-dẫn-cài-đặt--khởi-chạy)
7. [Tài Khoản Thử Nghiệm (Demo Accounts)](#-tài-khoản-thử-nghiệm-demo-accounts)
8. [Tài Liệu API (Swagger)](#-tài-liệu-api-swagger)

---

## 🌟 Giới Thiệu Tổng Quan

Dự án giải quyết trọn vẹn các rủi ro và bất cập trong mô hình cho thuê truyền thống:
* **Khách thuê:** Thường e ngại mức tiền đặt cọc quá cao và thủ tục rườm rà. Hệ thống áp dụng **Customer Tier** – khách thuê uy tín, tích điểm lịch sử tốt sẽ được giảm tiền cọc từ 40% xuống mức **0% (Miễn cọc hoàn toàn)**.
* **Thương gia (Merchant):** Cần công cụ quản lý kho theo số sê-ri / barcode, theo dõi tình trạng từng thiết bị (`Sẵn sàng`, `Đang thuê`, `Bảo trì`, `Ngừng khai thác`), đồng thời được hưởng ưu đãi giảm phí hoa hồng sàn (từ 15% xuống 2%) khi đạt thứ hạng cao.
* **Quản trị viên (Admin):** Kiểm duyệt thương gia, xác thực giấy phép kinh doanh, quản lý cây danh mục đa cấp kéo-thả và cấu hình thuộc tính động (EAV) cho từng loại thiết bị.

---

## 💡 Điểm Sáng Nghiệp Vụ & Kiến Trúc

1. **Bộ Tính Phí Thuê Thông Minh (Rental Calculator):**
   * Tính toán thời gian thực: Số ngày thuê x Đơn giá + Phí giao hàng (theo cự ly/địa chỉ) + Tiền đặt cọc.
   * Tiền cọc được **tính tự động theo Tier của tài khoản đăng nhập**, minh bạch trước khi tạo hợp đồng.
2. **Quản Lý Vòng Đời Hợp Đồng Toàn Diện (Contract Lifecycle):**
   * `DRAFT` (Nháp) ➔ `PENDING_DEPOSIT` (Chờ đặt cọc) ➔ `ACTIVE` (Đang thuê) ➔ `COMPLETED` (Hoàn thành) / `OVERDUE` (Quá hạn).
   * Tích hợp **Biên bản kiểm tra hư hại (`DamageReportModal`)**: Khi nhận lại thiết bị, thương gia có thể ghi nhận sự cố, tải ảnh minh chứng và khấu trừ tiền phạt trực tiếp từ tiền cọc.
3. **Cấu Trúc Thuộc Tính Động (EAV - Entity Attribute Value):**
   * Cho phép Admin gán các thuộc tính đặc thù cho từng danh mục mà không cần sửa cấu trúc Database (ví dụ: Máy ảnh có *Ngàm lens, ISO, Kích thước cảm biến*; Xe máy có *Phân khối, Loại phanh*).
4. **Cây Danh Mục Kéo Thả Trực Quan (`@dnd-kit`):**
   * Admin dễ dàng sắp xếp thứ tự, lồng danh mục con vào danh mục cha với thao tác kéo thả mượt mà.
5. **Bộ Điều Khiển Demo Tức Thì (Demo Controller Widget):**
   * Widget nổi ở góc phải màn hình giúp giảng viên/hội đồng chuyển đổi vai trò ngay tức thì (`Guest`, `C1-C4`, `M1-M4`, `Admin`) mà không cần đăng xuất/đăng nhập lại nhiều lần.

---

## 🛠 Công Nghệ Sử Dụng (Tech Stack)

### Frontend
* **Core:** React 19, TypeScript 5.8, Vite 8
* **Styling & UI:** Tailwind CSS v4, Radix UI Primitives, Lucide Icons, Sonner (Toaster)
* **Kiến trúc:** Feature-Sliced Design (FSD)
* **Quản lý trạng thái (State):** Zustand (với LocalStorage persistence)
* **Tối ưu hiệu năng:** `@tanstack/react-virtual` (Ảo hóa danh sách), `@dnd-kit` (Kéo thả), `recharts` (Biểu đồ doanh thu)
* **Giao tiếp API:** Axios (kèm Interceptor tự động làm mới JWT Access Token)

### Backend
* **Core:** Java 21 / 25, Spring Boot 4.x
* **Bảo mật:** Spring Security, JWT (JSON Web Token - `io.jsonwebtoken 0.11.5`)
* **Dữ liệu & ORM:** Spring Data JPA, Hibernate 7, Microsoft SQL Server (MSSQL)
* **Tiện ích:** Project Lombok, Bean Validation (`jakarta.validation`)
* **Tài liệu hóa:** Springdoc OpenAPI 3.x (Swagger UI)

---

## 👥 Hệ Thống Phân Quyền & Phân Tầng (Roles & Tiers)

### 1. Vai trò (Roles)
* **GUEST:** Xem danh mục, chi tiết sản phẩm, dùng thử bộ tính giá thuê.
* **CUSTOMER:** Thuê thiết bị, quản lý đơn hợp đồng cá nhân, tích lũy điểm hạng.
* **MERCHANT:** Đăng ký gian hàng, quản lý kho thiết bị, ký duyệt bàn giao, lập biên bản sự cố.
* **ADMIN:** Quản trị người dùng, duyệt Merchant, cấu hình biểu phí sàn và quản lý danh mục.

### 2. Phân hạng Khách hàng (Customer Tiers)
| Hạng | Tên Hạng | Biểu Tượng | Tỷ Lệ Tiền Cọc | Quyền Lợi |
| :---: | :---: | :---: | :---: | :--- |
| **C1** | Cơ bản | 🔹 | **40%** | Khách hàng mới bắt đầu |
| **C2** | Bạc | 🥈 | **30%** | Giảm 10% tiền cọc |
| **C3** | Vàng | 👑 | **15%** | Giảm 25% tiền cọc, ưu tiên giao hàng |
| **C4** | Kim Cương | 💎 | **0%** | **Miễn hoàn toàn tiền cọc**, duyệt đơn hỏa tốc |

### 3. Phân hạng Thương gia (Merchant Tiers)
| Hạng | Tên Hạng | Biểu Tượng | Hoa Hồng Sàn Thu | Quyền Lợi |
| :---: | :---: | :---: | :---: | :--- |
| **M1** | Cơ bản | 🔹 | **15%** | Gian hàng tiêu chuẩn |
| **M2** | Bạc | 🥈 | **10%** | Giảm 5% phí hoa hồng |
| **M3** | Vàng | 👑 | **5%** | Huy hiệu Shop Uy Tín, hỗ trợ marketing |
| **M4** | Kim Cương | 💎 | **2%** | Tối đa lợi nhuận, hiển thị đầu trang chủ |

---

## 📂 Cấu Trúc Thư Mục Dự Án

```plaintext
website_quan_ly_cho_thue/
├── frontend/                     # Mã nguồn Frontend (React + Vite + TypeScript)
│   ├── src/
│   │   ├── api/                  # Axios Client, Interceptors, cấu hình Token
│   │   ├── app/                  # Router (Public, Merchant, Admin), Layouts, Guards
│   │   ├── entities/             # Store & Model: User, Product, Contract
│   │   ├── features/             # Logic nghiệp vụ: Rental, Catalog, Inventory, Admin...
│   │   ├── pages/                # Các trang theo phân hệ: public, auth, merchant, admin
│   │   └── shared/               # UI components dùng chung, utils, formatters
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # Mã nguồn Backend (Spring Boot + Java)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/rentalshop/backend/
│   │   │   │   ├── auth/         # Đăng ký, đăng nhập, JWT Provider & Filter
│   │   │   │   ├── common/       # Global Exception Handler, Response Wrapper
│   │   │   │   ├── config/       # SecurityConfig, WebConfig, OpenApiConfig
│   │   │   │   ├── contract/     # Quản lý hợp đồng & xử lý sự cố đền bù
│   │   │   │   ├── customer/     # Hồ sơ và xếp hạng khách hàng
│   │   │   │   ├── maintenance/  # Lịch sử bảo hành, sửa chữa thiết bị
│   │   │   │   ├── product/      # Sản phẩm, Kho hàng (Item), Danh mục, EAV
│   │   │   │   ├── report/       # Báo cáo doanh số, công nợ, phân tích
│   │   │   │   └── security/     # UserPrincipal, Phân quyền chi tiết
│   │   │   └── resources/        # application.yml, SQL migrations
│   └── pom.xml
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu Cầu Môi Trường (Prerequisites)
* **Node.js:** Phiên bản `>= 20.x` (Khuyên dùng v22 hoặc v24)
* **Java SDK:** Phiên bản `>= 21` (Đã kiểm thử tương thích tốt trên OpenJDK 21 và 25)
* **Cơ sở dữ liệu:** Microsoft SQL Server 2019 / 2022 / SQL Express (Cổng mặc định `1433`)

---

### 2. Cấu Hình Cơ Sở Dữ Liệu
1. Mở **SQL Server Management Studio (SSMS)** hoặc công cụ SQL bất kỳ, kết nối tới SQL Server và tạo cơ sở dữ liệu:
   ```sql
   CREATE DATABASE rental_db;
   ```
2. Mở file cấu hình [`backend/src/main/resources/application.yml`](file:///d:/%C4%90%E1%BB%93%20%C3%A1n/website_quan_ly_cho_thue/backend/src/main/resources/application.yml), chỉnh sửa tài khoản/mật khẩu phù hợp:
   ```yaml
   spring:
     datasource:
       url: jdbc:sqlserver://localhost:1433;databaseName=rental_db;encrypt=true;trustServerCertificate=true
       username: sa
       password: <Mat_Khau_SQL_Cua_Ban>
   ```
   *(Cơ chế Hibernate `ddl-auto: update` sẽ tự động sinh toàn bộ bảng khi ứng dụng khởi động lần đầu)*.

---

### 3. Khởi Chạy Backend
Mở một cửa sổ dòng lệnh tại thư mục `backend`:

```powershell
cd backend

# Cách 1: Đóng gói và chạy file JAR thực thi (Khuyên dùng)
.\mvnw.cmd package -DskipTests
java -jar target\rental-management-0.0.1-SNAPSHOT.jar

# Cách 2: Chạy trực tiếp với Maven plugin
.\mvnw.cmd spring-boot:run
```
Backend sẽ khởi động tại: `http://localhost:8080`.

---

### 4. Khởi Chạy Frontend
Mở một cửa sổ dòng lệnh khác tại thư mục `frontend`:

```powershell
cd frontend

# Cài đặt thư viện phụ thuộc (nếu chưa cài)
npm install

# Khởi chạy chế độ phát triển (Development mode)
npm run dev
```
Frontend sẽ sẵn sàng tại: `http://localhost:5173`.

---

## 🔑 Tài Khoản Thử Nghiệm (Demo Accounts)

Bạn có thể đăng nhập bằng các email sau (mật khẩu bất kỳ, ví dụ `password`), hoặc dùng trực tiếp **Demo Controller Widget** ở góc dưới bên phải màn hình:

| Vai Trò | Cấp Bậc | Email Đăng Nhập | Ghi Chú |
| :--- | :---: | :--- | :--- |
| **Quản trị viên** | A1 | `admin@demo.com` | Toàn quyền kiểm duyệt, danh mục, biểu phí |
| **Thương gia VIP** | M4 | `merchant4@demo.com` | Chiết khấu hoa hồng thấp nhất (2%) |
| **Thương gia Vàng** | M3 | `merchant3@demo.com` | Hoa hồng 5% |
| **Thương gia chuẩn** | M2 | `merchant@demo.com` | Hoa hồng 10% |
| **Khách hàng VIP** | C4 | `vip@demo.com` | **Được miễn đặt cọc 100% (0đ)** |
| **Khách hàng Vàng** | C3 | `gold@demo.com` | Đặt cọc 15% |
| **Khách hàng Bạc** | C2 | `silver@demo.com` | Đặt cọc 30% |
| **Khách hàng mới** | C1 | `customer@demo.com` | Đặt cọc tiêu chuẩn 40% |

---

## 📖 Tài Liệu API (Swagger)

Sau khi khởi chạy Backend, truy cập đường dẫn sau trên trình duyệt để kiểm tra và dùng thử toàn bộ API:
* **Swagger UI:** `http://localhost:8080/swagger-ui.html`
* **OpenAPI JSON Docs:** `http://localhost:8080/v3/api-docs`

---
*Dự án được xây dựng với mục tiêu phục vụ đồ án chuyên ngành / bảo vệ tốt nghiệp, đạt chuẩn về cả tính thẩm mỹ giao diện và độ hoàn thiện nghiệp vụ.*