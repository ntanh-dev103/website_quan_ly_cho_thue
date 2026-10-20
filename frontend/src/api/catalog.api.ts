import axiosClient, { type ApiResponse } from './axiosClient';
import { type Product, type Category } from '@/entities/product/product.types';
import { mockProducts, categories as mockCategories } from '@/entities/product/product.mock';

export interface BackendCategoryDto {
  id: number;
  name: string;
  description?: string;
}

export interface BackendProductDto {
  id: number;
  name: string;
  description?: string;
  rentPrice?: number;
  depositPrice?: number;
  pricePerDay?: number;
  depositAmount?: number;
  categoryId?: number;
  categoryName?: string;
  thumbnail?: string;
  images?: string;
  city?: string;
  district?: string;
  featured?: boolean;
  rating?: number;
  totalReviews?: number;
  totalRentals?: number;
  status?: string;
  merchantId?: number;
  merchantName?: string;
  merchantAvatar?: string;
  merchantTier?: string;
  attributes?: string;
}

function mapBackendProductToFrontend(dto: BackendProductDto): Product {
  const imageList: string[] = [];
  if (dto.thumbnail) imageList.push(dto.thumbnail);
  if (dto.images && dto.images !== dto.thumbnail) {
    dto.images
      .split(',')
      .map((img) => img.trim())
      .filter(Boolean)
      .forEach((img) => {
        if (!imageList.includes(img)) imageList.push(img);
      });
  }
  if (imageList.length === 0) {
    imageList.push(
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
    );
  }

  const rawTier = dto.merchantTier?.toUpperCase();
  const validTier =
    rawTier === 'M1' || rawTier === 'M2' || rawTier === 'M3' || rawTier === 'M4' ? rawTier : 'M1';

  const eavValues: Array<{ attributeId: string; value: string | number | boolean }> = [];
  let parsedAttributes: Record<string, any> | undefined = undefined;
  if (dto.attributes) {
    try {
      const parsed = typeof dto.attributes === 'string' ? JSON.parse(dto.attributes) : dto.attributes;
      if (parsed && typeof parsed === 'object') {
        parsedAttributes = parsed;
        Object.entries(parsed).forEach(([k, v]) => {
          eavValues.push({ attributeId: k, value: String(v) });
        });
      }
    } catch {
      // fallback ignore
    }
  }

  return {
    id: String(dto.id),
    name: dto.name,
    slug: dto.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, ''),
    description: dto.description || '',
    categoryId: dto.categoryId ? String(dto.categoryId) : '1',
    merchant: {
      id: String(dto.merchantId || 1),
      name: dto.merchantName || 'RentHub Verified Partner',
      avatar: dto.merchantAvatar || undefined,
      rating: dto.rating || 5.0,
      totalReviews: dto.totalReviews || 0,
      tier: validTier,
    },
    pricePerDay: dto.pricePerDay || dto.rentPrice || 0,
    depositAmount: dto.depositAmount || dto.depositPrice || 0,
    images: imageList,
    status: (dto.status as any) || 'AVAILABLE',
    district: dto.district || '',
    city: dto.city || 'TP. Hồ Chí Minh',
    createdAt: new Date().toISOString(),
    featured: Boolean(dto.featured),
    rating: dto.rating || 5.0,
    totalRentals: dto.totalRentals || (dto.totalReviews ? dto.totalReviews * 2 + 5 : 12),
    eavValues,
    attributes: parsedAttributes,
  };
}

// ─────────────────────────────────────────────
// Public interfaces
// ─────────────────────────────────────────────

export interface SearchParams {
  keyword?: string;
  /** Numeric backend category ID */
  categoryId?: number;
  /** Category name/slug (used for slug-to-name fuzzy match on backend) */
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  district?: string;
  merchantTier?: string;
  rating?: number;
  availability?: string;
  page?: number;
  size?: number;
  /** Spring sort param, e.g. "rentPrice,asc" | "createdAt,desc" */
  sort?: string;
  /** Dynamic EAV key-value pairs passed straight through to backend */
  eavFilters?: Record<string, string>;
}

export interface PaginatedResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ProductAvailability {
  productId: number;
  productName: string;
  totalItems: number;
  availableItems: number;
  isAvailable: boolean;
  bookedDateRanges: Array<{
    startDate: string;
    endDate: string;
  }>;
}

export interface RentalCalculationReq {
  productId: number;
  startDate: string;
  endDate: string;
  deliveryAddress?: string;
  customerTier?: string;
}

export interface RentalCalculationRes {
  productId: number;
  productName: string;
  pricePerDay: number;
  rentalDays: number;
  rentalFee: number;
  baseDepositAmount: number;
  depositRate: number;
  depositAmount: number;
  depositDiscountAmount: number;
  deliveryFee: number;
  totalAmount: number;
  customerTier: string;
  tierName: string;
  tierBadge: string;
}

interface BackendPaginationResponse {
  content: BackendProductDto[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// ─────────────────────────────────────────────
// API object
// ─────────────────────────────────────────────

export const catalogApi = {
  /**
   * Lấy danh sách danh mục từ backend, tự động fallback sang mockCategories nếu offline
   */
  getCategories: async (): Promise<Category[]> => {
    try {
      const res = await axiosClient.get<any, ApiResponse<BackendCategoryDto[]>>('/categories');
      const data = res?.data || (res as any);
      if (Array.isArray(data) && data.length > 0) {
        return data.map((c) => ({
          id: String(c.id),
          name: c.name,
          slug: c.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''),
          availableAttributes: [],
        }));
      }
      return mockCategories;
    } catch {
      return mockCategories;
    }
  },

  /**
   * Tìm kiếm sản phẩm với đầy đủ bộ lọc — gọi GET /api/products/search.
   * Fallback sang client-side filtering trên mockProducts nếu backend offline.
   */
  searchProducts: async (params: SearchParams): Promise<PaginatedResult<Product>> => {
    try {
      // Build flat query-param object (axiosClient serialises this for us)
      const query: Record<string, string> = {};
      if (params.keyword)  query.keyword      = params.keyword;
      if (params.categoryId) query.categoryId = String(params.categoryId);
      if (params.category) query.category     = params.category;
      if ((params.minPrice ?? 0) > 0) query.minPrice = String(params.minPrice);
      if ((params.maxPrice ?? 0) > 0) query.maxPrice = String(params.maxPrice);
      if (params.city)      query.city         = params.city;
      if (params.district)  query.district     = params.district;
      if (params.merchantTier) query.merchantTier = params.merchantTier;
      if (params.rating)    query.rating       = String(params.rating);
      if (params.availability) query.availability = params.availability;
      query.page = String(params.page ?? 0);
      query.size = String(params.size ?? 12);
      if (params.sort)      query.sort         = params.sort;

      // EAV filters — arbitrary keys the backend separates from standard params
      if (params.eavFilters) {
        Object.entries(params.eavFilters).forEach(([k, v]) => {
          if (v) query[k] = v;
        });
      }

      const res = await axiosClient.get<any, ApiResponse<BackendPaginationResponse>>(
        '/products/search',
        { params: query }
      );
      const pageData: BackendPaginationResponse = res?.data ?? (res as any);
      if (pageData && Array.isArray(pageData.content)) {
        return {
          content: pageData.content.map(mapBackendProductToFrontend),
          totalElements: pageData.totalElements,
          totalPages: pageData.totalPages,
          currentPage: pageData.currentPage,
          pageSize: pageData.pageSize,
        };
      }
      throw new Error('invalid_response');
    } catch {
      // ── Offline / development fallback ────────────────────
      let result = [...mockProducts];

      if (params.keyword) {
        const q = params.keyword.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }
      if (params.category) {
        const cat = params.category.toLowerCase();
        // match by categoryId string (mock uses string IDs)
        result = result.filter(
          (p) =>
            p.categoryId.toLowerCase().includes(cat) ||
            // also allow slug match against mock category slugs
            mockCategories.some(
              (c) => c.slug === cat && String(c.id) === p.categoryId
            ) ||
            mockCategories.flatMap((c) => c.children ?? []).some(
              (sub) => sub.slug === cat && String(sub.id) === p.categoryId
            )
        );
      }
      if (params.district) {
        const d = params.district.toLowerCase();
        result = result.filter(
          (p) =>
            p.district.toLowerCase().includes(d) ||
            p.city.toLowerCase().includes(d)
        );
      }
      if ((params.minPrice ?? 0) > 0)
        result = result.filter((p) => p.pricePerDay >= params.minPrice!);
      if ((params.maxPrice ?? 0) > 0)
        result = result.filter((p) => p.pricePerDay <= params.maxPrice!);

      const sorted = [...result];
      if (params.sort === 'rentPrice,asc')
        sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
      else if (params.sort === 'rentPrice,desc')
        sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
      else
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      const page = params.page ?? 0;
      const size = params.size ?? 12;
      const pageSlice = sorted.slice(page * size, page * size + size);
      return {
        content: pageSlice,
        totalElements: sorted.length,
        totalPages: Math.max(1, Math.ceil(sorted.length / size)),
        currentPage: page,
        pageSize: size,
      };
    }
  },

  /**
   * Lấy danh sách tất cả sản phẩm, fallback sang mockProducts
   */
  getProducts: async (): Promise<Product[]> => {
    try {
      const res = await axiosClient.get<any, ApiResponse<BackendProductDto[]>>('/products');
      const data = res?.data || (res as any);
      if (Array.isArray(data) && data.length > 0) {
        return data.map(mapBackendProductToFrontend);
      }
      return mockProducts;
    } catch {
      return mockProducts;
    }
  },

  /**
   * Lấy danh sách sản phẩm nổi bật (Featured Products cho trang chủ)
   */
  getFeaturedProducts: async (): Promise<Product[]> => {
    try {
      const all = await catalogApi.getProducts();
      const featured = all.filter((p) => p.featured);
      return featured.length > 0 ? featured.slice(0, 6) : all.slice(0, 6);
    } catch {
      return mockProducts.filter((p) => p.featured).slice(0, 6);
    }
  },

  /**
   * Lấy chi tiết sản phẩm theo ID (Backend: GET /api/products/{id}, Fallback: mockProducts)
   */
  getProductById: async (id: string | number): Promise<Product | null> => {
    try {
      const res = await axiosClient.get<any, ApiResponse<BackendProductDto>>(`/products/${id}`);
      const data: BackendProductDto = res?.data || (res as any);
      if (data && data.id) {
        return mapBackendProductToFrontend(data);
      }
      const found = mockProducts.find((p) => String(p.id) === String(id));
      return found || null;
    } catch {
      const found = mockProducts.find((p) => String(p.id) === String(id));
      return found || null;
    }
  },

  /**
   * Kiểm tra tình trạng sẵn sàng và các khoảng ngày đã kín máy (Backend: GET /api/products/{id}/availability)
   */
  getProductAvailability: async (id: string | number): Promise<ProductAvailability> => {
    try {
      const res = await axiosClient.get<any, ApiResponse<ProductAvailability>>(`/products/${id}/availability`);
      const data: ProductAvailability = res?.data || (res as any);
      if (data && data.productId) {
        return data;
      }
      return {
        productId: Number(id),
        productName: '',
        totalItems: 3,
        availableItems: 3,
        isAvailable: true,
        bookedDateRanges: [],
      };
    } catch {
      return {
        productId: Number(id),
        productName: '',
        totalItems: 3,
        availableItems: 3,
        isAvailable: true,
        bookedDateRanges: [],
      };
    }
  },

  /**
   * Tính toán chi phí thuê và tiền cọc theo Tier C1-C4 (Backend: POST /api/rental/calculate)
   */
  calculateRental: async (req: RentalCalculationReq): Promise<RentalCalculationRes> => {
    try {
      const res = await axiosClient.post<any, ApiResponse<RentalCalculationRes>>('/rental/calculate', req);
      const data: RentalCalculationRes = res?.data || (res as any);
      if (data && data.totalAmount !== undefined) {
        return data;
      }
      throw new Error('Fallback to local calculation');
    } catch {
      // Offline fallback calculation
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

      const found = mockProducts.find((p) => String(p.id) === String(req.productId));
      const pricePerDay = found?.pricePerDay ?? 500000;
      const rentalFee = pricePerDay * days;
      const baseDeposit = found?.depositAmount ?? pricePerDay * 10;

      const tier = (req.customerTier || 'C1').toUpperCase();
      let depositRate = 0.40;
      let tierName = 'Khách mới';
      let tierBadge = '🔹 C1 (Cọc 40%)';

      if (tier === 'C4') {
        depositRate = 0.0;
        tierName = 'Kim Cương';
        tierBadge = '💎 C4 (Miễn cọc 0đ)';
      } else if (tier === 'C3') {
        depositRate = 0.15;
        tierName = 'Vàng';
        tierBadge = '👑 C3 (Cọc 15%)';
      } else if (tier === 'C2') {
        depositRate = 0.30;
        tierName = 'Bạc';
        tierBadge = '🥈 C2 (Cọc 30%)';
      }

      const depositAmount = baseDeposit * depositRate;
      const depositDiscountAmount = baseDeposit - depositAmount;

      let deliveryFee = 0;
      if (req.deliveryAddress && req.deliveryAddress.trim().length > 0) {
        const addr = req.deliveryAddress.toLowerCase();
        deliveryFee = (addr.includes('hồ chí minh') || addr.includes('hcm') || addr.includes('hà nội') || addr.includes('đà nẵng')) ? 30000 : 50000;
      }

      return {
        productId: req.productId,
        productName: found?.name ?? 'Thiết bị thuê',
        pricePerDay,
        rentalDays: days,
        rentalFee,
        baseDepositAmount: baseDeposit,
        depositRate,
        depositAmount,
        depositDiscountAmount,
        deliveryFee,
        totalAmount: rentalFee + depositAmount + deliveryFee,
        customerTier: tier,
        tierName,
        tierBadge,
      };
    }
  },
};

