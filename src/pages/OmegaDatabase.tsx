import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Database,
  Search,
  ArrowUpDown,
  Star,
  Users,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getOmegaBrands } from '../lib/api';
import type { OmegaBrand } from '../types';

const demoBrands: OmegaBrand[] = [
  { id: '1', name: 'Zinzino BalanceOil+', manufacturer: 'Zinzino', omega3_mg: 2500, epa_mg: 1300, dha_mg: 700, price: 49.90, currency: 'EUR', users_count: 1247, avg_improvement: 42, avg_ratio_before: 12.3, avg_ratio_after: 3.1 },
  { id: '2', name: 'Nordic Naturals Ultimate', manufacturer: 'Nordic Naturals', omega3_mg: 2150, epa_mg: 1100, dha_mg: 850, price: 45.00, currency: 'USD', users_count: 832, avg_improvement: 35, avg_ratio_before: 11.8, avg_ratio_after: 4.2 },
  { id: '3', name: 'Omega Pure 3 TG', manufacturer: 'Essential Nutrition', omega3_mg: 1800, epa_mg: 990, dha_mg: 660, price: 189.90, currency: 'BRL', users_count: 654, avg_improvement: 28, avg_ratio_before: 10.5, avg_ratio_after: 5.1 },
  { id: '4', name: 'WHC UnoCardio 1000', manufacturer: 'WHC', omega3_mg: 1200, epa_mg: 675, dha_mg: 450, price: 38.00, currency: 'EUR', users_count: 423, avg_improvement: 25, avg_ratio_before: 11.2, avg_ratio_after: 5.8 },
  { id: '5', name: 'Carlson Elite Omega-3', manufacturer: 'Carlson Labs', omega3_mg: 1600, epa_mg: 800, dha_mg: 600, price: 32.00, currency: 'USD', users_count: 389, avg_improvement: 22, avg_ratio_before: 10.8, avg_ratio_after: 6.2 },
  { id: '6', name: 'Life Extension Super Omega', manufacturer: 'Life Extension', omega3_mg: 2000, epa_mg: 1050, dha_mg: 750, price: 28.50, currency: 'USD', users_count: 312, avg_improvement: 30, avg_ratio_before: 11.5, avg_ratio_after: 4.8 },
  { id: '7', name: 'Vitafor Omegafor Plus', manufacturer: 'Vitafor', omega3_mg: 990, epa_mg: 540, dha_mg: 360, price: 139.90, currency: 'BRL', users_count: 278, avg_improvement: 18, avg_ratio_before: 10.2, avg_ratio_after: 6.9 },
  { id: '8', name: 'Now Foods Ultra Omega-3', manufacturer: 'Now Foods', omega3_mg: 1500, epa_mg: 750, dha_mg: 500, price: 19.99, currency: 'USD', users_count: 567, avg_improvement: 20, avg_ratio_before: 10.9, avg_ratio_after: 6.5 },
];

type SortKey = 'name' | 'omega3_mg' | 'price' | 'users_count' | 'avg_improvement';

export default function OmegaDatabasePage() {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<OmegaBrand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('users_count');
  const [sortAsc, setSortAsc] = useState(false);
  const [view, setView] = useState<'table' | 'chart'>('table');

  useEffect(() => {
    async function loadData() {
      if (!user) {
        setBrands(demoBrands);
        setLoading(false);
        return;
      }
      try {
        const data = await getOmegaBrands();
        setBrands(data.length > 0 ? data : demoBrands);
      } catch {
        setBrands(demoBrands);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const filteredBrands = brands
    .filter(
      (b) =>
        !searchTerm ||
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

  const chartData = filteredBrands.slice(0, 8).map((b) => ({
    name: b.name.length > 20 ? b.name.slice(0, 20) + '...' : b.name,
    Antes: b.avg_ratio_before,
    Depois: b.avg_ratio_after,
  }));

  const userBrand = 'Zinzino BalanceOil+';

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="text-left px-6 py-3 font-medium cursor-pointer hover:text-text2 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown
          className={`w-3 h-3 ${sortKey === field ? 'text-lime-darker' : 'text-text4'}`}
        />
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Omega Database</h2>
          <p className="text-text2 mt-1">
            Compare marcas de omega-3 e resultados reais
          </p>
        </div>
        <div className="flex gap-1 bg-card rounded-xl p-1 border border-border">
          <button
            onClick={() => setView('table')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'table' ? 'bg-lime text-dark' : 'text-text3'
            }`}
          >
            Tabela
          </button>
          <button
            onClick={() => setView('chart')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === 'chart' ? 'bg-lime text-dark' : 'text-text3'
            }`}
          >
            Grafico
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text3" />
        <input
          type="text"
          placeholder="Buscar marca ou fabricante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dark3 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-text4 outline-none focus:border-lime/50 focus:ring-1 focus:ring-lime/20 transition-colors"
        />
      </div>

      {view === 'chart' ? (
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-text mb-4">
            Ratio Omega 6:3 — Antes vs Depois
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={150}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2d3a4e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '13px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}
                />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }} />
                <Bar dataKey="Antes" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={14} />
                <Bar dataKey="Depois" fill="#C6D63E" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text4 text-xs uppercase tracking-wider border-b border-border">
                  <SortHeader label="Marca" field="name" />
                  <th className="text-left px-6 py-3 font-medium hidden lg:table-cell">Fabricante</th>
                  <SortHeader label="Omega-3" field="omega3_mg" />
                  <th className="text-left px-6 py-3 font-medium hidden xl:table-cell">EPA</th>
                  <th className="text-left px-6 py-3 font-medium hidden xl:table-cell">DHA</th>
                  <SortHeader label="Preco" field="price" />
                  <SortHeader label="Usuarios" field="users_count" />
                  <SortHeader label="Melhoria" field="avg_improvement" />
                </tr>
              </thead>
              <tbody>
                {filteredBrands.map((brand) => {
                  const isUserBrand = brand.name === userBrand;
                  return (
                    <tr
                      key={brand.id}
                      className={`border-t border-border transition-colors ${
                        isUserBrand
                          ? 'bg-lime/5 hover:bg-lime/10'
                          : 'hover:bg-[rgba(255,255,255,0.03)]'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {isUserBrand && (
                            <Star className="w-4 h-4 text-lime-darker flex-shrink-0" />
                          )}
                          <span className={`font-medium ${isUserBrand ? 'text-lime-darker' : 'text-text'}`}>
                            {brand.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text3 hidden lg:table-cell">
                        {brand.manufacturer}
                      </td>
                      <td className="px-6 py-4 text-text font-semibold">
                        {brand.omega3_mg} mg
                      </td>
                      <td className="px-6 py-4 text-text2 hidden xl:table-cell">
                        {brand.epa_mg} mg
                      </td>
                      <td className="px-6 py-4 text-text2 hidden xl:table-cell">
                        {brand.dha_mg} mg
                      </td>
                      <td className="px-6 py-4 text-text2">
                        {brand.currency === 'BRL' ? 'R$' : brand.currency === 'EUR' ? '\u20ac' : '$'}
                        {brand.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-text3" />
                          <span className="text-text2">{brand.users_count.toLocaleString('pt-BR')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-green-600 font-semibold">
                            {brand.avg_improvement}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-6 border border-border text-center">
          <div className="w-10 h-10 bg-lime/15 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Database className="w-5 h-5 text-lime-darker" />
          </div>
          <p className="text-3xl font-black text-text">{brands.length}</p>
          <p className="text-sm text-text3">Marcas catalogadas</p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border text-center">
          <div className="w-10 h-10 bg-blue-500/15 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-text">
            {brands.reduce((sum, b) => sum + b.users_count, 0).toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-text3">Usuarios ativos</p>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border text-center">
          <div className="w-10 h-10 bg-green-500/15 rounded-xl flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-black text-text">
            {Math.round(brands.reduce((sum, b) => sum + b.avg_improvement, 0) / brands.length)}%
          </p>
          <p className="text-sm text-text3">Melhoria media</p>
        </div>
      </div>
    </div>
  );
}
