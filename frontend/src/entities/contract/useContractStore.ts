import { create } from 'zustand';
import { mockContracts } from './contract.mock';
import type { Contract, ContractStatus } from './contract.types';

interface ContractStore {
  contracts: Contract[];
  setContracts: (contracts: Contract[]) => void;
  addContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'status'> & { status?: ContractStatus }) => void;
  updateStatus: (id: string, status: ContractStatus) => void;
  depositContract: (id: string) => void;
  returnContract: (id: string) => void;
  assessDamage: (id: string, compensationFee: number, notes: string) => void;
  addDamageReport: (id: string, report: any) => void;
}

export const useContractStore = create<ContractStore>((set) => ({
  contracts: [...mockContracts],
  
  setContracts: (contracts) => set({ contracts }),

  addContract: (contractData) => set((state) => {
    const newContract: Contract = {
      ...contractData,
      id: `ctr-${Date.now()}`,
      status: contractData.status || 'PENDING_DEPOSIT',
      createdAt: new Date().toISOString(),
    };
    return { contracts: [newContract, ...state.contracts] };
  }),

  updateStatus: (id, status) => set((state) => ({
    contracts: state.contracts.map(c => c.id === id ? { ...c, status } : c)
  })),

  depositContract: (id) => set((state) => ({
    contracts: state.contracts.map(c => c.id === id ? { ...c, status: 'ACTIVE' } : c)
  })),

  returnContract: (id) => set((state) => ({
    contracts: state.contracts.map(c => c.id === id ? { ...c, status: 'RETURNED' } : c)
  })),

  assessDamage: (id, compensationFee, notes) => set((state) => ({
    contracts: state.contracts.map(c => {
      if (c.id !== id) return c;
      const refund = Math.max(0, c.depositAmount - compensationFee);
      return {
        ...c,
        status: 'COMPLETED',
        compensationFee,
        refundAmount: refund,
        damageAssessmentNotes: notes,
        damageReport: {
          id: `dr-${Date.now()}`,
          description: notes,
          images: [],
          depositHandling: compensationFee === 0 ? 'FULL_REFUND' : refund > 0 ? 'PARTIAL_REFUND' : 'NO_REFUND',
          refundAmount: refund,
          deductedAmount: compensationFee,
          createdAt: new Date().toISOString(),
        }
      };
    })
  })),

  addDamageReport: (id, report) => set((state) => ({
    contracts: state.contracts.map(c => 
      c.id === id ? { 
        ...c, 
        status: 'RETURNED', 
        damageReport: {
          ...report,
          id: `dr-${Date.now()}`,
          createdAt: new Date().toISOString()
        } 
      } : c
    )
  })),
}));

