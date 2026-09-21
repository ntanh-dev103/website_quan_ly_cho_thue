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
    name: 'VinFast VF8 Plus 2023',
    slug: 'vinfast-vf8-plus-2023',
    description: 'Xe điện thông minh, không gian rộng rãi, trang bị đầy đủ tính năng an toàn cao cấp.',
    categoryId: 'cat-car',
    merchant: { id: 'm-1', name: 'AutoRent HCM', rating: 4.8, totalReviews: 124 },
    pricePerDay: 1200000,
    depositAmount: 30000000,
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800',
      'https://images.unsplash.com/photo-1503376760366-5141328c340c?q=80&w=800',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=800'
    ],
    status: 'AVAILABLE',
    district: 'Quận 1',
    city: 'Hồ Chí Minh',
    createdAt: new Date(Date.now() - 100000000).toISOString(),
    featured: true,
    eavValues: [
      { attributeId: 'attr-seats', value: '5' },
      { attributeId: 'attr-transmission', value: 'Số tự động' },
      { attributeId: 'attr-fuel', value: 'Điện' },
    ]
  },
  {
    id: 'prod-2',
    name: 'Máy ảnh Sony A7III kèm Lens 24-70mm f2.8',
    slug: 'sony-a7iii-lens-24-70',
    description: 'Combo máy ảnh chuyên nghiệp cho quay chụp sự kiện, chân dung.',
    categoryId: 'cat-camera',
    merchant: { id: 'm-2', name: 'Camera Store', rating: 4.9, totalReviews: 312 },
    pricePerDay: 500000,
    depositAmount: 15000000,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800',
      'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=800'
    ],
    status: 'AVAILABLE',
    district: 'Đống Đa',
    city: 'Hà Nội',
    createdAt: new Date(Date.now() - 200000000).toISOString(),
    featured: true,
    eavValues: [
      { attributeId: 'attr-brand', value: 'Sony' },
      { attributeId: 'attr-condition', value: '99%' },
    ]
  },
  {
    id: 'prod-3',
    name: 'Váy dạ hội cao cấp đính đá Sapphire',
    slug: 'vay-da-hoi-cao-cap-sapphire',
    description: 'Thiết kế sang trọng, phù hợp cho các sự kiện thảm đỏ, tiệc tối.',
    categoryId: 'cat-dress',
    merchant: { id: 'm-3', name: 'Glamour Boutique', rating: 4.7, totalReviews: 89 },
    pricePerDay: 800000,
    depositAmount: 5000000,
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800'
    ],
    status: 'RENTED',
    district: 'Quận 3',
    city: 'Hồ Chí Minh',
    createdAt: new Date(Date.now() - 300000000).toISOString(),
    featured: true,
    eavValues: [
      { attributeId: 'attr-size', value: 'M' },
      { attributeId: 'attr-color', value: 'Xanh' },
      { attributeId: 'attr-gender', value: 'Nữ' },
    ]
  },
  {
    id: 'prod-4',
    name: 'Lều cắm trại Glamping 6-8 người',
    slug: 'leu-cam-trai-glamping-8-nguoi',
    description: 'Lều Glamping rộng rãi, chống nước tốt, thích hợp cho gia đình hoặc nhóm bạn.',
    categoryId: 'cat-tech', // placing here as we don't have outdoors cat
    merchant: { id: 'm-4', name: 'Outdoor Gear', rating: 4.6, totalReviews: 45 },
    pricePerDay: 300000,
    depositAmount: 1500000,
    images: [
      'https://images.unsplash.com/photo-1504280390227-331bf8f8bfce?q=80&w=800',
      'https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=800'
    ],
    status: 'AVAILABLE',
    district: 'Thủ Đức',
    city: 'Hồ Chí Minh',
    createdAt: new Date(Date.now() - 50000000).toISOString(),
    eavValues: [
       { attributeId: 'attr-brand', value: 'Naturehike' },
       { attributeId: 'attr-condition', value: 'Mới 100%' },
    ]
  },
  {
    id: 'prod-5',
    name: 'MacBook Pro 16" M3 Max 64GB/2TB',
    slug: 'macbook-pro-16-m3-max',
    description: 'Cấu hình khủng, phù hợp dựng phim 4K, xử lý 3D, lập trình phức tạp.',
    categoryId: 'cat-laptop',
    merchant: { id: 'm-2', name: 'Camera Store', rating: 4.9, totalReviews: 312 },
    pricePerDay: 1500000,
    depositAmount: 80000000,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800'
    ],
    status: 'AVAILABLE',
    district: 'Đống Đa',
    city: 'Hà Nội',
    createdAt: new Date(Date.now() - 10000000).toISOString(),
    featured: true,
    eavValues: [
      { attributeId: 'attr-brand', value: 'Apple' },
      { attributeId: 'attr-condition', value: '99%' },
    ]
  }
];
