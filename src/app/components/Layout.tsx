import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { ZenoFloatingButton } from "./zeno/ZenoFloatingButton";
import { Activity, Scan, Users, TrendingUp, User, LayoutDashboard, Bell, Menu, X, LogOut, Dumbbell, ClipboardCheck, GraduationCap, Users2, FlaskConical, Shield, Brain, Heart, Moon, Sparkles } from "lucide-react";
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

  // Sidebar simplificada: 5 hubs principais. ZENO é botão flutuante global. Profile vai no avatar bottom.
  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Hoje", end: true },
    { to: "/body", icon: Activity, label: "Body" },
    { to: "/mind", icon: Brain, label: "Mind" },
    { to: "/spirit", icon: Heart, label: "Spirit" },
    { to: "/grow", icon: Sparkles, label: "Grow" },
  ];

  return (
    <div className="flex h-screen bg-violet-50 overflow-hidden">

      {/* Sidebar Desktop - Slim icon-only */}
      <aside className="hidden md:flex md:flex-col w-20 bg-white border-r border-gray-100">

        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-gray-100">
          <div className="w-12 h-12 bg-violet-500 rounded-2xl flex items-center justify-center">
            <img src="/logo-m7-white.png" alt="M7 Life Balance" className="w-8 h-8 object-contain" />
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
                    ? "bg-violet-500 text-white"
                    : "text-gray-400 hover:bg-gray-50 hover:text-violet-950"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-5 h-5" />
                  {isActive && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-gray-300 rounded-full"></div>
                  )}
                  {/* Tooltip on hover */}
                  <div className="absolute left-full ml-4 px-3 py-2 bg-violet-500 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
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

          <button className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-violet-950 transition-all relative">
            <Bell className="w-5 h-5" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-violet-500 rounded-full"></div>
          </button>

          {!isDemoMode && (
            <button
              onClick={handleLogout}
              className="group relative w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <div className="absolute left-full ml-4 px-3 py-2 bg-violet-500 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                Logout
              </div>
            </button>
          )}

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${
                isActive
                  ? 'bg-violet-500 text-white'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 hover:from-violet-100 hover:to-violet-200'
              }`
            }
          >
            <User className="w-5 h-5" />
          </NavLink>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-500 rounded-xl flex items-center justify-center">
              <img src="/logo-m7-white.png" alt="M7 Life Balance" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-violet-950">M7 Life Balance</h1>
              <p className="text-[10px] text-gray-400">Wellness Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
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
                      ? "bg-violet-500 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-violet-500"></div>
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
                  <p className="text-sm font-semibold text-violet-950">{profile?.display_name || t.user.name}</p>
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

      {/* Floating ZENO assistant (global) */}
      <ZenoFloatingButton />
    </div>
  );
}
