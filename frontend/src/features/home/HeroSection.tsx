import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { TierBadge } from '@/shared/ui/TierBadge';
import { useAuthStore } from '@/entities/user/useAuthStore';

export function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated, role, tier, user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-black/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col items-center text-center">
        {isAuthenticated && user && (
          <div className="flex items-center gap-3 mb-8 animate-slide-up bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
            <span className="text-white/90 text-sm">Xin chào, <strong className="text-white">{user.name}</strong></span>
            <TierBadge role={role} tier={tier} size="sm" showLabel={false} />
          </div>
        )}

        <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-4xl">
          Thuê mọi thứ bạn cần,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-200 to-accent-400">
            nhanh chóng và an toàn.
          </span>
        </h1>
        <p className="text-lg text-white/80 mb-10 max-w-2xl leading-relaxed">
          Hàng ngàn sản phẩm từ thiết bị công nghệ, phương tiện di chuyển đến thời trang cao cấp. Tiết kiệm chi phí, bảo vệ môi trường.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl relative animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-xl focus-within:ring-4 focus-within:ring-white/20 transition-all">
            <Search className="absolute left-6 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Bạn muốn thuê gì hôm nay?"
              className="w-full h-14 pl-14 pr-32 border-0 bg-transparent text-gray-900 text-lg shadow-none focus-visible:ring-0 placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="lg" className="absolute right-2 h-12 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA]">
              Tìm kiếm
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
