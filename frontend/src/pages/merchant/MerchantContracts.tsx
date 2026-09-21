import { useState, useMemo } from 'react';
import { ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { ContractTable } from '@/features/contract/ContractTable';
import { DamageReportModal } from '@/features/contract/DamageReportModal';
import { FeatureGate } from '@/shared/ui/FeatureGate';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { useContractStore } from '@/entities/contract/useContractStore';
import type { Contract, ContractStatus } from '@/entities/contract/contract.types';

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chờ xác nhận', value: 'PENDING' },
  { label: 'Đang thuê', value: 'RENTING' },
  { label: 'Đã trả', value: 'RETURNED' },
  { label: 'Trễ hạn', value: 'OVERDUE' },
  { label: 'Đã hủy', value: 'CANCELLED' },
];

export function MerchantContracts() {
  const { tier } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [autoApprove, setAutoApprove] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const { contracts } = useContractStore();

  const filteredContracts = useMemo(() => {
    if (activeTab === 'ALL') return contracts;
    return contracts.filter(c => c.status === activeTab as ContractStatus);
  }, [activeTab, contracts]);

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
          <p className="text-gray-500 mt-1">Theo dõi, duyệt và xử lý cọc cho các đơn thuê</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Feature Gate: Auto Approve for M2+ */}
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Tự động duyệt đơn (Auto-Approve)</span>
            {tier === 'M1' ? (
              <FeatureGate requiredTier="M2">
                <div className="flex items-center text-gray-400 cursor-not-allowed">
                  <ToggleLeft className="h-6 w-6" />
                </div>
              </FeatureGate>
            ) : (
              <button 
                onClick={() => setAutoApprove(!autoApprove)}
                className={`transition-colors ${autoApprove ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {autoApprove ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
              </button>
            )}
            {tier === 'M1' && <Sparkles className="h-3.5 w-3.5 text-accent-500 ml-1" />}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-2 border-b border-gray-100 overflow-x-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent space-x-1 h-auto p-0">
              {STATUS_TABS.map(tab => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="data-[state=active]:bg-primary-50 data-[state=active]:text-primary-700 data-[state=active]:shadow-none rounded-md px-4 py-2"
                >
                  {tab.label}
                  {tab.value === 'PENDING' && (
                    <span className="ml-2 bg-accent-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {contracts.filter(c => c.status === 'PENDING').length}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* VirtualTable */}
        <ContractTable 
          contracts={filteredContracts} 
          onReportDamage={(contract) => setSelectedContract(contract)} 
        />
      </div>

      {selectedContract && (
        <DamageReportModal
          isOpen={true}
          onClose={() => setSelectedContract(null)}
          contract={selectedContract}
        />
      )}
    </div>
  );
}
