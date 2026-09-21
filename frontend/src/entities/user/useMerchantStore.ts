import { create } from 'zustand';
import type { User } from './user.types';

export interface MerchantApplication {
  id: string;
  user: User;
  companyName: string;
  taxCode: string;
  businessLicense: string; // URL
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
}

const mockApplications: MerchantApplication[] = [
  {
    id: 'app-1',
    user: { id: 'u1', email: 'newmerchant@test.com', name: 'Trần B', phone: '0901234567', createdAt: new Date().toISOString() } as User,
    companyName: 'Công ty TNHH Cho Thuê Xe Đạp',
    taxCode: '0101234567',
    businessLicense: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'app-2',
    user: { id: 'u2', email: 'camera.pro@test.com', name: 'Lê C', phone: '0901234568', createdAt: new Date().toISOString() } as User,
    companyName: 'Camera Pro Studio',
    taxCode: '0309876543',
    businessLicense: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

interface MerchantStore {
  applications: MerchantApplication[];
  addApplication: (app: Omit<MerchantApplication, 'id' | 'status' | 'createdAt'>) => void;
  approveApplication: (id: string) => void;
  rejectApplication: (id: string, reason: string) => void;
}

export const useMerchantStore = create<MerchantStore>((set) => ({
  applications: [...mockApplications],
  
  addApplication: (data) => set((state) => ({
    applications: [{
      ...data,
      id: `app-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }, ...state.applications]
  })),

  approveApplication: (id) => set((state) => ({
    applications: state.applications.map(app => 
      app.id === id ? { ...app, status: 'APPROVED' } : app
    )
  })),

  rejectApplication: (id, reason) => set((state) => ({
    applications: state.applications.map(app => 
      app.id === id ? { ...app, status: 'REJECTED', rejectionReason: reason } : app
    )
  })),
}));
