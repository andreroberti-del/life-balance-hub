import { useState } from 'react';
import {
  Bell,
  Shield,
  Palette,
  Database,
  HelpCircle,
  FileText,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface SettingToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}

function SettingToggle({ label, description, enabled, onChange }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-dark4/20 last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
          enabled ? 'bg-lime' : 'bg-dark4'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            enabled ? 'left-5.5' : 'left-0.5'
          }`}
          style={{ left: enabled ? '22px' : '2px' }}
        />
      </button>
    </div>
  );
}

interface SettingLinkProps {
  label: string;
  description: string;
  external?: boolean;
}

function SettingLink({ label, description, external }: SettingLinkProps) {
  return (
    <button className="w-full flex items-center justify-between py-4 border-b border-dark4/20 last:border-0 hover:bg-dark4/10 transition-colors text-left">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      {external ? (
        <ExternalLink className="w-4 h-4 text-slate-500 flex-shrink-0" />
      ) : (
        <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
      )}
    </button>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    communityUpdates: false,
    protocolAlerts: true,
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Configuracoes</h2>
        <p className="text-slate-400 mt-1">Personalize sua experiencia</p>
      </div>

      {/* Notifications */}
      <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Notificacoes</h3>
        </div>

        <SettingToggle
          label="Lembrete diario"
          description="Receber lembrete para fazer o check-in"
          enabled={notifications.dailyReminder}
          onChange={(v) => setNotifications({ ...notifications, dailyReminder: v })}
        />
        <SettingToggle
          label="Relatorio semanal"
          description="Resumo semanal do seu progresso por email"
          enabled={notifications.weeklyReport}
          onChange={(v) => setNotifications({ ...notifications, weeklyReport: v })}
        />
        <SettingToggle
          label="Atualizacoes da comunidade"
          description="Novidades e marcos da comunidade"
          enabled={notifications.communityUpdates}
          onChange={(v) => setNotifications({ ...notifications, communityUpdates: v })}
        />
        <SettingToggle
          label="Alertas do protocolo"
          description="Marcos e lembretes do Protocolo 120"
          enabled={notifications.protocolAlerts}
          onChange={(v) => setNotifications({ ...notifications, protocolAlerts: v })}
        />
      </div>

      {/* Appearance */}
      <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Aparencia</h3>
        </div>

        <div className="py-4 border-b border-dark4/20">
          <p className="text-sm font-medium text-white mb-3">Tema</p>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-lime/15 border border-lime/30 rounded-xl text-sm text-lime font-medium">
              <div className="w-4 h-4 rounded-full bg-dark border-2 border-lime" />
              Escuro
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-dark4/50 border border-dark4/30 rounded-xl text-sm text-slate-400">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-400" />
              Claro (em breve)
            </button>
          </div>
        </div>

        <div className="py-4">
          <p className="text-sm font-medium text-white mb-3">Unidades</p>
          <div className="flex gap-3">
            <button className="px-4 py-2.5 bg-lime/15 border border-lime/30 rounded-xl text-sm text-lime font-medium">
              Metrico (kg, cm)
            </button>
            <button className="px-4 py-2.5 bg-dark4/50 border border-dark4/30 rounded-xl text-sm text-slate-400">
              Imperial (lb, in)
            </button>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-green-500/10 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Privacidade & Dados</h3>
        </div>

        <SettingLink
          label="Exportar meus dados"
          description="Baixar todos os seus dados em formato JSON"
        />
        <SettingLink
          label="Excluir conta"
          description="Remover permanentemente sua conta e dados"
        />
      </div>

      {/* About */}
      <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-slate-500/10 rounded-xl flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Sobre</h3>
        </div>

        <SettingLink
          label="Central de ajuda"
          description="Perguntas frequentes e suporte"
          external
        />
        <SettingLink
          label="Termos de uso"
          description="Termos e condicoes de uso"
          external
        />
        <SettingLink
          label="Politica de privacidade"
          description="Como tratamos seus dados"
          external
        />

        <div className="flex items-center justify-between py-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5" />
            <span>Life Balance Hub v1.0.0</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Build 2026.03.18</span>
          </div>
        </div>
      </div>
    </div>
  );
}
