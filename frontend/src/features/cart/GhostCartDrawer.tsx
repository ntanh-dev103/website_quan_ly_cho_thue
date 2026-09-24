import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useGhostCartStore } from '@/entities/cart/useGhostCartStore';
import { formatCurrency } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

export function GhostCartDrawer() {
  const navigate = useNavigate();
  const { items, isOpen, setIsOpen, removeItem, updateDays, clearCart, getTotalPrice } = useGhostCartStore();

  if (!isOpen) return null;

  const total = getTotalPrice();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Giỏ đồ thuê</h2>
                <span className="text-xs text-gray-500">{items.length} món đồ đã chọn</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-300 mb-4">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Giỏ thuê đang trống</h3>
                <p className="text-xs text-gray-500 max-w-xs mb-6">
                  Bạn có thể thêm máy ảnh, flycam, trang phục hoặc ô tô vào giỏ mà không cần đăng nhập trước.
                </p>
                <Button 
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/catalog');
                  }}
                  className="rounded-xl font-semibold bg-primary-600 hover:bg-primary-700 text-white"
                >
                  Khám phá đồ thuê
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <Link
                            to={`/products/${item.product.id}`}
                            onClick={() => setIsOpen(false)}
                            className="text-xs font-bold text-gray-900 hover:text-primary-600 line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <span className="text-[10px] text-gray-400 block truncate">
                            {item.product.merchant.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-400 hover:text-rose-500 p-1 transition-colors"
                          title="Xóa món này"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateDays(item.product.id, item.days - 1)}
                            className="text-gray-500 hover:text-gray-900"
                            disabled={item.days <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-semibold px-1">{item.days} ngày</span>
                          <button
                            type="button"
                            onClick={() => updateDays(item.product.id, item.days + 1)}
                            className="text-gray-500 hover:text-gray-900"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="text-xs font-extrabold text-primary-600">
                          {formatCurrency(item.product.pricePerDay * item.days)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Tạm tính thuê đồ:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(total)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-600">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Bảo hiểm thiết bị:
                  </span>
                  <span className="font-semibold">Miễn phí</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Tổng cộng:</span>
                  <span className="text-base text-primary-600 font-extrabold">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCart}
                  className="rounded-xl border-gray-200 text-gray-600 hover:text-rose-600 text-xs"
                >
                  Xóa giỏ đồ
                </Button>

                <Button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/login');
                  }}
                  className="rounded-xl font-bold bg-primary-600 hover:bg-primary-700 text-white text-xs flex items-center justify-center gap-1"
                >
                  <span>Thuê ngay</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
