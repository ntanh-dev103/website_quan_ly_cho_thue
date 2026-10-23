import { useState, useEffect } from 'react';
import { TrendingUp, Package, ShieldCheck, Percent } from 'lucide-react';
import { MetricsCard } from '@/features/analytics/MetricsCard';
import { RevenueChart } from '@/features/analytics/RevenueChart';
import { formatCurrency } from '@/shared/lib/utils';
import { useContractStore } from '@/entities/contract/useContractStore';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { merchantApi, type MerchantRevenueStatsDto } from '@/api/merchant.api';
import { CommissionRateCard } from '@/features/merchant/CommissionRateCard';

export function MerchantDashboard() {
  const { contracts } = useContractStore();
  const { tier, merchantTier } = useAuthStore();
  const activeTier = tier.startsWith('M') ? tier : merchantTier;

  const [stats, setStats] = useState<MerchantRevenueStatsDto>({
    grossRevenue: 45000000,
    platformCommission: 6750000,
    netRevenue: 38250000,
    activeRentalsCount: 12,
    totalItemsCount: 35,
    availableItemsCount: 20,
    maintenanceItemsCount: 3,
    occupancyRate: 34.3,
    merchantTier: activeTier || 'M1',
    commissionRate: activeTier === 'M2' ? 0.10 : 0.15,
    productCount: 14,
    productLimit: activeTier === 'M2' ? -1 : 20,
  });

  useEffect(() => {
    merchantApi.getStats().then((data) => {
      if (data) {
        setStats(data);
      }
    });
  }, [activeTier]);

  const rentingCount = stats.activeRentalsCount || contracts.filter(c => c.status === 'RENTING').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Kênh Quản Trị Đối Tác (Merchant Portal)</h1>
          <p className="text-gray-500 text-sm mt-0.5">Báo cáo doanh thu, hoa hồng sàn và quản trị thiết bị kho</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard 
          title="Doanh thu thực nhận (Net)" 
          value={formatCurrency(stats.netRevenue)} 
          icon={TrendingUp} 
          trend={{ value: 14.8, isPositive: true }}
          colorClass="text-emerald-600 bg-emerald-50"
        />
        <MetricsCard 
          title="Phí sàn khấu trừ" 
          value={formatCurrency(stats.platformCommission)} 
          icon={Percent} 
          trend={{ value: (stats.commissionRate * 100), isPositive: false }}
          colorClass="text-rose-600 bg-rose-50"
        />
        <MetricsCard 
          title="Thiết bị đang cho thuê" 
          value={`${rentingCount} / ${stats.totalItemsCount || 35}`} 
          icon={Package} 
          colorClass="text-blue-600 bg-blue-50"
        />
        <MetricsCard 
          title="Tỷ lệ lấp đầy kho" 
          value={`${stats.occupancyRate || 34.3}%`} 
          icon={ShieldCheck} 
          colorClass="text-indigo-600 bg-indigo-50"
        />
      </div>

      {/* Tier & Commission Rate Card */}
      <CommissionRateCard 
        currentTier={stats.merchantTier} 
        commissionRate={stats.commissionRate}
        onUpgrade={() => {
          merchantApi.getStats().then((data) => {
            if (data) setStats(data);
          });
        }}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Recent Contracts Sidebar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Hợp đồng thuê gần đây</h2>
          <div className="space-y-4">
            {contracts.slice(0, 5).map(contract => (
              <div key={contract.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                <img src={contract.product.images[0]} alt="" className="w-12 h-12 rounded-md object-cover bg-gray-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{contract.product.name}</p>
                  <p className="text-xs text-gray-500 font-mono">Mã: {contract.contractCode}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    contract.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    contract.status === 'RENTING' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {contract.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
