import { create } from 'zustand';
import { mockContracts } from './contract.mock';
import type { Contract, ContractStatus } from './contract.types';

interface ContractStore {
  contracts: Contract[];
  addContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'status'>) => void;
  updateStatus: (id: string, status: ContractStatus) => void;
  addDamageReport: (id: string, report: any) => void;
}

export const useContractStore = create<ContractStore>((set) => ({
  contracts: [...mockContracts],
  
  addContract: (contractData) => set((state) => {
    const newContract: Contract = {
      ...contractData,
      id: `ctr-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    return { contracts: [newContract, ...state.contracts] };
  }),

  updateStatus: (id, status) => set((state) => ({
    contracts: state.contracts.map(c => c.id === id ? { ...c, status } : c)
  })),

  addDamageReport: (id, report) => set((state) => ({
    contracts: state.contracts.map(c => 
      c.id === id ? { 
        ...c, 
        status: 'RETURNED', // Or whatever terminal state
        damageReport: {
          ...report,
          id: `dr-${Date.now()}`,
          createdAt: new Date().toISOString()
        } 
      } : c
    )
  })),
}));
