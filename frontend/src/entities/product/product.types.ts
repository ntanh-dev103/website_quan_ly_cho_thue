import { type ItemStatus } from '@/entities/user/user.types';

export type EAVValueType = 'string' | 'number' | 'boolean' | 'options';

export interface EAVAttribute {
  id: string;
  name: string; // e.g., "Màu sắc", "Hộp số"
  type: EAVValueType;
  options?: string[]; // for type === 'options'
  unit?: string;
}

export interface EAVValue {
  attributeId: string;
  value: string | number | boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children?: Category[];
  availableAttributes: EAVAttribute[];
}

export interface MerchantInfo {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  totalReviews: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  merchant: MerchantInfo;
  
  pricePerDay: number;
  depositAmount: number;
  
  images: string[]; // At least 1 main + thumbnails
  status: ItemStatus;
  
  eavValues: EAVValue[];
  
  district: string;
  city: string;
  
  createdAt: string;
  featured?: boolean;
}
