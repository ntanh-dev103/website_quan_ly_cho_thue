export interface ActiveRental {
  id: string;
  contractCode: string;
  productName: string;
  productImage: string;
  categoryName: string;
  merchantName: string;
  startDate: string;
  endDate: string;
  remainingDays: number;
  remainingHours: number;
  dailyRate: number;
  totalPaid: number;
  depositAmount: number;
  status: 'ACTIVE' | 'OVERDUE';
}

export interface CompletedRental {
  id: string;
  contractCode: string;
  productName: string;
  productImage: string;
  merchantName: string;
  completedDate: string;
  totalPaid: number;
  depositRefunded: number;
  rating: number;
  status: 'COMPLETED';
}

export interface IncomingOrder {
  id: string;
  contractCode: string;
  customerName: string;
  customerEmail: string;
  customerTier: string;
  customerAvatar: string;
  productName: string;
  productImage: string;
  rentalDays: number;
  totalAmount: number;
  depositAmount: number;
  startDate: string;
  status: 'PENDING_CONFIRMATION' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface InventoryPreviewItem {
  id: string;
  name: string;
  image: string;
  pricePerDay: number;
  status: 'AVAILABLE' | 'RENTED';
  totalRentals: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Staff' | 'Viewer';
  avatar?: string;
  joinedDate: string;
  status: 'ACTIVE' | 'INVITED';
}

export interface VatInvoice {
  id: string;
  invoiceCode: string;
  clientCompany: string;
  period: string;
  amount: number;
  status: 'Đã xuất' | 'Chờ thanh toán';
  dueDate: string;
  taxRate: string;
}

export interface TransactionLedgerEntry {
  id: string;
  date: string;
  code: string;
  description: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  balanceAfter: number;
  category: 'RENTAL' | 'DEPOSIT' | 'EARNING' | 'REFUND' | 'WITHDRAW';
  status: 'COMPLETED' | 'ESCROW_HOLD';
}
