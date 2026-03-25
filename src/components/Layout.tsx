import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileSidebar from './MobileSidebar';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1360px] mx-auto px-6 py-8 lg:px-10 lg:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
