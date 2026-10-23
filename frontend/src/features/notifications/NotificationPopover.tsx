import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Bell, 
  CheckCheck, 
  FileCheck, 
  Truck, 
  Gift, 
  ShieldCheck, 
  ChevronRight, 
  Clock, 
  Inbox,
  Trash2,
  type LucideIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Icon lookup map — icons are resolved at render time, never serialized.
const ICON_MAP: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  contract:  { icon: FileCheck,  color: 'text-emerald-600', bg: 'bg-emerald-50' },
  delivery:  { icon: Truck,      color: 'text-blue-600',    bg: 'bg-blue-50' },
  promotion: { icon: Gift,       color: 'text-amber-600',   bg: 'bg-amber-50' },
  system:    { icon: ShieldCheck, color: 'text-purple-600',  bg: 'bg-purple-50' },
};

// Serializable notification data — NO React components stored here.
interface NotificationData {
  id: string;
  type: 'contract' | 'delivery' | 'promotion' | 'system';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationData[] = [
  {
    id: 'notif-1',
    type: 'contract',
    title: 'Hợp đồng thuê #HD-8921 đã được duyệt',
    description: 'Đối tác Cinematic Gear Studio đã xác nhận đơn thuê Sony Alpha A7 IV. Thiết bị sẽ sẵn sàng bàn giao ngày mai.',
    timestamp: '5 phút trước',
    isRead: false,
    link: '/account',
  },
  {
    id: 'notif-2',
    type: 'delivery',
    title: 'Lịch bàn giao VinFast VF8 Plus',
    description: 'Tài xế giao nhận sẽ liên hệ trước 30 phút tại điểm hẹn Quận 1 lúc 08:30 sáng mai. Vui lòng chuẩn bị CCCD đối soát.',
    timestamp: '2 giờ trước',
    isRead: false,
    link: '/account',
  },
  {
    id: 'notif-3',
    type: 'promotion',
    title: 'Voucher ưu đãi 50.000đ dành cho bạn',
    description: 'Nhận ngay mã RENTHUB50K nhân dịp nâng cấp hạng thành viên. Áp dụng cho mọi đồ thuê công nghệ & phương tiện.',
    timestamp: 'Hôm qua',
    isRead: false,
    link: '/catalog',
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Hoàn trả tiền cọc 15.000.000đ thành công',
    description: 'Hợp đồng #HD-7712 đã nghiệm thu không hư hại. Số tiền cọc bảo chứng đã được hoàn về tài khoản của bạn.',
    timestamp: '3 ngày trước',
    isRead: true,
    link: '/account',
  },
];

const STORAGE_KEY = 'renthub_notifications_v2';

function loadNotifications(): NotificationData[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_NOTIFICATIONS;
    const parsed = JSON.parse(saved);
    // Validate that parsed data is a valid array of notifications
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_NOTIFICATIONS;
    // Validate first item has required fields
    if (!parsed[0].id || !parsed[0].type || !parsed[0].title) return INITIAL_NOTIFICATIONS;
    return parsed as NotificationData[];
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function NotificationPopover() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>(loadNotifications);
  const [filterType, setFilterType] = useState<'all' | 'contract' | 'promotion'>('all');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage (only serializable data, no component refs)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Also clean up old broken key from previous version
  useEffect(() => {
    try {
      localStorage.removeItem('renthub_notifications');
    } catch {
      // ignore
    }
  }, []);

  // Click outside and Esc handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (filterType === 'all') return notifications;
    if (filterType === 'contract') {
      return notifications.filter((n) => n.type === 'contract' || n.type === 'delivery');
    }
    if (filterType === 'promotion') {
      return notifications.filter((n) => n.type === 'promotion' || n.type === 'system');
    }
    return notifications;
  }, [notifications, filterType]);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
  };

  const handleItemClick = (notif: NotificationData) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.info('Đã xóa tất cả thông báo');
  };

  return (
    <div ref={popoverRef} className="relative inline-block">
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all cursor-pointer ${
          isOpen
            ? 'bg-primary-50 text-primary-600 ring-2 ring-primary-100 shadow-2xs'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
        aria-label="Thông báo hệ thống"
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5" />
        
        {/* Dynamic Unread Red Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-extrabold ring-2 ring-white animate-scale-in">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-[350px] sm:w-[410px] max-w-[calc(100vw-24px)] bg-white rounded-2xl border border-gray-200/90 shadow-2xl shadow-gray-900/15 overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">
                Thông báo
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                  {unreadCount} chưa đọc
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  title="Đánh dấu tất cả đã đọc"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Đọc tất cả</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="p-1 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Xóa danh sách thông báo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 bg-gray-50/70 border-b border-gray-100 text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('contract')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterType === 'contract'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Hợp đồng & Đơn thuê
            </button>
            <button
              type="button"
              onClick={() => setFilterType('promotion')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterType === 'promotion'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Ưu đãi
            </button>
          </div>

          {/* Notification Items List */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-100">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-2">
                  <Inbox className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-gray-700">Không có thông báo nào</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Bạn đã cập nhật đầy đủ mọi thông tin thuê đồ!
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                // Resolve icon at render time from the lookup map
                const meta = ICON_MAP[notif.type] || ICON_MAP.system;
                const IconComponent = meta.icon;

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleItemClick(notif)}
                    className={`p-3 sm:p-3.5 flex items-start gap-3 transition-colors cursor-pointer relative group ${
                      notif.isRead 
                        ? 'bg-white hover:bg-gray-50/80 text-gray-700' 
                        : 'bg-primary-50/30 hover:bg-primary-50/60 text-gray-900'
                    }`}
                  >
                    {/* Icon Badge */}
                    <div className={`h-8 w-8 rounded-xl ${meta.bg} ${meta.color} flex items-center justify-center shrink-0 mt-0.5`}>
                      <IconComponent className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-1.5">
                        <h4 className={`text-xs leading-snug line-clamp-1 ${
                          notif.isRead ? 'font-semibold text-gray-800' : 'font-bold text-gray-900'
                        }`}>
                          {notif.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{notif.timestamp}</span>
                      </div>
                    </div>

                    {/* Unread Dot & Arrow */}
                    <div className="shrink-0 flex items-center gap-1 self-center">
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary-600" />
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs px-4">
            <span className="text-[11px] text-gray-400">Thông báo tự động từ RentHub</span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate('/account');
              }}
              className="text-primary-600 hover:text-primary-700 font-semibold text-[11px] hover:underline cursor-pointer"
            >
              Vào Trung tâm điều khiển →
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
