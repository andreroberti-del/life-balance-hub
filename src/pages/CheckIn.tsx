import { useEffect, useState } from 'react';
import {
  Scale,
  Moon,
  Droplets,
  Ruler,
  Pill,
  Heart,
  Activity,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { saveCheckIn, getCheckIns } from '../lib/api';
import type { CheckIn as CheckInType } from '../types';

const demoHistory: Partial<CheckInType>[] = Array.from({ length: 10 }, (_, i) => ({
  id: `demo-${i}`,
  date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
  weight: 82 - i * 0.2 + Math.random() * 0.3,
  sleep_quality: Math.floor(3 + Math.random() * 2),
  water_liters: 1.5 + Math.random() * 1.5,
  waist: 90 - i * 0.1,
  took_omega: Math.random() > 0.2,
  blood_pressure_sys: 120 + Math.floor(Math.random() * 10),
  blood_pressure_dia: 75 + Math.floor(Math.random() * 10),
  glucose: 85 + Math.floor(Math.random() * 15),
  notes: i === 0 ? 'Me senti bem hoje' : null,
}));

export default function CheckInPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<Partial<CheckInType>[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const [weight, setWeight] = useState('');
  const [sleepQuality, setSleepQuality] = useState(3);
  const [waterLiters, setWaterLiters] = useState('');
  const [waist, setWaist] = useState('');
  const [tookOmega, setTookOmega] = useState(false);
  const [bpSys, setBpSys] = useState('');
  const [bpDia, setBpDia] = useState('');
  const [glucose, setGlucose] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function loadHistory() {
      if (!user) {
        setHistory(demoHistory);
        setLoading(false);
        return;
      }
      try {
        const data = await getCheckIns(user.id, 30);
        setHistory(data.length > 0 ? data : demoHistory as CheckInType[]);
      } catch {
        setHistory(demoHistory);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const checkin = {
      user_id: user?.id || '',
      date: new Date().toISOString().split('T')[0],
      weight: weight ? parseFloat(weight) : null,
      sleep_quality: sleepQuality,
      water_liters: waterLiters ? parseFloat(waterLiters) : null,
      waist: waist ? parseFloat(waist) : null,
      took_omega: tookOmega,
      blood_pressure_sys: bpSys ? parseInt(bpSys) : null,
      blood_pressure_dia: bpDia ? parseInt(bpDia) : null,
      glucose: glucose ? parseInt(glucose) : null,
      notes: notes || null,
    };

    try {
      const result = await saveCheckIn(checkin);
      if (result) {
        setHistory([result, ...history]);
        setWeight('');
        setSleepQuality(3);
        setWaterLiters('');
        setWaist('');
        setTookOmega(false);
        setBpSys('');
        setBpDia('');
        setGlucose('');
        setNotes('');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving check-in:', err);
    } finally {
      setSaving(false);
    }
  };

  const sleepLabels = ['Pessimo', 'Ruim', 'Regular', 'Bom', 'Otimo'];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text">Check-in Diario</h2>
        <p className="text-text2 mt-1">Registre seus dados de hoje</p>
      </div>

      {saved && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700">Check-in salvo com sucesso!</p>
        </div>
      )}

      {/* Check-in Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm text-text2 mb-2">
              <Scale className="w-4 h-4" /> Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ex: 82.5"
              className="w-full bg-bg border border-gray-200 rounded-xl px-4 py-3 text-sm text-text placeholder-text-light outline-none focus:border-lime-darker/50 focus:ring-1 focus:ring-lime-darker/20 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-text2 mb-2">
              <Moon className="w-4 h-4" /> Qualidade do Sono
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="5"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-text3">
                {sleepLabels.map((label, i) => (
                  <span
                    key={label}
                    className={i + 1 === sleepQuality ? 'text-lime-darker font-semibold' : ''}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-text2 mb-2">
              <Droplets className="w-4 h-4" /> Agua (litros)
            </label>
            <input
              type="number"
              step="0.1"
              value={waterLiters}
              onChange={(e) => setWaterLiters(e.target.value)}
              placeholder="Ex: 2.5"
              className="w-full bg-bg border border-gray-200 rounded-xl px-4 py-3 text-sm text-text placeholder-text-light outline-none focus:border-lime-darker/50 focus:ring-1 focus:ring-lime-darker/20 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-text2 mb-2">
              <Ruler className="w-4 h-4" /> Cintura (cm)
            </label>
            <input
              type="number"
              step="0.1"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              placeholder="Ex: 90"
              className="w-full bg-bg border border-gray-200 rounded-xl px-4 py-3 text-sm text-text placeholder-text-light outline-none focus:border-lime-darker/50 focus:ring-1 focus:ring-lime-darker/20 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-text2 mb-2">
              <Heart className="w-4 h-4" /> Pressao Arterial
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={bpSys}
                onChange={(e) => setBpSys(e.target.value)}
                placeholder="Sis"
                className="w-1/2 bg-bg border border-gray-200 rounded-xl px-4 py-3 text-sm text-text placeholder-text-light outline-none focus:border-lime-darker/50 focus:ring-1 focus:ring-lime-darker/20 transition-colors"
              />
              <input
                type="number"
                value={bpDia}
                onChange={(e) => setBpDia(e.target.value)}
                placeholder="Dia"
                className="w-1/2 bg-bg border border-gray-200 rounded-xl px-4 py-3 text-sm text-text placeholder-text-light outline-none focus:border-lime-darker/50 focus:ring-1 focus:ring-lime-darker/20 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-text2 mb-2">
              <Activity className="w-4 h-4" /> Glicose (mg/dL)
            </label>
            <input
              type="number"
              value={glucose}
              onChange={(e) => setGlucose(e.target.value)}
              placeholder="Ex: 95"
              className="w-full bg-bg border border-gray-200 rounded-xl px-4 py-3 text-sm text-text placeholder-text-light outline-none focus:border-lime-darker/50 focus:ring-1 focus:ring-lime-darker/20 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => setTookOmega(!tookOmega)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                tookOmega ? 'bg-lime' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  tookOmega ? 'left-6' : 'left-1'
                }`}
              />
            </button>
            <label className="flex items-center gap-2 text-sm text-text2">
              <Pill className="w-4 h-4 text-text3" /> Tomou Omega hoje
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm text-text2 mb-2">
              <FileText className="w-4 h-4" /> Observacoes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Como voce se sentiu hoje?"
              rows={3}
              className="w-full bg-bg border border-gray-200 rounded-xl px-4 py-3 text-sm text-text placeholder-text-light outline-none focus:border-lime-darker/50 focus:ring-1 focus:ring-lime-darker/20 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-lime text-dark font-semibold rounded-xl hover:bg-lime-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : 'Salvar Check-in'}
          </button>
        </div>
      </form>

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-text">Historico de Check-ins</h3>
        </div>

        {history.length === 0 ? (
          <EmptyState
            title="Nenhum check-in registrado"
            description="Comece registrando seu primeiro check-in acima"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text3 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-3 font-medium">Data</th>
                  <th className="text-left px-6 py-3 font-medium">Peso</th>
                  <th className="text-left px-6 py-3 font-medium">Sono</th>
                  <th className="text-left px-6 py-3 font-medium">Agua</th>
                  <th className="text-left px-6 py-3 font-medium">Cintura</th>
                  <th className="text-left px-6 py-3 font-medium">Omega</th>
                  <th className="text-left px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.id || item.date}
                    className="border-t border-gray-50 hover:bg-bg/50 transition-colors cursor-pointer"
                    onClick={() =>
                      setExpandedRow(
                        expandedRow === (item.id || item.date)
                          ? null
                          : (item.id || item.date) ?? null
                      )
                    }
                  >
                    <td className="px-6 py-4 text-text font-medium">
                      {item.date
                        ? new Date(item.date + 'T12:00:00').toLocaleDateString('pt-BR')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-text2">
                      {item.weight?.toFixed(1) ?? '-'} kg
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div
                            key={s}
                            className={`w-2 h-2 rounded-full ${
                              s <= (item.sleep_quality ?? 0)
                                ? 'bg-lime-darker'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text2">
                      {item.water_liters?.toFixed(1) ?? '-'} L
                    </td>
                    <td className="px-6 py-4 text-text2">
                      {item.waist?.toFixed(1) ?? '-'} cm
                    </td>
                    <td className="px-6 py-4">
                      {item.took_omega ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sim
                        </span>
                      ) : (
                        <span className="text-text-light text-xs">Nao</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-text3">
                      {expandedRow === (item.id || item.date) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </td>
                  </tr>
                ))}
                {history.map((item) =>
                  expandedRow === (item.id || item.date) ? (
                    <tr key={`${item.id || item.date}-detail`} className="border-t border-gray-50">
                      <td colSpan={7} className="px-6 py-4 bg-bg/50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-text3">Pressao</span>
                            <p className="text-text2 mt-0.5">
                              {item.blood_pressure_sys && item.blood_pressure_dia
                                ? `${item.blood_pressure_sys}/${item.blood_pressure_dia} mmHg`
                                : '-'}
                            </p>
                          </div>
                          <div>
                            <span className="text-text3">Glicose</span>
                            <p className="text-text2 mt-0.5">
                              {item.glucose ? `${item.glucose} mg/dL` : '-'}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-text3">Observacoes</span>
                            <p className="text-text2 mt-0.5">{item.notes || '-'}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
