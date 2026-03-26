import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Activity, Scan, Users, TrendingUp, User, LayoutDashboard, Bell, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { LanguageSelector } from "./LanguageSelector";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { profile, signOut, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: t.nav.dashboard, end: true },
    { to: "/scanner", icon: Scan, label: t.nav.scanner },
    { to: "/community", icon: Users, label: t.nav.community },
    { to: "/progress", icon: TrendingUp, label: t.nav.protocol120 },
    { to: "/profile", icon: User, label: t.nav.profile },
  ];

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">

      {/* Sidebar Desktop - Slim icon-only */}
      <aside className="hidden md:flex md:flex-col w-20 bg-white border-r border-gray-100">

        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-gray-100">
          <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#D4FF00]"></div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center py-8 gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group relative w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? "bg-[#1a1a1a] text-white"
                    : "text-gray-400 hover:bg-gray-50 hover:text-[#1a1a1a]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-5 h-5" />
                  {isActive && (
                    <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#D4FF00] rounded-r-full"></div>
                  )}
                  {/* Tooltip on hover */}
                  <div className="absolute left-full ml-4 px-3 py-2 bg-[#1a1a1a] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-2 py-6 border-t border-gray-100">
          <div className="w-12 h-12 flex items-center justify-center">
            <LanguageSelector />
          </div>

          <button className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-[#1a1a1a] transition-all relative">
            <Bell className="w-5 h-5" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#D4FF00] rounded-full"></div>
          </button>

          {!isDemoMode && (
            <button
              onClick={handleLogout}
              className="group relative w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <div className="absolute left-full ml-4 px-3 py-2 bg-[#1a1a1a] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                Logout
              </div>
            </button>
          )}

          <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 text-lg">
            👤
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4FF00]"></div>
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#1a1a1a]">Life Balance</h1>
              <p className="text-[10px] text-gray-400">Wellness Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#D4FF00] rounded-full"></div>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40">
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#1a1a1a] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-[#D4FF00]"></div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-lg">
                  👤
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{profile?.display_name || t.user.name}</p>
                  <p className="text-xs text-gray-400">{t.user.title}</p>
                </div>
              </div>
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
