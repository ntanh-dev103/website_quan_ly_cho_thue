import os
import glob
import re

OLD_BASE = r"d:\Đồ án\web qly\backend\src\main\java\com\rental"
NEW_BASE = r"d:\Đồ án\web qly\backend\src\main\java\com\rentalshop\backend"
OLD_PACKAGE = "com.rental"
NEW_PACKAGE = "com.rentalshop.backend"

CLASS_MAPPING = {
    # COMMON
    "GlobalExceptionHandler": "common.exception",
    "NotFoundException": "common.exception",
    "BadRequestException": "common.exception",
    "ConflictException": "common.exception",
    "ApiResponse": "common.response",
    "PaginationResponse": "common.response",

    # CONFIG
    "SecurityConfig": "config",
    "OpenApiConfig": "config",

    # SECURITY
    "JwtTokenProvider": "security.jwt",
    "JwtAuthenticationFilter": "security.jwt",
    "CustomUserDetails": "security",
    "CustomUserDetailsService": "security",

    # AUTH & USER
    "AuthController": "auth.controller",
    "UserController": "auth.controller",
    "LoginRequest": "auth.dto.request",
    "RefreshRequest": "auth.dto.request",
    "CreateUserRequest": "auth.dto.request",
    "LoginResponse": "auth.dto.response",
    "UserDto": "auth.dto.response",
    "AuthService": "auth.service",
    "UserService": "auth.service",
    "UserRepository": "auth.repository",
    "User": "auth.entity",
    "Role": "auth.entity",

    # PRODUCT
    "CategoryController": "product.controller",
    "ProductController": "product.controller",
    "InventoryController": "product.controller",
    "CheckAvailabilityRequest": "product.dto.request",
    "CheckAvailabilityResponse": "product.dto.response",
    "CategoryDto": "product.dto.response",
    "ProductDto": "product.dto.response",
    "ProductItemDto": "product.dto.response",
    "CategoryService": "product.service",
    "ProductService": "product.service",
    "InventoryService": "product.service",
    "ProductItemStateService": "product.service",
    "CategoryRepository": "product.repository",
    "ProductRepository": "product.repository",
    "ProductItemRepository": "product.repository",
    "Category": "product.entity",
    "Product": "product.entity",
    "ProductItem": "product.entity",
    "ItemStatus": "product.enums",

    # CUSTOMER
    "CustomerController": "customer.controller",
    "CreateCustomerRequest": "customer.dto.request",
    "UpdateCustomerRequest": "customer.dto.request",
    "CustomerDto": "customer.dto.response",
    "CustomerService": "customer.service",
    "CustomerRepository": "customer.repository",
    "Customer": "customer.entity",
    "CustomerTier": "customer.enums",

    # CONTRACT
    "ContractController": "contract.controller",
    "CreateContractRequest": "contract.dto.request",
    "ReturnItemsRequest": "contract.dto.request",
    "ContractDto": "contract.dto.response",
    "ContractDetailDto": "contract.dto.response",
    "ContractService": "contract.service",
    "ContractRepository": "contract.repository",
    "PaymentRepository": "contract.repository",
    "Contract": "contract.entity",
    "ContractDetail": "contract.entity",
    "Payment": "contract.entity",
    "ContractStatus": "contract.enums",
    "PaymentType": "contract.enums",
}

def main():
    java_files = glob.glob(OLD_BASE + '/**/*.java', recursive=True)

    fqn_map = {}
    for path in java_files:
        filename = os.path.basename(path)
        if filename == "RentalManagementApplication.java":
            fqn_map[OLD_PACKAGE + ".RentalManagementApplication"] = NEW_PACKAGE + ".BackendApplication"
            continue

        class_name = filename.replace(".java", "")
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        pkg_match = re.search(r'package\s+([^;]+);', content)
        if pkg_match:
            old_pkg = pkg_match.group(1).strip()
            old_fqn = f"{old_pkg}.{class_name}"
            
            new_pkg_suffix = CLASS_MAPPING.get(class_name)
            if new_pkg_suffix:
                new_fqn = f"{NEW_PACKAGE}.{new_pkg_suffix}.{class_name}"
                fqn_map[old_fqn] = new_fqn

    for path in java_files:
        filename = os.path.basename(path)
        class_name = filename.replace(".java", "")
        
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_pkg_suffix = CLASS_MAPPING.get(class_name)
        if filename == "RentalManagementApplication.java":
            new_pkg = NEW_PACKAGE
            new_filename = "BackendApplication.java"
        elif new_pkg_suffix:
            new_pkg = f"{NEW_PACKAGE}.{new_pkg_suffix}"
            new_filename = filename
        else:
            print(f"Skipping {filename}")
            continue

        # Replace package
        content = re.sub(r'package\s+([^;]+);', f'package {new_pkg};', content, count=1)
        
        # Replace explicit imports
        for old_fqn, new_fqn in fqn_map.items():
            if old_fqn != new_fqn:
                content = content.replace(f'import {old_fqn};', f'import {new_fqn};')

        # Add missing imports (classes that were in the same package before but now are not)
        for old_fqn, new_fqn in fqn_map.items():
            other_class_name = old_fqn.split('.')[-1]
            other_pkg = new_fqn.rsplit('.', 1)[0]
            
            if other_class_name != class_name and other_pkg != new_pkg:
                if re.search(r'\b' + other_class_name + r'\b', content):
                    if f"import {new_fqn};" not in content:
                        content = content.replace(f'package {new_pkg};', f'package {new_pkg};\nimport {new_fqn};')

        # Application class rename
        if filename == "RentalManagementApplication.java":
            content = content.replace("RentalManagementApplication", "BackendApplication")

        new_dir = os.path.join(NEW_BASE, new_pkg.replace(NEW_PACKAGE, "").strip(".").replace(".", "\\"))
        os.makedirs(new_dir, exist_ok=True)
        
        new_path = os.path.join(new_dir, new_filename)
        with open(new_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Moved {filename} -> {new_pkg}")

if __name__ == "__main__":
    main()
