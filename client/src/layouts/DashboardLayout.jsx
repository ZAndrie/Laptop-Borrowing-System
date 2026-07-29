import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LayoutDashboard, Laptop, Users, RefreshCcw, FileText, Settings, Menu, Shield } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Laptops', icon: Laptop, path: '/dashboard/laptops' },
    { name: 'Transactions', icon: RefreshCcw, path: '/dashboard/transactions' },
    { name: 'Reports', icon: FileText, path: '/dashboard/reports', role: 'LIBRARIAN' },
    { name: 'Staff Management', icon: Shield, path: '/dashboard/staff', role: 'LIBRARIAN' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col bg-red-900 text-white transition-all duration-300`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-red-950">
          {isSidebarOpen && <span className="text-lg font-bold truncate">LBMS Panel</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-red-950 text-red-100 hover:text-white">
            <Menu size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            if (item.role && user?.role !== item.role) return null;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center p-3 rounded-lg hover:bg-red-800 transition-colors text-red-50 hover:text-white"
              >
                <item.icon size={20} />
                {isSidebarOpen && <span className="ml-3 text-sm font-medium">{item.name}</span>}
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-red-950">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-white text-red-900 flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.firstName?.[0]}
            </div>
            {isSidebarOpen && (
              <div className="ml-3 truncate">
                <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-red-200">{user?.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg hover:bg-red-950 text-red-200 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center px-8 border-b border-slate-200 space-x-3">
          <img src="/logo.png" alt="LIRC Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-xl font-semibold text-slate-800">LIRC Laptop Borrowing Management System</h1>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
