import { useState } from 'react';
import { 
  ShoppingCart, 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { formatCurrency } from '@/shared/lib/utils';
import { mockActiveRentals, mockCompletedRentals } from '../account.mock';
import type { ActiveRental } from '../account.types';
import { ReturnInspectionModal } from '../components/ReturnInspectionModal';
import { CircularRelistModal } from '../components/CircularRelistModal';
import { toast } from 'sonner';

export function RentingInTab() {
  const [rentals, setRentals] = useState<ActiveRental[]>(mockActiveRentals);
  const [selectedRentalForReturn, setSelectedRentalForReturn] = useState<ActiveRental | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isRelistModalOpen, setIsRelistModalOpen] = useState(false);

  const handleOpenReturn = (rental: ActiveRental) => {
    setSelectedRentalForReturn(rental);
    setIsReturnModalOpen(true);
  };

  const handleReturnSuccess = (returnedId: string) => {
    setRentals(prev => prev.filter(r => r.id !== returnedId));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section with Circular Reminder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary-600" />
            Đang thuê VÀO (Khách hàng)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Theo dõi thời hạn các thiết bị đang thuê, hoàn tất trả hàng hoặc chuyển tiếp cho người khác
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

      {/* ACTIVE RENTALS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            Hợp đồng đang hoạt động
            <span className="text-xs bg-primary-100 text-primary-700 font-bold px-2 py-0.5 rounded-full">
              {rentals.length} hợp đồng
            </span>
          </h3>
        </div>

        {/* Active Rentals Table / Cards */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Sản phẩm & Đối tác</th>
                  <th className="py-3.5 px-4">Thời gian thuê</th>
                  <th className="py-3.5 px-4">Thời hạn còn lại</th>
                  <th className="py-3.5 px-4">Tổng đã trả & Cọc</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rentals.map((rental) => {
                  const isOverdue = rental.status === 'OVERDUE';
                  return (
                    <tr key={rental.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Product */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={rental.productImage}
                            alt={rental.productName}
                            className="h-14 w-14 rounded-lg object-cover bg-gray-100 shrink-0 shadow-2xs"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-gray-900 line-clamp-1">
                              {rental.productName}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {rental.merchantName}
                            </p>
                            <span className="inline-block mt-1 bg-gray-100 text-gray-700 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded">
                              {rental.contractCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="text-gray-900 font-medium">
                            {rental.startDate} → {rental.endDate}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Giá thuê: {formatCurrency(rental.dailyRate)}/ngày
                          </div>
                        </div>
                      </td>

                      {/* Remaining countdown */}
                      <td className="py-3.5 px-4">
                        {isOverdue ? (
                          <div className="flex items-center gap-1.5 text-red-600 font-bold">
                            <AlertCircle className="h-4 w-4" />
                            <span>Đã quá hạn trả</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg w-fit">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              Còn {rental.remainingDays} ngày {rental.remainingHours} giờ
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Paid & Deposit */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-bold text-gray-900">
                            {formatCurrency(rental.totalPaid)}
                          </div>
                          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" />
                            Cọc Escrow: {formatCurrency(rental.depositAmount)}
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isOverdue
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isOverdue ? 'Quá hạn (OVERDUE)' : 'Đang thuê (ACTIVE)'}
                        </span>
                      </td>

                      {/* Action: "Yêu cầu trả hàng" */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleOpenReturn(rental)}
                            className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold px-3"
                          >
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            Yêu cầu trả hàng
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* HISTORY SECTION: PAST COMPLETED RENTALS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Lịch sử đơn thuê đã hoàn thành (COMPLETED)
          </h3>
          <span className="text-xs text-gray-500">
            Tổng cộng: {mockCompletedRentals.length} hợp đồng trước đây
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockCompletedRentals.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-2xs space-y-3 flex flex-col justify-between hover:border-gray-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span className="font-mono bg-gray-100 px-2 py-0.5 rounded font-semibold text-gray-700">
                    {item.contractCode}
                  </span>
                  <span>Ngày xong: {item.completedDate}</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="h-14 w-14 rounded-lg object-cover bg-gray-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 line-clamp-2">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {item.merchantName}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Tổng tiền thuê:</span>
                    <span className="font-bold text-gray-900">{formatCurrency(item.totalPaid)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Hoàn cọc:</span>
                    <span className="font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      100% ({formatCurrency(item.depositRefunded)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2 border-t border-gray-100">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info('Đang chuyển tới trang chi tiết sản phẩm...')}
                  className="text-xs rounded-lg h-7 px-2.5 font-semibold text-primary-600 border-primary-200 hover:bg-primary-50"
                >
                  Thuê lại
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Return Flow Modal with E-Audit ProofCamera */}
      <ReturnInspectionModal
        rental={selectedRentalForReturn}
        isOpen={isReturnModalOpen}
        onClose={() => {
          setIsReturnModalOpen(false);
          setSelectedRentalForReturn(null);
        }}
        onSuccess={handleReturnSuccess}
      />

      {/* Circular Relist Modal */}
      <CircularRelistModal
        isOpen={isRelistModalOpen}
        onClose={() => setIsRelistModalOpen(false)}
      />
    </div>
  );
}
