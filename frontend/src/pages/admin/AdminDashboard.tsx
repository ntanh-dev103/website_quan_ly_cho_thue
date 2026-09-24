import { Users, Package, FileText, ShieldCheck, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { TierBadge } from '@/shared/ui/TierBadge';
import { useAuthStore } from '@/entities/user/useAuthStore';

const PENDING_MERCHANTS = [
  { id: '1', name: 'Công ty TNHH Thiết Bị Số Sài Gòn', email: 'saigontech@rent.vn', tier: 'Đối tác B2B', time: '10 phút trước', status: 'Chờ duyệt GPKD' },
  { id: '2', name: 'Camera Pro Studio - Minh Quân', email: 'quan.camera@gmail.com', tier: 'Đối tác Cá nhân', time: '45 phút trước', status: 'Chờ xác thực CCCD' },
  { id: '3', name: 'Hà Nội Drone & Event Gear', email: 'contact@hanoigear.vn', tier: 'Đối tác B2B', time: '2 giờ trước', status: 'Chờ duyệt GPKD' },
];

const SECTOR_DISTRIBUTION = [
  { name: 'Thiết bị công nghệ', count: '412 thiết bị', pct: '48%', color: 'bg-[#06B6D4]' },
  { name: 'Phương tiện di chuyển', count: '286 xe', pct: '33%', color: 'bg-[#2563EB]' },
  { name: 'Thời trang & Sự kiện', count: '158 bộ', pct: '19%', color: 'bg-[#8B5CF6]' },
];

export function AdminDashboard() {
  const { role, tier, user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Quản trị hệ thống</h1>
            <TierBadge role={role} tier={tier} />
          </div>
          <p className="text-sm text-slate-500">
            Xin chào, <strong>{user?.name || 'Administrator'}</strong>! Tổng quan hoạt động toàn sàn RentalShop.
          </p>
        </div>

        <Link to="/admin/merchants">
          <Button className="bg-[#0284C7] hover:bg-[#0369a1] text-white font-bold rounded-xl shadow-sm">
            <span>Duyệt đối tác ({PENDING_MERCHANTS.length})</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Người dùng toàn sàn', value: '1,234', color: 'text-[#0284C7] bg-cyan-50' },
          { icon: Package, label: 'Tổng thiết bị niêm yết', value: '856', color: 'text-emerald-700 bg-emerald-50' },
          { icon: FileText, label: 'Hợp đồng đang chạy', value: '342', color: 'text-amber-700 bg-amber-50' },
          { icon: ShieldCheck, label: 'Hồ sơ chờ phê duyệt', value: '18', color: 'text-rose-700 bg-rose-50' },
        ].map((stat) => (
          <Card key={stat.label} className="border-slate-200 shadow-sm rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 2-Column Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Partner Approvals (Span 2) */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Hồ sơ đối tác mới đăng ký</h2>
              <p className="text-xs text-slate-500">Các hồ sơ đối tác B2B và Cá nhân cần kiểm định hồ sơ năng lực</p>
            </div>
            <Link to="/admin/merchants" className="text-xs font-bold text-[#0284C7] hover:underline">
              Xem tất cả
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {PENDING_MERCHANTS.map((m) => (
              <div key={m.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{m.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {m.tier}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{m.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/70">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{m.status}</span>
                  </div>
                  <Link to="/admin/merchants">
                    <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-lg border-slate-200">
                      Xét duyệt
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Distribution & Platform Health */}
        <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Cơ cấu ngành hàng</h2>
            <p className="text-xs text-slate-500 mb-6">Tỷ lệ thiết bị đang hoạt động trên hệ sinh thái</p>

            <div className="space-y-4">
              {SECTOR_DISTRIBUTION.map((sec) => (
                <div key={sec.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{sec.name}</span>
                    <span className="font-bold text-slate-900">{sec.pct} ({sec.count})</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${sec.color}`} style={{ width: sec.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200/60">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Hệ thống bảo hiểm & hợp đồng số hoạt động 100% ổn định</span>
          </div>
        </div>
      </div>
    </div>
  );
}
