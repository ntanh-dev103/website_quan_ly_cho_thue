import { type Category, type Product, type EAVAttribute } from '@/entities/product/product.types';

// ===== EAV Attributes =====
const carAttributes: EAVAttribute[] = [
  { id: 'attr-seats', name: 'Số chỗ ngồi', type: 'options', options: ['4', '5', '7', '9'] },
  { id: 'attr-transmission', name: 'Hộp số', type: 'options', options: ['Số tự động', 'Số sàn'] },
  { id: 'attr-fuel', name: 'Nhiên liệu', type: 'options', options: ['Xăng', 'Dầu', 'Điện'] },
];

const clothingAttributes: EAVAttribute[] = [
  { id: 'attr-size', name: 'Kích cỡ', type: 'options', options: ['S', 'M', 'L', 'XL', 'Free size'] },
  { id: 'attr-color', name: 'Màu sắc', type: 'options', options: ['Đen', 'Trắng', 'Đỏ', 'Xanh'] },
  { id: 'attr-gender', name: 'Giới tính', type: 'options', options: ['Nam', 'Nữ', 'Unisex'] },
];

const techAttributes: EAVAttribute[] = [
  { id: 'attr-brand', name: 'Thương hiệu', type: 'options', options: ['Apple', 'Samsung', 'Sony', 'Canon'] },
  { id: 'attr-condition', name: 'Tình trạng', type: 'options', options: ['Mới 100%', '99%', '95%'] },
];

// ===== Categories =====
export const categories: Category[] = [
  {
    id: 'cat-vehicles',
    name: 'Phương tiện',
    slug: 'phuong-tien',
    availableAttributes: carAttributes,
    children: [
      { id: 'cat-car', name: 'Ô tô', slug: 'o-to', availableAttributes: carAttributes, parentId: 'cat-vehicles' },
      { id: 'cat-moto', name: 'Xe máy', slug: 'xe-may', availableAttributes: carAttributes, parentId: 'cat-vehicles' },
    ]
  },
  {
    id: 'cat-fashion',
    name: 'Thời trang & Sự kiện',
    slug: 'thoi-trang',
    availableAttributes: clothingAttributes,
    children: [
      { id: 'cat-dress', name: 'Váy dạ hội', slug: 'vay-da-hoi', availableAttributes: clothingAttributes, parentId: 'cat-fashion' },
      { id: 'cat-suit', name: 'Vest nam', slug: 'vest-nam', availableAttributes: clothingAttributes, parentId: 'cat-fashion' },
    ]
  },
  {
    id: 'cat-tech',
    name: 'Thiết bị công nghệ',
    slug: 'cong-nghe',
    availableAttributes: techAttributes,
    children: [
      { id: 'cat-camera', name: 'Máy ảnh', slug: 'may-anh', availableAttributes: techAttributes, parentId: 'cat-tech' },
      { id: 'cat-laptop', name: 'Laptop', slug: 'laptop', availableAttributes: techAttributes, parentId: 'cat-tech' },
    ]
  }
];

// ===== Mock Products =====
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'VinFast VF8 Plus 2023 — SUV Điện Cao Cấp',
    slug: 'vinfast-vf8-plus-2023',
    description: 'Xe điện thông minh, không gian rộng rãi, trang bị đầy đủ tính năng an toàn cao cấp và gói tự hành thông minh.',
    categoryId: 'cat-car',
    merchant: { id: 'm-1', name: 'AutoRent Pro HCM', rating: 4.9, totalReviews: 142, tier: 'M3' },
    pricePerDay: 1200000,
    depositAmount: 30000000,
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800',
    ],
    status: 'AVAILABLE',
    district: 'Quận 1',
    city: 'Hồ Chí Minh',
    createdAt: new Date(Date.now() - 10000000).toISOString(),
    featured: true,
    eavValues: [
      { attributeId: 'attr-seats', value: '5' },
      { attributeId: 'attr-transmission', value: 'Số tự động' },
      { attributeId: 'attr-fuel', value: 'Điện' },
    ]
  },
  {
    id: 'prod-2',
    name: 'Máy ảnh Sony Alpha A7 IV + Lens G-Master 24-70mm',
    slug: 'sony-alpha-a7-iv-g-master',
    description: 'Bộ máy ảnh Full-frame chuyên nghiệp quay 4K 60fps 10-bit, chụp chân dung và sự kiện sắc nét.',
    categoryId: 'cat-camera',
    merchant: { id: 'm-2', name: 'Cinematic Gear Studio', rating: 5.0, totalReviews: 320, tier: 'M3' },
    pricePerDay: 850000,
    depositAmount: 15000000,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800',
    ],
    status: 'AVAILABLE',
    district: 'Đống Đa',
    city: 'Hà Nội',
    createdAt: new Date(Date.now() - 20000000).toISOString(),
    featured: true,
    eavValues: [
      { attributeId: 'attr-brand', value: 'Sony' },
      { attributeId: 'attr-condition', value: 'Mới 100%' },
    ]
  },
  {
    id: 'prod-3',
    name: 'Váy dạ hội hoàng gia đính pha lê Sapphire Haute Couture',
    slug: 'vay-da-hoi-hoang-gia-sapphire',
    description: 'Thiết kế độc bản tôn dáng thắt eo, tùng xòe lộng lẫy phù hợp thảm đỏ và dạ tiệc sang trọng.',
    categoryId: 'cat-dress',
    merchant: { id: 'm-3', name: 'Glamour Haute Couture', rating: 4.8, totalReviews: 95, tier: 'M3' },
    pricePerDay: 950000,
    depositAmount: 5000000,
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800',
    ],
    status: 'AVAILABLE',
    district: 'Quận 3',
    city: 'Hồ Chí Minh',
    createdAt: new Date(Date.now() - 30000000).toISOString(),
    featured: true,
    eavValues: [
      { attributeId: 'attr-size', value: 'M' },
      { attributeId: 'attr-color', value: 'Xanh Sapphire' },
    ]
  },
  {
    id: 'prod-4',
    name: 'Lều cắm trại Glamping phong cách Bắc Âu 6-8 người',
    slug: 'leu-cam-trai-glamping-bac-au',
    description: 'Lều Canvas Vintage chống thấm nước 3000mm, khung thép chịu gió, kèm thảm trải và phụ kiện đầy đủ.',
    categoryId: 'cat-tech',
    merchant: { id: 'm-4', name: 'CampOut Vietnam', rating: 4.7, totalReviews: 78, tier: 'M2' },
    pricePerDay: 550000,
    depositAmount: 2000000,
    images: [
      'https://images.unsplash.com/photo-1504280390227-331bf8f8bfce?q=80&w=800',
      'https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=800',
    ],
    status: 'AVAILABLE',
    district: 'Thủ Đức',
    city: 'Hồ Chí Minh',
    createdAt: new Date(Date.now() - 40000000).toISOString(),
    featured: true,
    eavValues: [
      { attributeId: 'attr-brand', value: 'Naturehike' },
      { attributeId: 'attr-condition', value: 'Mới 100%' },
    ]
  },
  {
    id: 'prod-5',
    name: 'MacBook Pro 16" M3 Max (64GB RAM / 1TB SSD)',
    slug: 'macbook-pro-16-m3-max',
    description: 'Siêu phẩm trạm đồ họa di động, render 3D, dựng Premiere 8K không độ trễ, pin dùng cả ngày.',
    categoryId: 'cat-laptop',
    merchant: { id: 'm-5', name: 'TechRental Pro', rating: 4.9, totalReviews: 210, tier: 'M3' },
    pricePerDay: 1350000,
    depositAmount: 60000000,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800',
    ],
    status: 'AVAILABLE',
    district: 'Cầu Giấy',
    city: 'Hà Nội',
    createdAt: new Date(Date.now() - 5000000).toISOString(),
    featured: true,
    eavValues: [
      { attributeId: 'attr-brand', value: 'Apple' },
      { attributeId: 'attr-condition', value: '99%' },
    ]
  },
  {
    id: 'prod-6',
    name: 'Flycam DJI Mavic 3 Pro Cine Combo 3 Camera',
    slug: 'flycam-dji-mavic-3-pro-cine',
    description: 'Hệ thống ba camera Hasselblad hàng đầu, quay Apple ProRes 5.1K, truyền sóng 15km O3+.',
    categoryId: 'cat-camera',
    merchant: { id: 'm-2', name: 'Cinematic Gear Studio', rating: 5.0, totalReviews: 320, tier: 'M3' },
    pricePerDay: 1100000,
    depositAmount: 35000000,
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800',
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=800',
    ],
    status: 'AVAILABLE',
    district: 'Tây Hồ',
    city: 'Hà Nội',
    createdAt: new Date(Date.now() - 60000000).toISOString(),
    featured: true,
    eavValues: [
      { attributeId: 'attr-brand', value: 'DJI' },
      { attributeId: 'attr-condition', value: 'Mới 100%' },
    ]
  },
  {
    id: 'prod-7',
    name: 'Xe tay ga Vespa GTS Super Tech 300 HPE',
    slug: 'vespa-gts-super-tech-300',
    description: 'Mẫu xe tay ga phân khối lớn phong cách Ý lịch lãm, màn hình TFT màu, định vị dẫn đường thông minh.',
    categoryId: 'cat-moto',
    merchant: { id: 'm-6', name: 'Vespa Vintage Rental', rating: 4.8, totalReviews: 88, tier: 'M2' },
    pricePerDay: 450000,
    depositAmount: 8000000,
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=800',
    ],
    status: 'AVAILABLE',
    district: 'Bình Thạnh',
    city: 'Hồ Chí Minh',
    createdAt: new Date(Date.now() - 8000000).toISOString(),
    featured: false,
    eavValues: [
      { attributeId: 'attr-transmission', value: 'Số tự động' },
      { attributeId: 'attr-fuel', value: 'Xăng' },
    ]
  },
  {
    id: 'prod-8',
    name: 'Bộ Vest cưới Tuxedo Ý Black Tie cao cấp',
    slug: 'bo-vest-cuoi-tuxedo-y-black-tie',
    description: 'Chất liệu len dạ cao cấp nhập khẩu Ý, ve áo bóng lụa Satin sang trọng, kèm nơ và măng sét.',
    categoryId: 'cat-suit',
    merchant: { id: 'm-7', name: 'The Gentlemen Tailor', rating: 4.9, totalReviews: 164, tier: 'M3' },
    pricePerDay: 600000,
    depositAmount: 3000000,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800',
    ],
    status: 'AVAILABLE',
    district: 'Hoàn Kiếm',
    city: 'Hà Nội',
    createdAt: new Date(Date.now() - 2000000).toISOString(),
    featured: false,
    eavValues: [
      { attributeId: 'attr-size', value: 'L' },
      { attributeId: 'attr-color', value: 'Đen' },
    ]
  }
];
