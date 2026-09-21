import os
import glob
import re

BASE_DIR = r"d:\Đồ án\web qly\backend\src\main\java\com\rentalshop\backend"

def rename_dtos():
    java_files = glob.glob(BASE_DIR + '/**/*.java', recursive=True)
    dto_files = [f for f in java_files if f.endswith('Dto.java')]
    
    dto_name_mapping = {}
    for path in dto_files:
        filename = os.path.basename(path)
        old_class = filename.replace('.java', '')
        new_class = old_class[:-3] + 'Response'
        dto_name_mapping[old_class] = new_class
        
        new_path = path.replace(old_class + '.java', new_class + '.java')
        os.rename(path, new_path)
        print(f"Renamed {old_class} to {new_class}")
        
    # Replace references in all java files
    java_files = glob.glob(BASE_DIR + '/**/*.java', recursive=True)
    for path in java_files:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for old_class, new_class in dto_name_mapping.items():
            new_content = re.sub(r'\b' + old_class + r'\b', new_class, new_content)
            
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
    print("DTO references updated.")

def split_services():
    java_files = glob.glob(BASE_DIR + '/**/*.java', recursive=True)
    service_files = [f for f in java_files if f.endswith('Service.java') and 'impl' not in f.replace('\\','/') and 'CustomUserDetailsService' not in f]
    
    for path in service_files:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if 'public interface' in content:
            continue
            
        filename = os.path.basename(path)
        class_name = filename.replace('.java', '')
        
        # Determine package
        package_match = re.search(r'package\s+([^;]+);', content)
        if not package_match: continue
        pkg = package_match.group(1).strip()
        
        # 1. Create interface
        imports = []
        for line in content.split('\n'):
            if line.startswith('import '):
                # Don't need spring stereotyes in interface usually, but just keep all to be safe
                if 'org.springframework.stereotype.Service' not in line and 'lombok' not in line and 'org.springframework.transaction.annotation' not in line:
                    imports.append(line)
        
        # Extract public methods
        # Remove bodies: match { ... } using a stack-based approach
        methods = []
        idx = 0
        while True:
            # Find next 'public '
            pub_idx = content.find('public ', idx)
            if pub_idx == -1: break
            
            # Find next '{' or ';'
            brace_idx = content.find('{', pub_idx)
            semi_idx = content.find(';', pub_idx)
            
            if brace_idx == -1: brace_idx = len(content)
            if semi_idx == -1: semi_idx = len(content)
            
            end_idx = min(brace_idx, semi_idx)
            
            signature = content[pub_idx:end_idx].strip()
            
            if ' class ' not in signature and '=' not in signature and signature.endswith(')'):
                # Clean up @Annotations that might precede or be part of signature if we went too far back
                # Actually, our pub_idx starts at 'public'.
                # Let's remove 'public ' and append ';'
                sig = signature.replace('public ', '', 1).strip() + ';'
                methods.append(sig)
                
            idx = pub_idx + 1

        interface_code = f"package {pkg};\n\n"
        interface_code += "\n".join(imports) + "\n\n"
        interface_code += f"public interface {class_name} {{\n"
        for m in methods:
            interface_code += f"    {m}\n"
        interface_code += "}\n"
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(interface_code)
            
        # 2. Create Impl
        impl_dir = os.path.join(os.path.dirname(path), 'impl')
        os.makedirs(impl_dir, exist_ok=True)
        
        impl_path = os.path.join(impl_dir, class_name + 'Impl.java')
        
        new_content = content.replace(f"package {pkg};", f"package {pkg}.impl;\n\nimport {pkg}.{class_name};")
        new_content = new_content.replace(f"class {class_name}", f"class {class_name}Impl implements {class_name}")
        
        with open(impl_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        print(f"Split {class_name}")

if __name__ == "__main__":
    rename_dtos()
    split_services()
