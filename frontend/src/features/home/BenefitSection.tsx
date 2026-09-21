import { Sparkles, Shield, Clock } from 'lucide-react';

export function BenefitSection() {
  const features = [
    { icon: Sparkles, title: 'Ưu đãi hạng thành viên', desc: 'Giảm cọc lên đến 100% cho hạng Kim cương.', color: 'text-primary-600 bg-white' },
    { icon: Shield, title: 'Giao dịch an toàn', desc: 'Bảo vệ người thuê và người cho thuê tuyệt đối.', color: 'text-secondary-600 bg-white' },
    { icon: Clock, title: 'Linh hoạt thời gian', desc: 'Thuê theo giờ, ngày hoặc tháng dễ dàng.', color: 'text-accent-600 bg-white' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 -mt-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div key={idx} className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/40 border border-gray-100 flex items-start gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 ${feature.color}`}>
              <feature.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
