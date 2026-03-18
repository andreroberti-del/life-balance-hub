import { useEffect, useState } from 'react';
import {
  ScanLine,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { getScanHistory } from '../lib/api';
import type { ScanResult } from '../types';

const demoScans: ScanResult[] = [
  { id: '1', user_id: '', product_name: 'Omega Pure 3 TG', score: 92, verdict: 'excellent', ingredients: ['Oleo de peixe concentrado', 'Vitamina E', 'Gelatina'], personal_impact: 'Excelente fonte de EPA/DHA. Compativel com seu protocolo.', scanned_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', user_id: '', product_name: 'Azeite Extra Virgem Gallo', score: 78, verdict: 'good', ingredients: ['Azeite de oliva extra virgem'], personal_impact: 'Bom aporte de gorduras saudaveis. Rico em polifenois.', scanned_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: '3', user_id: '', product_name: 'Margarina Qualy', score: 35, verdict: 'avoid', ingredients: ['Oleos vegetais', 'Agua', 'Sal', 'Emulsificantes', 'Conservantes', 'Corantes'], personal_impact: 'Alto teor de gordura trans. Prejudicial ao ratio omega 6:3.', scanned_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: '4', user_id: '', product_name: 'Salmao Fresco', score: 88, verdict: 'excellent', ingredients: ['Salmao atlantico'], personal_impact: 'Otima fonte natural de omega-3. Recomendado 2-3x por semana.', scanned_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: '5', user_id: '', product_name: 'Oleo de Girassol Liza', score: 22, verdict: 'avoid', ingredients: ['Oleo de girassol refinado', 'Antioxidante TBHQ'], personal_impact: 'Muito alto em omega-6. Piora significativamente o ratio.', scanned_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: '6', user_id: '', product_name: 'Castanha do Para', score: 65, verdict: 'moderate', ingredients: ['Castanha do para'], personal_impact: 'Rica em selenio mas moderada em omega-6. Consumir com moderacao.', scanned_at: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: '7', user_id: '', product_name: 'Sardinha em Lata Coqueiro', score: 82, verdict: 'good', ingredients: ['Sardinha', 'Oleo de soja', 'Sal'], personal_impact: 'Boa fonte de omega-3. Preferir versao em agua ou azeite.', scanned_at: new Date(Date.now() - 7 * 86400000).toISOString() },
];

const verdictConfig = {
  excellent: { label: 'Excelente', color: 'bg-green-50 text-green-600', icon: CheckCircle2 },
  good: { label: 'Bom', color: 'bg-blue-50 text-blue-600', icon: CheckCircle2 },
  moderate: { label: 'Moderado', color: 'bg-amber-50 text-amber-600', icon: AlertCircle },
  avoid: { label: 'Evitar', color: 'bg-red-50 text-red-600', icon: XCircle },
};

const filterOptions = [
  { id: 'all', label: 'Todos' },
  { id: 'excellent', label: 'Excelente' },
  { id: 'good', label: 'Bom' },
  { id: 'moderate', label: 'Moderado' },
  { id: 'avoid', label: 'Evitar' },
];

export default function ScannerPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!user) {
        setScans(demoScans);
        setLoading(false);
        return;
      }
      try {
        const data = await getScanHistory(user.id);
        setScans(data.length > 0 ? data : demoScans);
      } catch {
        setScans(demoScans);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const filteredScans = scans.filter((s) => {
    const matchesFilter = filter === 'all' || s.verdict === filter;
    const matchesSearch =
      !searchTerm || s.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text">Scanner de Produtos</h2>
        <p className="text-text2 mt-1">Historico de produtos escaneados</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text3" />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text placeholder-text-light outline-none focus:border-lime-darker/50 focus:ring-1 focus:ring-lime-darker/20 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          />
        </div>

        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <Filter className="w-4 h-4 text-text3 self-center ml-2" />
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filter === opt.id
                  ? 'bg-lime text-dark'
                  : 'text-text3 hover:text-text2'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scan Results */}
      {filteredScans.length === 0 ? (
        <EmptyState
          icon={ScanLine}
          title="Nenhum produto encontrado"
          description="Escaneie produtos usando o app mobile para ver o historico aqui"
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text3 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="text-left px-6 py-3 font-medium">Produto</th>
                <th className="text-left px-6 py-3 font-medium">Score</th>
                <th className="text-left px-6 py-3 font-medium">Veredito</th>
                <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Data</th>
                <th className="text-left px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredScans.map((scan) => {
                const verdict = verdictConfig[scan.verdict];
                const VerdictIcon = verdict.icon;
                return (
                  <tr
                    key={scan.id}
                    className="border-t border-gray-50 hover:bg-bg/50 transition-colors cursor-pointer"
                    onClick={() =>
                      setExpandedId(expandedId === scan.id ? null : scan.id)
                    }
                  >
                    <td className="px-6 py-4">
                      <span className="text-text font-medium">{scan.product_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center">
                          <span className={`text-lg font-bold ${getScoreColor(scan.score)}`}>
                            {scan.score}
                          </span>
                        </div>
                        <div className="w-16 h-1.5 bg-bg2 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${getScoreBg(scan.score)}`}
                            style={{ width: `${scan.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${verdict.color}`}>
                        <VerdictIcon className="w-3.5 h-3.5" />
                        {verdict.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text3 hidden md:table-cell">
                      {new Date(scan.scanned_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-text3">
                      {expandedId === scan.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredScans.map((scan) =>
                expandedId === scan.id ? (
                  <tr key={`${scan.id}-detail`} className="border-t border-gray-50">
                    <td colSpan={5} className="px-6 py-5 bg-bg/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-xs text-text3 uppercase tracking-wider mb-2">
                            Ingredientes
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {scan.ingredients.map((ing, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs text-text2"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs text-text3 uppercase tracking-wider mb-2">
                            Impacto Pessoal
                          </h4>
                          <div className="flex items-start gap-2 p-3 bg-white border border-gray-200 rounded-xl">
                            {scan.verdict === 'avoid' ? (
                              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            )}
                            <p className="text-sm text-text2">
                              {scan.personal_impact || 'Sem analise disponivel'}
                            </p>
                          </div>
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
  );
}
