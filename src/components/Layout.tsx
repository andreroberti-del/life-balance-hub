import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileSidebar from './MobileSidebar';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-dark">
      {/* Desktop: Collapsible sidebar */}
      <Sidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      {/* Mobile: Full sidebar overlay */}
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-dark px-5 lg:px-7 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
