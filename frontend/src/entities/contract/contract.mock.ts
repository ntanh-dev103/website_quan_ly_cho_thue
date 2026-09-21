import { type Contract } from './contract.types';
import { mockProducts } from '../product/product.mock';

const mockCustomer = {
  id: 'cust-1',
  email: 'customer@test.com',
  name: 'Nguyễn Văn A',
  role: 'CUSTOMER' as const,
  tier: 'C1' as const,
  createdAt: new Date().toISOString(),
};

export const mockContracts: Contract[] = [
  {
    id: 'ctr-1',
    contractCode: 'HD-2026-001',
    product: mockProducts[0], // VinFast VF8
    customer: mockCustomer,
    merchantId: 'merchant-1',
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    totalDays: 3,
    rentalFee: 3600000,
    depositAmount: 320000000, // 40% của 800tr
    deliveryFee: 0,
    totalAmount: 323600000,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ctr-2',
    contractCode: 'HD-2026-002',
    product: mockProducts[2], // Váy dạ hội
    customer: mockCustomer,
    merchantId: 'merchant-1',
    startDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    totalDays: 3,
    rentalFee: 600000,
    depositAmount: 1200000,
    deliveryFee: 50000,
    totalAmount: 1850000,
    status: 'RENTING',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'ctr-3',
    contractCode: 'HD-2026-003',
    product: mockProducts[1], // MacBook
    customer: mockCustomer,
    merchantId: 'merchant-1',
    startDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    totalDays: 5,
    rentalFee: 1500000,
    depositAmount: 12000000,
    deliveryFee: 0,
    totalAmount: 13500000,
    status: 'RETURNED',
    createdAt: new Date(Date.now() - 86400000 * 11).toISOString(),
  }
];
