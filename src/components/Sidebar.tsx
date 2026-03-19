import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  ScanLine,
  Database,
  Users,
  Target,
  UserCircle,
  Settings,
  X,
  Leaf,
  Kanban,
  Bell,
  UserCheck,
  TestTube2,
  BarChart2,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const wellnessItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/checkin', icon: ClipboardCheck, label: 'Check-in' },
  { to: '/data', icon: BarChart3, label: 'Dados' },
  { to: '/scanner', icon: ScanLine, label: 'Scanner' },
  { to: '/omega', icon: Database, label: 'Omega Database' },
  { to: '/community', icon: Users, label: 'Comunidade' },
  { to: '/protocol', icon: Target, label: 'Protocolo 120' },
];

const crmItems = [
  { to: '/crm/pipeline', icon: Kanban, label: 'Pipeline' },
  { to: '/crm/followups', icon: Bell, label: 'Follow-ups' },
  { to: '/crm/clients', icon: UserCheck, label: 'Clientes' },
  { to: '/crm/tests', icon: TestTube2, label: 'Testes' },
  { to: '/crm/performance', icon: BarChart2, label: 'Performance' },
];

const bottomItems = [
  { to: '/profile', icon: UserCircle, label: 'Perfil' },
  { to: '/settings', icon: Settings, label: 'Configuracoes' },
];

const linkBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '14px',
  fontSize: '13px',
  fontWeight: 500,
  transition: 'all 0.2s',
  textDecoration: 'none',
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)', zIndex: 40 }}
          onClick={onClose}
          className="lg:hidden"
        />
      )}

      <aside
        style={{
          width: '260px',
          minWidth: '260px',
          height: '100vh',
          background: '#fff',
          borderRight: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.3s ease',
          zIndex: 50,
        }}
        className={`fixed top-0 left-0 lg:static ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div style={{ padding: '28px 24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', background: '#E7FE55', borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(231,254,85,0.3)',
            }}>
              <Leaf style={{ width: '20px', height: '20px', color: '#0F1511' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1F1C', letterSpacing: '-0.3px' }}>Life Balance</h1>
              <p style={{ fontSize: '10px', color: '#8A9A90', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px' }}>Wellness Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden"
            style={{ padding: '8px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#8A9A90' }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '0 16px', overflowY: 'auto' }}>
          {/* Wellness Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {wellnessItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                style={({ isActive }) => ({
                  ...linkBase,
                  background: isActive ? '#E7FE55' : 'transparent',
                  color: isActive ? '#0F1511' : '#4A5A50',
                  fontWeight: isActive ? 600 : 500,
                  boxShadow: isActive ? '0 1px 3px rgba(231,254,85,0.3)' : 'none',
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  if (!target.classList.contains('active')) {
                    target.style.background = 'rgba(0,0,0,0.03)';
                    target.style.color = '#1A1F1C';
                  }
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  if (!target.classList.contains('active')) {
                    target.style.background = 'transparent';
                    target.style.color = '#4A5A50';
                  }
                }}
              >
                <item.icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* CRM Separator */}
          <div style={{ margin: '16px 0 12px', padding: '0 16px' }}>
            <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)' }} />
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#8A9A90', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '12px' }}>CRM</p>
          </div>

          {/* CRM Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {crmItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                style={({ isActive }) => ({
                  ...linkBase,
                  background: isActive ? '#E7FE55' : 'transparent',
                  color: isActive ? '#0F1511' : '#4A5A50',
                  fontWeight: isActive ? 600 : 500,
                  boxShadow: isActive ? '0 1px 3px rgba(231,254,85,0.3)' : 'none',
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  if (!target.classList.contains('active')) {
                    target.style.background = 'rgba(0,0,0,0.03)';
                    target.style.color = '#1A1F1C';
                  }
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  if (!target.classList.contains('active')) {
                    target.style.background = 'transparent';
                    target.style.color = '#4A5A50';
                  }
                }}
              >
                <item.icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Bottom Separator */}
          <div style={{ margin: '16px 0 12px', padding: '0 16px' }}>
            <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)' }} />
          </div>

          {/* Bottom Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {bottomItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                style={({ isActive }) => ({
                  ...linkBase,
                  background: isActive ? '#E7FE55' : 'transparent',
                  color: isActive ? '#0F1511' : '#4A5A50',
                  fontWeight: isActive ? 600 : 500,
                  boxShadow: isActive ? '0 1px 3px rgba(231,254,85,0.3)' : 'none',
                })}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  if (!target.classList.contains('active')) {
                    target.style.background = 'rgba(0,0,0,0.03)';
                    target.style.color = '#1A1F1C';
                  }
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  if (!target.classList.contains('active')) {
                    target.style.background = 'transparent';
                    target.style.color = '#4A5A50';
                  }
                }}
              >
                <item.icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Protocol Progress */}
        <div style={{ padding: '16px 20px 24px' }}>
          <div style={{
            padding: '16px 18px',
            background: '#0F1511',
            borderRadius: '16px',
          }}>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>
              Protocolo 120 Dias
            </p>
            <div style={{ marginTop: '12px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '45%', height: '100%', background: '#E7FE55', borderRadius: '3px', transition: 'width 0.5s' }} />
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '8px' }}>
              Dia 54 de 120
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
