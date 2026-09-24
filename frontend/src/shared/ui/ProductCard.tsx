import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Package, Plus } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { TierBadge } from '@/shared/ui/TierBadge';
import { type Product } from '@/entities/product/product.types';
import { formatCurrency } from '@/shared/lib/utils';
import { useGhostCartStore } from '@/entities/cart/useGhostCartStore';

interface ProductCardProps {
  product: Product;
  fixedWidth?: boolean;
}

export function ProductCard({ product, fixedWidth = false }: ProductCardProps) {
  const imgSrc = product.images?.[0] || '';
  const [imgError, setImgError] = useState(!product.images?.[0]);
  const { addItem } = useGhostCartStore();

  const handleQuickRent = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const isM3 = product.merchant.tier === 'M3' || product.merchant.tier === 'M4';

  return (
    <div className={`h-full group ${fixedWidth ? 'w-[220px] shrink-0' : 'w-full'}`}>
      <Card className="h-full overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-2xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-300 flex flex-col justify-between">
        
        {/* Clickable Area linking to detail */}
        <Link to={`/products/${product.id}`} className="block flex-1 flex flex-col">
          
          {/* Image Container: Aspect-ratio 4:3 */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 rounded-t-xl shrink-0">
            {!imgError ? (
              <img
                src={imgSrc}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                <Package className="h-8 w-8 stroke-1 text-gray-300" />
                <span className="text-[10px] mt-1">RentHub</span>
              </div>
            )}

            {/* Status Badge Top-Left */}
            <div className="absolute top-2 left-2 z-10">
              <StatusBadge type="item" status={product.status} size="sm" />
            </div>

            {/* Merchant Tier M3 Badge Top-Right (Gold ✨) */}
            {isM3 && (
              <div className="absolute top-2 right-2 z-10 drop-shadow-sm">
                <TierBadge 
                  role="MERCHANT" 
                  tier={product.merchant.tier || 'M3'} 
                  size="sm" 
                  showLabel={false}
                  className="shadow-sm border-amber-300 bg-amber-50/90 backdrop-blur-xs" 
                />
              </div>
            )}
          </div>

          {/* Card Content: p-4 flex flex-col gap-2 flex-1 */}
          <div className="p-3.5 sm:p-4 flex flex-col gap-2 flex-1">
            {/* Merchant Name + Verified Checkmark (ShieldCheck size 12) */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
              <span className="truncate font-medium text-[11px] text-gray-600">
                {product.merchant.name}
              </span>
              <span title="Đối tác xác minh bảo đảm" className="inline-flex">
                <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
              </span>
            </div>

            {/* Product Name (font-semibold text-sm line-clamp-2) */}
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>

            {/* Location & District */}
            <div className="text-[11px] text-gray-400 mt-auto truncate">
              {product.district}, {product.city}
            </div>
          </div>
        </Link>

        {/* Card Footer: p-4 pt-0 mt-auto */}
        <div className="p-3.5 sm:p-4 pt-0 mt-auto border-t border-gray-100/80 flex items-center justify-between gap-2">
          <div>
            <span className="font-extrabold text-base sm:text-lg text-primary-600 tracking-tight leading-none block">
              {formatCurrency(product.pricePerDay)}
            </span>
            <span className="text-[10px] text-gray-400 block -mt-0.5">/ ngày</span>
          </div>

          {/* Quick Rent Button (Adds to Ghost Cart without login) */}
          <button
            type="button"
            onClick={handleQuickRent}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary-50 hover:bg-primary-600 text-primary-700 hover:text-white font-bold text-xs transition-colors shadow-2xs active:scale-95 cursor-pointer"
            title="Thêm vào giỏ thuê nhanh"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thuê ngay</span>
          </button>
        </div>

      </Card>
    </div>
  );
}

