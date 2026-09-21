import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { InventoryTable } from '@/features/inventory/InventoryTable';
import { AddEditProductModal } from '@/features/inventory/AddEditProductModal';
import { FeatureGate } from '@/shared/ui/FeatureGate';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { useProductStore } from '@/entities/product/useProductStore';
import type { Product } from '@/entities/product/product.types';

export function MerchantInventory() {
  const { tier } = useAuthStore();
  const { products } = useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Mock checking limit for M1
  const isM1LimitReached = tier === 'M1' && products.length >= 20; // Example limit

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kho hàng của bạn</h1>
          <p className="text-gray-500 mt-1">Quản lý sản phẩm, tồn kho và thuộc tính</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Feature Gate: Add Product Limit for M1 */}
          {isM1LimitReached ? (
            <FeatureGate requiredTier="M2">
              <Button disabled className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </FeatureGate>
          ) : (
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm sản phẩm
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* VirtualTable adheres to Rule 5 */}
        <InventoryTable products={products} onEdit={handleEdit} />
      </div>

      {isModalOpen && (
        <AddEditProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={editingProduct}
        />
      )}
    </div>
  );
}
