import { useState, useEffect } from 'react';
import { Settings, Zap } from 'lucide-react';
import { useAuthStore } from '@/entities/user/useAuthStore';

export function DemoWidget() {
  const { role, tier, login, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  // Add event listener for Escape key to close the widget
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRoleChange = async (newRole: any, newTier: any) => {
    if (newRole === 'GUEST') {
      logout();
      return;
    }
    let email = 'customer@demo.com';
    if (newRole === 'ADMIN') email = 'admin@demo.com';
    else if (newTier === 'M1') email = 'merchant1@demo.com';
    else if (newTier === 'M2') email = 'merchant@demo.com';
    else if (newTier === 'M3') email = 'merchant3@demo.com';
    else if (newTier === 'M4') email = 'merchant4@demo.com';
    else if (newTier === 'C2') email = 'silver@demo.com';
    else if (newTier === 'C3') email = 'gold@demo.com';
    else if (newTier === 'C4') email = 'vip@demo.com';
    
    await login(email, 'password');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-2xl p-5 w-80 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary-100 p-1.5 rounded-lg">
              <Zap className="w-4 h-4 text-primary-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm">Demo Controller</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Customer Tiers</label>
              <div className="grid grid-cols-4 gap-2">
                {['C1', 'C2', 'C3', 'C4'].map(t => (
                  <button
                    key={t}
                    onClick={() => handleRoleChange('CUSTOMER', t)}
                    className={`text-xs font-medium py-1.5 rounded-lg border transition-all ${
                      role === 'CUSTOMER' && tier === t 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Merchant Tiers</label>
              <div className="grid grid-cols-4 gap-2">
                {['M1', 'M2', 'M3', 'M4'].map(t => (
                  <button
                    key={t}
                    onClick={() => handleRoleChange('MERCHANT', t)}
                    className={`text-xs font-medium py-1.5 rounded-lg border transition-all ${
                      role === 'MERCHANT' && tier === t 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/20' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleRoleChange('GUEST', 'G1')}
                className={`text-xs font-medium py-2 rounded-lg border transition-all ${
                  role === 'GUEST'
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Guest
              </button>
              <button
                onClick={() => handleRoleChange('ADMIN', 'A1')}
                className={`text-xs font-medium py-2 rounded-lg border transition-all ${
                  role === 'ADMIN'
                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-500/20'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 bg-gray-900 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all"
        title="Bật/tắt Demo Controller"
      >
        <Settings className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
    </div>
  );
}
