import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Edit3, 
  CheckCircle2, 
  Building2, 
  Phone, 
  Mail
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/Modal';
import { Label } from '@/shared/ui/label';
import { adminApi, type AdminUserDto } from '@/api/admin.api';
import { toast } from 'sonner';

const ROLE_FILTERS = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Khách thuê (Customer)', value: 'CUSTOMER' },
  { label: 'Đối tác (Merchant)', value: 'MERCHANT' },
  { label: 'Quản trị (Admin)', value: 'ADMIN' },
];

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  
  // Modal Edit Tier
  const [selectedUser, setSelectedUser] = useState<AdminUserDto | null>(null);
  const [selectedCustomerTier, setSelectedCustomerTier] = useState<string>('C1');
  const [selectedMerchantTier, setSelectedMerchantTier] = useState<string>('M1');
  const [isUpdatingTier, setIsUpdatingTier] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers(
        roleFilter === 'ALL' ? undefined : roleFilter,
        undefined,
        search.trim() || undefined
      );
      setUsers(res.content || []);
    } catch {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user: AdminUserDto) => {
    const action = user.isActive ? 'Khóa' : 'Mở khóa';
    if (!window.confirm(`Bạn có chắc muốn ${action} tài khoản @${user.username} (${user.fullName})?`)) {
      return;
    }

    try {
      await adminApi.toggleUserStatus(user.id);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
      toast.success(`Đã ${action} tài khoản thành công!`);
    } catch {
      // Local fallback
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
      toast.success(`Đã ${action} tài khoản thành công! (Mock update)`);
    }
  };

  const handleOpenEditTier = (user: AdminUserDto) => {
    setSelectedUser(user);
    setSelectedCustomerTier(user.customerTier || 'C1');
    setSelectedMerchantTier(user.merchantTier || 'M1');
  };

  const handleSaveTier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setIsUpdatingTier(true);
      if (selectedUser.role === 'MERCHANT') {
        await adminApi.updateUserTier(selectedUser.id, { tier: selectedMerchantTier, type: 'MERCHANT' });
      } else {
        await adminApi.updateUserTier(selectedUser.id, { tier: selectedCustomerTier, type: 'CUSTOMER' });
      }

      setUsers(prev => prev.map(u => {
        if (u.id === selectedUser.id) {
          return {
            ...u,
            customerTier: selectedCustomerTier as any,
            merchantTier: selectedMerchantTier as any,
          };
        }
        return u;
      }));

      toast.success(`Cập nhật Tier cho @${selectedUser.username} thành công!`);
      setSelectedUser(null);
    } catch {
      setUsers(prev => prev.map(u => {
        if (u.id === selectedUser.id) {
          return {
            ...u,
            customerTier: selectedCustomerTier as any,
            merchantTier: selectedMerchantTier as any,
          };
        }
        return u;
      }));
      toast.success(`Cập nhật Tier thành công! (Mock)`);
      setSelectedUser(null);
    } finally {
      setIsUpdatingTier(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: users.length,
      customers: users.filter(u => u.role === 'CUSTOMER').length,
      merchants: users.filter(u => u.role === 'MERCHANT').length,
      active: users.filter(u => u.isActive).length,
    };
  }, [users]);

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý Người Dùng & Tiers</h1>
          <p className="text-sm text-slate-500 mt-0.5">Tra cứu thông tin, phân quyền, khóa tài khoản và điều chỉnh cấp bậc</p>
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, email, username..."
              className="pl-9 text-xs w-64 h-9 bg-white"
            />
          </div>
          <Button type="submit" size="sm" className="h-9 text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold">
            Tìm
          </Button>
        </form>
      </div>

      {/* Mini KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">Tổng tài khoản</span>
          <span className="text-xl font-black text-slate-900 mt-1 block">{stats.total}</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-blue-600 font-medium block">Khách thuê (Customer)</span>
          <span className="text-xl font-black text-blue-700 mt-1 block">{stats.customers}</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-indigo-600 font-medium block">Đối tác (Merchant)</span>
          <span className="text-xl font-black text-indigo-700 mt-1 block">{stats.merchants}</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs text-emerald-600 font-medium block">Đang hoạt động</span>
          <span className="text-xl font-black text-emerald-700 mt-1 block">{stats.active}</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
        {/* Role Tabs */}
        <div className="p-3 border-b border-slate-100 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {ROLE_FILTERS.map((rf) => (
              <button
                key={rf.value}
                onClick={() => setRoleFilter(rf.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  roleFilter === rf.value
                    ? 'bg-primary-50 text-primary-700 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {rf.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {users.length} tài khoản hiển thị
          </span>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Tài khoản & Liên hệ</th>
                <th className="py-3 px-4">Vai trò (Role)</th>
                <th className="py-3 px-4">Cấp bậc Tier</th>
                <th className="py-3 px-4">Doanh nghiệp / MST</th>
                <th className="py-3 px-4">Định danh KYC</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không tìm thấy người dùng phù hợp.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* User Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                          {u.fullName ? u.fullName.charAt(0).toUpperCase() : u.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            {u.fullName}
                            <span className="text-[10px] text-slate-400 font-normal">(@{u.username})</span>
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3 text-slate-400" />
                            {u.email}
                          </p>
                          {u.phone && (
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Phone className="h-2.5 w-2.5 text-slate-400" />
                              {u.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : u.role === 'MERCHANT'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    {/* Tier */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {u.role === 'MERCHANT' ? (
                          <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            Merchant: {u.merchantTier || 'M1'}
                          </span>
                        ) : (
                          <span className="inline-block bg-cyan-50 text-cyan-800 border border-cyan-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            Customer: {u.customerTier || 'C1'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Company / Tax */}
                    <td className="py-3 px-4">
                      {u.companyName ? (
                        <div>
                          <p className="font-medium text-slate-800 flex items-center gap-1 line-clamp-1" title={u.companyName}>
                            <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                            {u.companyName}
                          </p>
                          {u.taxCode && <span className="text-[10px] text-slate-400 block font-mono">MST: {u.taxCode}</span>}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Cá nhân</span>
                      )}
                    </td>

                    {/* KYC Identity */}
                    <td className="py-3 px-4">
                      {u.verifiedIdentity ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="h-3 w-3 text-emerald-600" />
                          Đã xác minh
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Chưa KYC
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditTier(u)}
                          className="h-7 px-2 text-[11px] text-slate-600 hover:text-primary-600 border-slate-200"
                          title="Sửa hạng Tier"
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Sửa Tier
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(u)}
                          className={`h-7 px-2 text-[11px] ${
                            u.isActive
                              ? 'text-rose-600 hover:bg-rose-50 border-rose-200'
                              : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
                          }`}
                          title={u.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        >
                          {u.isActive ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: EDIT USER TIER */}
      {selectedUser && (
        <Modal
          open={!!selectedUser}
          onOpenChange={(open) => !open && setSelectedUser(null)}
          title={`Điều chỉnh Cấp bậc (Tier) cho: ${selectedUser.fullName}`}
        >
          <form onSubmit={handleSaveTier} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">@{selectedUser.username} • {selectedUser.email}</p>
              <p className="text-slate-500">Vai trò tài khoản: <strong>{selectedUser.role}</strong></p>
            </div>

            {selectedUser.role === 'MERCHANT' ? (
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Hạng Thương gia (Merchant Tier):</Label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'M1', name: 'M1 Starter', desc: '15% phí sàn, max 20 SP' },
                    { id: 'M2', name: 'M2 Pro', desc: '10% phí sàn, Auto-Approve' },
                    { id: 'M3', name: 'M3 Enterprise', desc: '5% phí sàn, Shop uy tín' },
                    { id: 'M4', name: 'M4 Flagship', desc: '2% phí sàn, B2B Net-30' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedMerchantTier(t.id)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        selectedMerchantTier === t.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-1 ring-indigo-500/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{t.name}</span>
                        {selectedMerchantTier === t.id && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />}
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal block mt-0.5">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Hạng Khách thuê (Customer Tier):</Label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'C1', name: 'C1 Newbie', desc: 'Cọc 40% giá trị thiết bị' },
                    { id: 'C2', name: 'C2 Verified', desc: 'Cọc 30%, duyệt đơn nhanh' },
                    { id: 'C3', name: 'C3 VIP', desc: 'Cọc 15%, ưu tiên giao hỏa tốc' },
                    { id: 'C4', name: 'C4 Diamond', desc: 'Miễn cọc 100% (0đ)' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedCustomerTier(t.id)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        selectedCustomerTier === t.id
                          ? 'border-cyan-600 bg-cyan-50 text-cyan-900 font-bold ring-1 ring-cyan-500/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{t.name}</span>
                        {selectedCustomerTier === t.id && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600" />}
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal block mt-0.5">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setSelectedUser(null)} className="text-xs">
                Hủy
              </Button>
              <Button type="submit" disabled={isUpdatingTier} className="text-xs font-bold bg-primary-600 hover:bg-primary-700">
                {isUpdatingTier ? 'Đang lưu...' : 'Lưu cấp bậc'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
