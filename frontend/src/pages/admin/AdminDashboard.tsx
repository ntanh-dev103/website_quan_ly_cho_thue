import { Users, Package, FileText, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { TierBadge } from '@/shared/ui/TierBadge';
import { useAuthStore } from '@/entities/user/useAuthStore';

export function AdminDashboard() {
  const { role, tier, user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-gray-900">Quản trị hệ thống</h1>
            <TierBadge role={role} tier={tier} />
          </div>
          <p className="text-gray-500">
            Xin chào, <strong>{user?.name}</strong>!
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: 'Người dùng', value: '1,234', color: 'text-primary-600 bg-primary-50' },
          { icon: Package, label: 'Sản phẩm', value: '856', color: 'text-secondary-600 bg-secondary-50' },
          { icon: FileText, label: 'Hợp đồng', value: '342', color: 'text-accent-600 bg-accent-50' },
          { icon: ShieldCheck, label: 'Đang xét duyệt', value: '18', color: 'text-destructive-600 bg-destructive-50' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Tổng quan hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">Nội dung quản trị đang được phát triển. Hãy quay lại sau!</p>
        </CardContent>
      </Card>
    </div>
  );
}
