import { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

interface TierConfig {
  id: string;
  name: string;
  rate: number; // Deposit (Customer) or Commission (Merchant)
  maxLimits: string;
  priorityScore: number;
}

const INITIAL_CUSTOMER_TIERS: TierConfig[] = [
  { id: 'C1', name: 'Thành viên mới (G1/C1)', rate: 40, maxLimits: '2 đơn / lúc', priorityScore: 1 },
  { id: 'C2', name: 'Thành viên Bạc (C2)', rate: 30, maxLimits: '5 đơn / lúc', priorityScore: 2 },
  { id: 'C3', name: 'Thành viên Vàng (C3)', rate: 15, maxLimits: '10 đơn / lúc', priorityScore: 3 },
  { id: 'C4', name: 'Khách hàng VIP (C4)', rate: 0, maxLimits: 'Không giới hạn', priorityScore: 5 },
];

const INITIAL_MERCHANT_TIERS: TierConfig[] = [
  { id: 'M1', name: 'Đối tác mới (M1)', rate: 15, maxLimits: 'Tối đa 20 SP', priorityScore: 1 },
  { id: 'M2', name: 'Cửa hàng chuẩn (M2)', rate: 10, maxLimits: 'Tối đa 100 SP', priorityScore: 2 },
  { id: 'M3', name: 'Đại lý lớn (M3)', rate: 5, maxLimits: 'Tối đa 500 SP', priorityScore: 3 },
  { id: 'M4', name: 'Đối tác Chiến lược (M4)', rate: 2, maxLimits: 'Không giới hạn', priorityScore: 5 },
];

export function AdminTiers() {
  const [activeTab, setActiveTab] = useState('CUSTOMER');
  const [customerTiers, setCustomerTiers] = useState(INITIAL_CUSTOMER_TIERS);
  const [merchantTiers, setMerchantTiers] = useState(INITIAL_MERCHANT_TIERS);
  
  const [editingTier, setEditingTier] = useState<TierConfig | null>(null);
  const [editRate, setEditRate] = useState<number>(0);

  const currentTiers = activeTab === 'CUSTOMER' ? customerTiers : merchantTiers;

  const handleEdit = (tier: TierConfig) => {
    setEditingTier(tier);
    setEditRate(tier.rate);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier) return;

    if (activeTab === 'CUSTOMER') {
      setCustomerTiers(prev => prev.map(t => t.id === editingTier.id ? { ...t, rate: editRate } : t));
    } else {
      setMerchantTiers(prev => prev.map(t => t.id === editingTier.id ? { ...t, rate: editRate } : t));
    }

    toast.success(`Cập nhật cấu hình ${editingTier.name} thành công!`);
    setEditingTier(null);
  };

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cấu hình Cấp bậc (Tier)</h1>
          <p className="text-gray-500 mt-1">Quản lý tỷ lệ cọc, hoa hồng và các đặc quyền cho từng nhóm</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="CUSTOMER">Khách thuê (Customer)</TabsTrigger>
              <TabsTrigger value="MERCHANT">Đối tác (Merchant)</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 rounded-tl-lg">Mã</th>
                <th className="py-3 px-4">Tên Cấp bậc</th>
                <th className="py-3 px-4">{activeTab === 'CUSTOMER' ? 'Tỷ lệ cọc (%)' : 'Hoa hồng sàn (%)'}</th>
                <th className="py-3 px-4">Giới hạn hệ thống</th>
                <th className="py-3 px-4">Điểm ưu tiên hiển thị</th>
                <th className="py-3 px-4 rounded-tr-lg">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentTiers.map(tier => (
                <tr key={tier.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-gray-900">{tier.id}</td>
                  <td className="py-3 px-4 font-medium text-blue-700">{tier.name}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-lg text-gray-900">{tier.rate}</span>
                    <span className="text-gray-500">%</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{tier.maxLimits}</td>
                  <td className="py-3 px-4 text-gray-600">{tier.priorityScore}</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm" className="h-8 px-3 gap-1" onClick={() => handleEdit(tier)}>
                      <Edit2 className="w-3.5 h-3.5" /> Sửa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingTier && (
        <Modal 
          open={!!editingTier} 
          onOpenChange={(open) => !open && setEditingTier(null)}
          title={`Chỉnh sửa ${editingTier.name}`}
        >
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{activeTab === 'CUSTOMER' ? 'Tỷ lệ cọc áp dụng (%)' : 'Hoa hồng sàn thu (%)'}</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    min="0" max="100" 
                    value={editRate} 
                    onChange={e => setEditRate(Number(e.target.value))} 
                    className="pl-4 pr-10 text-lg font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                </div>
                <p className="text-xs text-gray-500">Thay đổi này sẽ áp dụng ngay lập tức cho các giao dịch mới trên toàn hệ thống.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => setEditingTier(null)}>Hủy</Button>
              <Button type="submit">Lưu cấu hình</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
