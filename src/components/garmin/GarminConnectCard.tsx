import { Watch, Link2, Unlink, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useGarmin } from '../../hooks/useGarmin';
import { useLanguage } from '../../contexts/LanguageContext';

export function GarminConnectCard() {
  const { isConnected, isLoading, connection, connect, disconnect } = useGarmin();
  const { t } = useLanguage();
  const [disconnecting, setDisconnecting] = useState(false);
  const [connecting, setConnecting] = useState(false);

  async function handleConnect() {
    setConnecting(true);
    try {
      await connect();
    } catch {
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    if (!confirm(t.garmin.disconnectConfirm)) return;
    setDisconnecting(true);
    try {
      await disconnect();
    } finally {
      setDisconnecting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-10 bg-gray-200 rounded w-full" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#007749] rounded-xl flex items-center justify-center">
            <Watch className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#1a1a1a]">Garmin Connect</h3>
            <p className="text-xs text-gray-500">
              {isConnected ? (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  {t.garmin.connected}
                </span>
              ) : (
                t.garmin.notConnected
              )}
            </p>
          </div>
        </div>
      </div>

      {isConnected ? (
        <div className="space-y-3">
          {connection?.last_sync_at && (
            <p className="text-xs text-gray-400">
              {t.garmin.lastSync}: {new Date(connection.last_sync_at).toLocaleString()}
            </p>
          )}
          <button
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-all disabled:opacity-50"
          >
            <Unlink className="w-4 h-4" />
            {disconnecting ? '...' : t.garmin.disconnectGarmin}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">{t.garmin.connectDescription}</p>
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#007749] text-white rounded-xl text-sm font-bold hover:bg-[#006640] transition-all disabled:opacity-50"
          >
            <Link2 className="w-4 h-4" />
            {connecting ? '...' : t.garmin.connectGarmin}
          </button>
        </div>
      )}
    </div>
  );
}
