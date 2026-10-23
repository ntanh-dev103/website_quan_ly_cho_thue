import { useState } from 'react';
import { 
  ShoppingCart, 
  RotateCcw, 
  RefreshCw,
  ShieldCheck,
  FileCheck2,
  Wrench,
  Check,
  PackageCheck
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { formatCurrency } from '@/shared/lib/utils';
import { useContractStore } from '@/entities/contract/useContractStore';
import type { Contract } from '@/entities/contract/contract.types';
import { contractApi } from '@/api/contract.api';
import { ReturnInspectionModal } from '../components/ReturnInspectionModal';
import { CircularRelistModal } from '../components/CircularRelistModal';
import { ContractPdfModal } from '@/features/contract/ContractPdfModal';
import { DamageAssessmentModal } from '@/features/contract/DamageAssessmentModal';
import { toast } from 'sonner';

type FilterTab = 'ALL' | 'PENDING_DEPOSIT' | 'ACTIVE' | 'RETURNED' | 'COMPLETED' | 'OVERDUE';

export function RentingInTab() {
  const { contracts, depositContract, returnContract, assessDamage } = useContractStore();
  const [activeStatusTab, setActiveStatusTab] = useState<FilterTab>('ALL');

  // Modals state
  const [selectedContractForPdf, setSelectedContractForPdf] = useState<Contract | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const [selectedContractForInspection, setSelectedContractForInspection] = useState<Contract | null>(null);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);

  const [selectedContractForReturn, setSelectedContractForReturn] = useState<Contract | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const [isRelistModalOpen, setIsRelistModalOpen] = useState(false);

  // Filter contracts
  const filteredContracts = contracts.filter((c) => {
    if (activeStatusTab === 'ALL') return true;
    if (activeStatusTab === 'PENDING_DEPOSIT') return c.status === 'PENDING_DEPOSIT' || c.status === 'PENDING';
    if (activeStatusTab === 'ACTIVE') return c.status === 'ACTIVE' || c.status === 'RENTING';
    if (activeStatusTab === 'RETURNED') return c.status === 'RETURNED';
    if (activeStatusTab === 'COMPLETED') return c.status === 'COMPLETED';
    if (activeStatusTab === 'OVERDUE') return c.status === 'OVERDUE';
    return true;
  });

  // Action 1: Confirm Deposit / Handover
  const handleConfirmDeposit = async (contract: Contract) => {
    try {
      await contractApi.depositContract(contract.id);
      depositContract(contract.id);
      toast.success(`Đã xác nhận đặt cọc & kích hoạt hợp đồng ${contract.contractCode}!`);
    } catch {
      depositContract(contract.id);
      toast.success(`Đã kích hoạt hợp đồng ${contract.contractCode}!`);
    }
  };

  // Action 2: Open Return modal
  const handleOpenReturn = (contract: Contract) => {
    setSelectedContractForReturn(contract);
    setIsReturnModalOpen(true);
  };

  const handleReturnSuccess = async (contractId: string) => {
    try {
      await contractApi.returnItems(contractId, { actualReturnDate: new Date().toISOString() });
    } catch {}
    returnContract(contractId);
    toast.success('Đã gửi yêu cầu trả máy! Chờ Merchant đối tác thẩm định hoàn cọc.');
  };

  // Action 3: Open Damage Assessment modal
  const handleOpenAssessment = (contract: Contract) => {
    setSelectedContractForInspection(contract);
    setIsInspectionModalOpen(true);
  };

  const handleConfirmAssessment = async (contractId: string, compensationFee: number, notes: string) => {
    try {
      await contractApi.assessDamage(contractId, {
        compensationFee,
        notes,
        actualReturnDate: new Date().toISOString(),
      });
    } catch {}
    assessDamage(contractId, compensationFee, notes);
  };

  // Action 4: Open PDF Viewer
  const handleOpenPdf = (contract: Contract) => {
    setSelectedContractForPdf(contract);
    setIsPdfModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header section with Circular Reminder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary-600" />
            Quản Lý Hợp Đồng Thuê VÀO (Khách hàng)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Theo dõi vòng đời hợp đồng, xác nhận đặt cọc, tải hợp đồng điện tử PDF và thẩm định hoàn cọc.
          </p>
        </div>

        <Button
          onClick={() => setIsRelistModalOpen(true)}
          variant="outline"
          className="gap-2 border-primary-200 text-primary-700 hover:bg-primary-50 font-bold"
        >
          <RefreshCw className="h-4 w-4" />
          <span>🔄 Chuyển đồ đang thuê</span>
        </Button>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'ALL', label: 'Tất cả', count: contracts.length },
          { 
            key: 'PENDING_DEPOSIT', 
            label: 'Chờ cọc / Chờ giao', 
            count: contracts.filter(c => c.status === 'PENDING_DEPOSIT' || c.status === 'PENDING').length 
          },
          { 
            key: 'ACTIVE', 
            label: 'Đang thuê', 
            count: contracts.filter(c => c.status === 'ACTIVE' || c.status === 'RENTING').length 
          },
          { 
            key: 'RETURNED', 
            label: 'Chờ thẩm định trả', 
            count: contracts.filter(c => c.status === 'RETURNED').length 
          },
          { 
            key: 'COMPLETED', 
            label: 'Đã hoàn thành', 
            count: contracts.filter(c => c.status === 'COMPLETED').length 
          },
          { 
            key: 'OVERDUE', 
            label: 'Quá hạn', 
            count: contracts.filter(c => c.status === 'OVERDUE').length 
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveStatusTab(tab.key as FilterTab)}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
              activeStatusTab === tab.key
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm shadow-primary-600/20'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeStatusTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* CONTRACTS LIST */}
      <div className="space-y-4">
        {filteredContracts.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-200/80 shadow-xs space-y-3">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <PackageCheck className="h-6 w-6" />
            </div>
            <p className="font-bold text-gray-700 text-sm">Không tìm thấy hợp đồng nào trong mục này</p>
            <p className="text-xs text-gray-400">Bạn có thể chọn tab bộ lọc khác hoặc đặt thuê thiết bị mới tại Catalog.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Thiết bị & Mã HĐ</th>
                    <th className="py-3.5 px-4">Thời gian thuê</th>
                    <th className="py-3.5 px-4">Chi phí thuê & Cọc</th>
                    <th className="py-3.5 px-4">Trạng thái vòng đời</th>
                    <th className="py-3.5 px-4 text-right">Thao tác xử lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredContracts.map((contract) => {
                    const isPending = contract.status === 'PENDING_DEPOSIT' || contract.status === 'PENDING';
                    const isActive = contract.status === 'ACTIVE' || contract.status === 'RENTING';
                    const isReturned = contract.status === 'RETURNED';
                    const isCompleted = contract.status === 'COMPLETED';
                    const isOverdue = contract.status === 'OVERDUE';

                    return (
                      <tr key={contract.id} className="hover:bg-gray-50/70 transition-colors">
                        
                        {/* Product & Contract Code */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={contract.product.imageUrl || contract.product.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32'}
                              alt={contract.product.name}
                              className="h-14 w-14 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-200"
                            />
                            <div className="min-w-0 max-w-xs">
                              <p className="font-bold text-gray-900 line-clamp-1">
                                {contract.product.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="bg-slate-100 text-slate-800 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-200">
                                  {contract.contractCode}
                                </span>
                                <span className="text-[11px] text-gray-500">
                                  {contract.totalDays} ngày thuê
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Dates */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <div className="text-gray-900 font-medium">
                              {new Date(contract.startDate).toLocaleDateString('vi-VN')} → {new Date(contract.endDate).toLocaleDateString('vi-VN')}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              Đơn giá: {formatCurrency(contract.product.pricePerDay)}/ngày
                            </div>
                          </div>
                        </td>

                        {/* Fees & Deposit */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <div className="font-bold text-gray-900">
                              Tiền thuê: {formatCurrency(contract.rentalFee)}
                            </div>
                            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3" />
                              Cọc Escrow: {formatCurrency(contract.depositAmount)}
                            </div>
                            {contract.refundAmount !== undefined && contract.refundAmount > 0 && (
                              <div className="text-[10px] text-blue-700 font-semibold">
                                Đã hoàn cọc: {formatCurrency(contract.refundAmount)}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          {isPending && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              ⏳ Chờ đặt cọc
                            </span>
                          )}
                          {isActive && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              🟢 Đang thuê (ACTIVE)
                            </span>
                          )}
                          {isReturned && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                              📦 Đã trả - Chờ thẩm định
                            </span>
                          )}
                          {isCompleted && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              ✅ Hoàn tất (COMPLETED)
                            </span>
                          )}
                          {isOverdue && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                              ⚠️ Quá hạn (OVERDUE)
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            
                            {/* View PDF Contract */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenPdf(contract)}
                              className="text-xs h-8 px-2.5 font-semibold text-slate-700 border-slate-300 hover:bg-slate-50 gap-1"
                            >
                              <FileCheck2 className="h-3.5 w-3.5 text-primary-600" />
                              <span>Hợp đồng PDF</span>
                            </Button>

                            {/* If PENDING: Confirm Deposit / Handover */}
                            {isPending && (
                              <Button
                                size="sm"
                                onClick={() => handleConfirmDeposit(contract)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold h-8 px-3 gap-1"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Xác nhận nhận máy</span>
                              </Button>
                            )}

                            {/* If ACTIVE or OVERDUE: Request Return */}
                            {(isActive || isOverdue) && (
                              <Button
                                size="sm"
                                onClick={() => handleOpenReturn(contract)}
                                className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold h-8 px-3 gap-1"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                                <span>Yêu cầu trả máy</span>
                              </Button>
                            )}

                            {/* If RETURNED: Damage Assessment & Deposit Refund */}
                            {isReturned && (
                              <Button
                                size="sm"
                                onClick={() => handleOpenAssessment(contract)}
                                className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold h-8 px-3 gap-1 shadow-xs"
                              >
                                <Wrench className="h-3.5 w-3.5" />
                                <span>Thẩm định & Hoàn cọc</span>
                              </Button>
                            )}

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Contract Electronic PDF Viewer Modal */}
      <ContractPdfModal
        contract={selectedContractForPdf}
        isOpen={isPdfModalOpen}
        onClose={() => {
          setIsPdfModalOpen(false);
          setSelectedContractForPdf(null);
        }}
      />

      {/* Return Flow Modal with E-Audit ProofCamera */}
      {selectedContractForReturn && (
        <ReturnInspectionModal
          rental={{
            id: selectedContractForReturn.id,
            contractCode: selectedContractForReturn.contractCode,
            productName: selectedContractForReturn.product.name,
            productImage: selectedContractForReturn.product.imageUrl || selectedContractForReturn.product.images?.[0] || '',
            categoryName: 'Thiết bị công nghệ',
            merchantName: 'RentNest Merchant',
            startDate: new Date(selectedContractForReturn.startDate).toLocaleDateString('vi-VN'),
            endDate: new Date(selectedContractForReturn.endDate).toLocaleDateString('vi-VN'),
            remainingDays: selectedContractForReturn.totalDays,
            remainingHours: 0,
            dailyRate: selectedContractForReturn.product.pricePerDay,
            totalPaid: selectedContractForReturn.rentalFee,
            depositAmount: selectedContractForReturn.depositAmount,
            status: selectedContractForReturn.status as any,
          }}
          isOpen={isReturnModalOpen}
          onClose={() => {
            setIsReturnModalOpen(false);
            setSelectedContractForReturn(null);
          }}
          onSuccess={() => {
            handleReturnSuccess(selectedContractForReturn.id);
          }}
        />
      )}

      {/* Damage Assessment & Settlement Modal */}
      <DamageAssessmentModal
        contract={selectedContractForInspection}
        isOpen={isInspectionModalOpen}
        onClose={() => {
          setIsInspectionModalOpen(false);
          setSelectedContractForInspection(null);
        }}
        onConfirm={handleConfirmAssessment}
      />

      {/* Circular Relist Modal */}
      <CircularRelistModal
        isOpen={isRelistModalOpen}
        onClose={() => setIsRelistModalOpen(false)}
      />
    </div>
  );
}
