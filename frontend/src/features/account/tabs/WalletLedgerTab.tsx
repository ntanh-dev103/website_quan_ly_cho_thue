import { useState } from 'react';
import { 
  Wallet, 
  Lock, 
  ArrowUpRight, 
  ShieldCheck, 
  Info, 
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { formatCurrency } from '@/shared/lib/utils';
import { mockTransactions } from '../account.mock';
import type { TransactionLedgerEntry } from '../account.types';
import { WithdrawModal } from '../components/WithdrawModal';

export function WalletLedgerTab() {
  const [availableBalance, setAvailableBalance] = useState(15850000);
  const escrowBalance = 8500000;
  const [transactions, setTransactions] = useState<TransactionLedgerEntry[]>(mockTransactions);
  const [filterType, setFilterType] = useState<'ALL' | 'CREDIT' | 'DEBIT' | 'ESCROW'>('ALL');
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleWithdrawSuccess = (withdrawnAmount: number) => {
    setAvailableBalance(prev => Math.max(0, prev - withdrawnAmount));
    const newTx: TransactionLedgerEntry = {
      id: `tx-${Date.now()}`,
      date: 'Vừa xong',
      code: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      description: `Rút tiền về tài khoản ngân hàng liên kết`,
      type: 'DEBIT',
      amount: withdrawnAmount,
      balanceAfter: availableBalance - withdrawnAmount,
      category: 'WITHDRAW',
      status: 'COMPLETED',
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'CREDIT') return tx.type === 'CREDIT';
    if (filterType === 'DEBIT') return tx.type === 'DEBIT';
    if (filterType === 'ESCROW') return tx.status === 'ESCROW_HOLD';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* SECTION 7: BALANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card 1: Số dư khả dụng (Có nút Rút tiền) */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Số dư khả dụng (Available Balance)
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Wallet className="h-4 w-4" />
              </div>
            </div>

            <div className="text-3xl font-black text-gray-900 tracking-tight">
              {formatCurrency(availableBalance)}
            </div>

            <p className="text-xs text-gray-500">
              Tiền từ các đơn cho thuê đã hoàn tất và hoàn cọc đã giải tỏa
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3 border-t border-gray-100">
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Miễn phí rút tiền qua Napas 24/7
            </span>

            {/* "Rút tiền" Button (Primary) */}
            <Button
              onClick={() => setIsWithdrawOpen(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs h-9 px-4 rounded-lg shadow-sm"
            >
              <ArrowUpRight className="h-4 w-4 mr-1.5" />
              Rút tiền
            </Button>
          </div>
        </div>

        {/* Card 2: Tiền đang ký quỹ (Escrow) - CRITICAL: KHÔNG ĐƯỢC CÓ NÚT RÚT TIỀN! */}
        <div className="bg-gray-50/90 rounded-xl border border-gray-300/80 p-6 flex flex-col justify-between space-y-4 relative overflow-hidden">
          {/* Subtle lock watermark background */}
          <div className="absolute right-4 bottom-4 text-gray-200 pointer-events-none">
            <Lock className="h-28 w-28 opacity-40 -mr-6 -mb-6" />
          </div>

          <div className="space-y-1 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Tiền đang ký quỹ (Escrow)
                </span>
                {/* Info / Tooltip trigger */}
                <div 
                  className="relative cursor-pointer text-gray-400 hover:text-gray-600"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <Info className="h-3.5 w-3.5" />
                  {showTooltip && (
                    <div className="absolute left-0 bottom-full mb-2 w-64 p-2.5 bg-gray-900 text-white text-[11px] rounded-lg shadow-xl z-20 pointer-events-none leading-relaxed">
                      Tiền cọc đang giữ cho các hợp đồng active. Tuân thủ SLA Escrow 24h - 48h.
                    </div>
                  )}
                </div>
              </div>

              {/* Locked Badge */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold">
                <Lock className="h-3 w-3" />
                <span>Khóa bảo chứng Escrow</span>
              </div>
            </div>

            <div className="text-3xl font-black text-gray-600 tracking-tight">
              {formatCurrency(escrowBalance)}
            </div>

            <p className="text-xs text-gray-500">
              Tiền cọc đang giữ cho các hợp đồng active
            </p>
          </div>

          {/* CRITICAL Escrow Lock UX Explanation Banner */}
          <div className="pt-2 border-t border-gray-200 text-xs text-gray-600 relative z-10 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              <strong>SLA Escrow 24h/48h:</strong> Tiền cọc được khóa an toàn và <em>không thể rút trực tiếp</em>. Hệ thống sẽ tự động hoàn trả vào Số dư khả dụng sau 24h-48h kể từ khi Merchant xác nhận kiểm tra thiết bị không có hư tổn mới.
            </span>
          </div>
        </div>

      </div>

      {/* SECTION 7: TRANSACTION LEDGER (Recent immutable ledger entries) */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-base">
              Sổ cái Giao dịch Bất biến (Transaction Ledger)
            </h3>
            <p className="text-xs text-gray-500">
              Nhật ký tài chính chi tiết ghi nhận mọi dòng tiền vào, dòng tiền ra và ký quỹ cọc
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg shrink-0">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                filterType === 'ALL'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType('CREDIT')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                filterType === 'CREDIT'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Ghi có (+)
            </button>
            <button
              onClick={() => setFilterType('DEBIT')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                filterType === 'DEBIT'
                  ? 'bg-white text-red-600 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Ghi nợ (-)
            </button>
            <button
              onClick={() => setFilterType('ESCROW')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                filterType === 'ESCROW'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Escrow
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Ngày giờ & Mã GD</th>
                <th className="py-3 px-4">Mô tả giao dịch</th>
                <th className="py-3 px-4">Phân loại</th>
                <th className="py-3 px-4 text-right">Số tiền</th>
                <th className="py-3 px-4 text-right">Số dư sau GD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((tx) => {
                const isCredit = tx.type === 'CREDIT';
                const isEscrow = tx.status === 'ESCROW_HOLD';

                return (
                  <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">{tx.date}</div>
                      <span className="font-mono text-[10px] text-gray-400">{tx.code}</span>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-800 line-clamp-1">{tx.description}</p>
                      {isEscrow && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded mt-0.5">
                          <Lock className="h-2.5 w-2.5" /> Đang giữ Escrow
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tx.category === 'EARNING'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.category === 'RENTAL'
                            ? 'bg-blue-100 text-blue-800'
                            : tx.category === 'DEPOSIT'
                            ? 'bg-amber-100 text-amber-800'
                            : tx.category === 'REFUND'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tx.category === 'EARNING'
                          ? 'Thu tiền thuê'
                          : tx.category === 'RENTAL'
                          ? 'Chi tiền thuê'
                          : tx.category === 'DEPOSIT'
                          ? 'Ký quỹ cọc'
                          : tx.category === 'REFUND'
                          ? 'Hoàn cọc'
                          : 'Rút tiền'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-black text-sm ${
                          isCredit ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }`}
                      >
                        {isCredit ? '+ ' : '- '}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-medium text-gray-700">
                      {formatCurrency(tx.balanceAfter)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw Modal */}
      <WithdrawModal
        availableBalance={availableBalance}
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        onSuccess={handleWithdrawSuccess}
      />
    </div>
  );
}
