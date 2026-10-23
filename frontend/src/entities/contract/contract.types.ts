import { type Product } from '../product/product.types';
import { type User } from '../user/user.types';

export type ContractStatus = 
  | 'DRAFT' 
  | 'PENDING_DEPOSIT' 
  | 'PENDING' 
  | 'APPROVED' 
  | 'ACTIVE' 
  | 'RENTING' 
  | 'RETURNED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'OVERDUE';

export interface Contract {
  id: string;
  contractCode: string;
  product: Product;
  customer: User;
  merchantId: string;
  startDate: string; // ISO Date String
  endDate: string;
  totalDays: number;
  rentalFee: number;
  depositAmount: number;
  deliveryFee: number;
  totalAmount: number;
  status: ContractStatus;
  createdAt: string;
  deliveryAddress?: string;
  paymentMethod?: string;
  escrowStatus?: string;
  penaltyFee?: number;
  compensationFee?: number;
  refundAmount?: number;
  damageAssessmentNotes?: string;
  damageReport?: DamageReport;
}

export interface DamageReport {
  id: string;
  description: string;
  images: string[];
  depositHandling: 'FULL_REFUND' | 'PARTIAL_REFUND' | 'NO_REFUND';
  refundAmount: number;
  deductedAmount: number;
  createdAt: string;
}
