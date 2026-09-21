import { TrendingUp, Package, Clock, ShieldAlert } from 'lucide-react';
import { MetricsCard } from '@/features/analytics/MetricsCard';
import { RevenueChart } from '@/features/analytics/RevenueChart';
import { formatCurrency } from '@/shared/lib/utils';
import { useContractStore } from '@/entities/contract/useContractStore';

export function MerchantDashboard() {
  const { contracts } = useContractStore();
  const pendingCount = contracts.filter(c => c.status === 'PENDING').length;
  const rentingCount = contracts.filter(c => c.status === 'RENTING').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard 
          title="Doanh thu tháng" 
          value={formatCurrency(45000000)} 
          icon={TrendingUp} 
          trend={{ value: 12.5, isPositive: true }}
          colorClass="text-primary-600 bg-primary-50"
        />
        <MetricsCard 
          title="Đang cho thuê" 
          value={rentingCount} 
          icon={Package} 
          colorClass="text-secondary-600 bg-secondary-50"
        />
        <MetricsCard 
          title="Chờ xác nhận" 
          value={pendingCount} 
          icon={Clock} 
          trend={{ value: 2, isPositive: false }}
          colorClass="text-accent-600 bg-accent-50"
        />
        <MetricsCard 
          title="Sức khỏe kho" 
          value="98%" 
          icon={ShieldAlert} 
          colorClass="text-green-600 bg-green-50"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Recent Contracts Sidebar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Hoạt động gần đây</h2>
          <div className="space-y-4">
            {contracts.slice(0, 5).map(contract => (
              <div key={contract.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                <img src={contract.product.images[0]} alt="" className="w-12 h-12 rounded-md object-cover bg-gray-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{contract.product.name}</p>
                  <p className="text-xs text-gray-500">Mã: {contract.contractCode}</p>
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
