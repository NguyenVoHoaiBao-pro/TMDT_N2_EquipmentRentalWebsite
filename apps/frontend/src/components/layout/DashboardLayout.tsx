// @/components/layout/DashboardLayout.tsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore.ts';

export function DashboardLayout() {
  const { user, logoutSuccess } = useAuthStore();
  const location = useLocation();

  // Đảm bảo lấy đúng mảng roles
  const userRoles = Array.isArray(user?.roles) ? user.roles : [user?.roles || 'GUEST'];
  const isAdmin = userRoles.includes('ADMIN');

  // Khai báo menu động dựa trên vai trò của User
  const menuItems = isAdmin
    ? [
      { path: '/admin/users', label: 'Quản lý Người dùng', icon: '👤' },
      { path: '/admin/devices', label: 'Quản lý Thiết bị', icon: '💻' },
      { path: '/admin/transactions', label: 'Giao dịch', icon: '💰' },
      { path: '/incidents', label: 'Sự cố', icon: '⚠️' },
      { path: '/profile', label: 'Trang cá nhân', icon: '⚙️' },
    ]
    : [
      { path: '/dashboard', label: 'Tổng quan', icon: '📊' },
      { path: '/dashboard/inventory', label: 'Kho thiết bị', icon: '📦' },
      { path: '/dashboard/orders', label: 'Đơn đặt hàng', icon: '📋' },
      { path: '/dashboard/calendar', label: 'Lịch cho thuê', icon: '📅' },
      { path: '/dashboard/incidents', label: 'Báo cáo sự cố', icon: '⚠️' },
      { path: '/register-device', label: 'Đăng ký thiết bị', icon: '➕' },
      { path: '/invoices', label: 'Hóa đơn', icon: '🧾' },
      { path: '/profile', label: 'Trang cá nhân', icon: '⚙️' },
    ];

  const handleLogout = () => {
    logoutSuccess();
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* 1. Thanh Sidebar bên trái */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0">
        <div>
          {/* Logo hoặc Tên Phân Hệ */}
          <div className="p-5 text-xl font-bold border-b border-slate-800 tracking-wider flex items-center space-x-2">
            <span>🛡️</span>
            <span>{isAdmin ? 'ADMIN PANEL' : 'OWNER HUB'}</span>
          </div>

          {/* Danh sách Menu Items */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Khu vực Footer của Sidebar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div
              className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold truncate">{user?.username || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{isAdmin ? 'Quản trị viên' : 'Chủ thiết bị'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <span>🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* 2. Khu vực Nội dung hiển thị bên phải */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Thanh Header phụ phía trên */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-lg font-semibold text-gray-800">
            {menuItems.find((item) => item.path === location.pathname)?.label || 'Bảng điều khiển'}
          </h1>
          <Link to="/home" className="text-sm text-blue-600 hover:underline flex items-center space-x-1">
            <span>🏠</span> <span>Quay lại Trang chủ</span>
          </Link>
        </header>

        {/* Vùng chứa Content chính của từng trang */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
