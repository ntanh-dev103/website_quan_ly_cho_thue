import { useState } from 'react';
import { Landmark, ArrowUpRight, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { formatCurrency } from '@/shared/lib/utils';
import { toast } from 'sonner';

interface WithdrawModalProps {
  availableBalance: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amount: number) => void;
}

const BANKS = [
  { code: 'VCB', name: 'Vietcombank (Ngoại thương Việt Nam)' },
  { code: 'MB', name: 'MB Bank (Quân Đội)' },
  { code: 'TCB', name: 'Techcombank (Kỹ Thương)' },
  { code: 'ACB', name: 'ACB (Á Châu)' },
  { code: 'VPB', name: 'VPBank (Việt Nam Thịnh Vượng)' },
  { code: 'TPB', name: 'TPBank (Tiên Phong)' },
];

export function WithdrawModal({
  availableBalance,
  isOpen,
  onClose,
  onSuccess,
}: WithdrawModalProps) {
  const [bank, setBank] = useState('VCB');
  const [accountNumber, setAccountNumber] = useState('0071001234567');
  const [accountName, setAccountName] = useState('NGUYEN QUOC DUY');
  const [amount, setAmount] = useState('5000000');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const withdrawAmount = Number(amount) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount < 50000) {
      toast.error('Số tiền rút tối thiểu là 50.000 ₫');
      return;
    }
    if (withdrawAmount > availableBalance) {
      toast.error('Số tiền rút vượt quá số dư khả dụng');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Yêu cầu rút tiền đã được tạo thành công!', {
        description: `Đã chuyển lệnh rút ${formatCurrency(withdrawAmount)} tới ${accountName} (${bank}). Tiền sẽ về tài khoản trong 5-15 phút (Napas 247).`,
      });
      onSuccess?.(withdrawAmount);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md shadow-primary-600/20">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Rút tiền về Tài khoản Ngân hàng
              </h3>
              <p className="text-xs text-gray-500">
                Chuyển nhanh Napas 24/7 • Miễn phí giao dịch 0 ₫
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Balance Preview */}
          <div className="p-4 rounded-xl bg-primary-50/60 border border-primary-200/60 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-primary-700 block">
                Số dư khả dụng hiện tại:
              </span>
              <span className="text-xl font-extrabold text-primary-900">
                {formatCurrency(availableBalance)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAmount(String(availableBalance))}
              className="text-xs font-bold text-primary-600 bg-white px-3 py-1.5 rounded-lg border border-primary-200 hover:bg-primary-50 shadow-2xs"
            >
              Rút tất cả
            </button>
          </div>

          {/* Bank Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Chọn Ngân hàng nhận tiền:
            </label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
            >
              {BANKS.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Số tài khoản ngân hàng:
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Nhập số tài khoản"
              className="w-full px-3 py-2 text-sm font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              required
            />
          </div>

          {/* Account Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Tên chủ tài khoản (Viết in hoa, không dấu):
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value.toUpperCase())}
              placeholder="NGUYEN VAN A"
              className="w-full px-3 py-2 text-sm font-semibold uppercase border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              required
            />
          </div>

          {/* Withdraw Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">
              Số tiền muốn rút (VNĐ):
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="10000"
                min="50000"
                max={availableBalance}
                className="w-full px-3 py-2 text-base font-bold text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                required
              />
              <span className="absolute right-3 top-2 text-xs font-bold text-gray-400">
                VNĐ
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Phí rút tiền: <strong className="text-emerald-600">0 ₫ (Miễn phí hoàn toàn)</strong>
            </p>
          </div>

          {/* Security footnote */}
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-center gap-2 text-xs text-gray-600">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Xác thực OTP sẽ được gửi qua SMS/Telegram khi bấm xác nhận.</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold"
            >
              <ArrowUpRight className="h-4 w-4 mr-1.5" />
              Xác nhận rút tiền
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
