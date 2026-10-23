import { useState, useEffect } from 'react';
import { Edit2, Percent } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { adminApi, type TierConfigDto } from '@/api/admin.api';
import { toast } from 'sonner';

export function AdminTiers() {
  const [activeTab, setActiveTab] = useState<'CUSTOMER' | 'MERCHANT'>('CUSTOMER');
  const [tierConfigs, setTierConfigs] = useState<TierConfigDto[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [editingTier, setEditingTier] = useState<TierConfigDto | null>(null);
  const [editRate, setEditRate] = useState<number>(0);
  const [editLimits, setEditLimits] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchTierConfigs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getTierConfigs();
      setTierConfigs(res);
    } catch {
      toast.error('Không thể tải cấu hình Tiers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTierConfigs();
  }, []);

  const currentTiers = tierConfigs.filter(t => t.type === activeTab);

  const handleEdit = (tier: TierConfigDto) => {
    setEditingTier(tier);
    setEditRate(tier.rate);
    setEditLimits(tier.maxLimits);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier) return;

    try {
      setIsSaving(true);
      await adminApi.updateTierConfig(editingTier.id, {
        rate: editRate,
        maxLimits: editLimits.trim(),
      });

      setTierConfigs(prev => prev.map(t => t.id === editingTier.id ? { ...t, rate: editRate, maxLimits: editLimits.trim() } : t));
      toast.success(`Cập nhật cấu hình hạng [${editingTier.id} - ${editingTier.name}] thành công!`, {
        description: `Tỷ lệ mới: ${editRate}% • Hạn mức: ${editLimits}`,
      });
      setEditingTier(null);
    } catch {
      setTierConfigs(prev => prev.map(t => t.id === editingTier.id ? { ...t, rate: editRate, maxLimits: editLimits.trim() } : t));
      toast.success(`Cập nhật cấu hình hạng ${editingTier.name} thành công! (Mock update)`);
      setEditingTier(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Cấu hình Cấp bậc & Biểu phí (Tier Settings)</h1>
          <p className="text-sm text-slate-500 mt-0.5">Quản lý tỷ lệ đặt cọc cho Khách thuê (C1-C4) và hoa hồng sàn cho Đối tác (M1-M4)</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/80 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-[420px]">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="CUSTOMER" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-2xs">
                Khách thuê (Customer Tiers)
              </TabsTrigger>
              <TabsTrigger value="MERCHANT" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-2xs">
                Đối tác (Merchant Tiers)
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <span className="text-xs text-slate-400 font-mono">
            {activeTab === 'CUSTOMER' ? 'Áp dụng cho tỷ lệ đặt cọc' : 'Áp dụng cho chiết khấu sàn'}
          </span>
        </div>

        <div className="p-6 overflow-x-auto flex-1">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 rounded-tl-lg">Mã Hạng</th>
                <th className="py-3 px-4">Tên Cấp bậc</th>
                <th className="py-3 px-4">
                  {activeTab === 'CUSTOMER' ? 'Tỷ lệ tiền cọc (%)' : 'Tỷ lệ hoa hồng sàn (%)'}
                </th>
                <th className="py-3 px-4">Hạn mức hệ thống</th>
                <th className="py-3 px-4">Điểm ưu tiên</th>
                <th className="py-3 px-4 rounded-tr-lg text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">Đang tải cấu hình...</td>
                </tr>
              ) : (
                currentTiers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">
                      <span className={`px-2 py-0.5 rounded-md border ${
                        t.id.startsWith('C') 
                          ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                          : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                      }`}>
                        {t.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{t.name}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 font-extrabold text-sm ${
                        activeTab === 'CUSTOMER'
                          ? t.rate === 0 ? 'text-emerald-600' : 'text-blue-600'
                          : t.rate <= 5 ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        <Percent className="h-3.5 w-3.5" />
                        {t.rate}%
                        {t.rate === 0 && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold ml-1">Miễn cọc</span>}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{t.maxLimits}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">Top {t.priorityScore}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(t)}
                        className="h-7 px-2.5 text-xs text-primary-600 hover:bg-primary-50 border-slate-200 font-bold"
                      >
                        <Edit2 className="h-3 w-3 mr-1" /> Chỉnh sửa
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: EDIT TIER */}
      {editingTier && (
        <Modal
          open={!!editingTier}
          onOpenChange={(open) => !open && setEditingTier(null)}
          title={`Điều chỉnh biểu phí hạng: ${editingTier.id} - ${editingTier.name}`}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-800 block">Nhóm phân loại: {editingTier.type}</span>
              <span className="text-slate-500 block mt-0.5">
                {editingTier.type === 'CUSTOMER' ? 'Cấu hình tỷ lệ % cọc tài sản tính tự động ở Checkout' : 'Cấu hình chiết khấu doanh thu sàn khi tất toán'}
              </span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                {editingTier.type === 'CUSTOMER' ? 'Tỷ lệ tiền cọc (% Giá trị thiết bị) *' : 'Tỷ lệ hoa hồng sàn (%) *'}
              </Label>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.5}
                required
                value={editRate}
                onChange={(e) => setEditRate(Number(e.target.value))}
                className="text-xs font-bold"
              />
              <p className="text-[10px] text-slate-400">
                {editingTier.type === 'CUSTOMER' ? 'Ví dụ: 40 (40%), 0 (Miễn cọc 100%)' : 'Ví dụ: 15 (15%), 10 (10%), 2 (2%)'}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Mô tả hạn mức hệ thống</Label>
              <Input
                value={editLimits}
                onChange={(e) => setEditLimits(e.target.value)}
                placeholder="VD: Không giới hạn / Tối đa 20 SP"
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setEditingTier(null)} className="text-xs">
                Hủy
              </Button>
              <Button type="submit" disabled={isSaving} className="text-xs font-bold bg-primary-600 hover:bg-primary-700">
                {isSaving ? 'Đang lưu...' : 'Lưu biểu phí'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
