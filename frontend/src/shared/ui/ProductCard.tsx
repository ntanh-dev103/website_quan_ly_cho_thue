import { Link } from 'react-router-dom';
import { Store, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { type Product } from '@/entities/product/product.types';
import { formatCurrency } from '@/shared/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Status Badge */}
          <div className="absolute top-3 left-3 z-10">
            <StatusBadge type="item" status={product.status} size="sm" />
          </div>
          {/* Price Overlay */}
          <div className="absolute bottom-3 right-3 z-10 rounded-lg bg-black/70 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
            {formatCurrency(product.pricePerDay)} / ngày
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="line-clamp-2 min-h-[3rem] text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Merchant Info */}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <Store className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{product.merchant.name}</span>
          </div>

          {/* Location */}
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{product.district}, {product.city}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
