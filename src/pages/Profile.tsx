import { useState } from 'react';
import {
  User,
  Scale,
  Ruler,
  Calendar,
  Pill,
  Globe,
  LogOut,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { updateProfile } from '../lib/api';

const languages = [
  { code: 'pt', label: 'Portugues' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Espanol' },
];

const genders = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Feminino' },
  { value: 'other', label: 'Outro' },
];

export default function ProfilePage() {
  const { profile, user, signOut, loading: authLoading, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(profile?.name || '');
  const [weight, setWeight] = useState(profile?.weight?.toString() || '');
  const [height, setHeight] = useState(profile?.height?.toString() || '');
  const [waist, setWaist] = useState(profile?.waist?.toString() || '');
  const [birthDate, setBirthDate] = useState(profile?.birth_date || '');
  const [gender, setGender] = useState(profile?.gender || '');
  const [omegaBrand, setOmegaBrand] = useState(profile?.omega_brand || '');
  const [language, setLanguage] = useState(profile?.language || 'pt');

  if (authLoading) return <LoadingSpinner />;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSaved(false);

    await updateProfile(user.id, {
      name,
      weight: weight ? parseFloat(weight) : null,
      height: height ? parseFloat(height) : null,
      waist: waist ? parseFloat(waist) : null,
      birth_date: birthDate || null,
      gender: gender || null,
      omega_brand: omegaBrand || null,
      language,
    });

    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Perfil</h2>
        <p className="text-slate-400 mt-1">Gerencie suas informacoes pessoais</p>
      </div>

      {saved && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-400">Perfil atualizado com sucesso!</p>
        </div>
      )}

      {/* Avatar Section */}
      <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-lime/20 flex items-center justify-center text-lime text-2xl font-bold">
            {initials}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{name || 'Usuario'}</p>
            <p className="text-sm text-slate-400">{profile?.email || user?.email || ''}</p>
            <p className="text-xs text-slate-500 mt-1">
              Membro desde{' '}
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString('pt-BR')
                : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
        <h3 className="text-lg font-semibold text-white mb-6">Informacoes Pessoais</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-400 mb-1.5">
              <User className="w-4 h-4" /> Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark2 border border-dark4/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-lime/50 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-400 mb-1.5">
              <Calendar className="w-4 h-4" /> Data de Nascimento
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-dark2 border border-dark4/50 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-lime/50 transition-colors [color-scheme:dark]"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-400 mb-1.5">
              <Scale className="w-4 h-4" /> Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ex: 82.5"
              className="w-full bg-dark2 border border-dark4/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-lime/50 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-400 mb-1.5">
              <Ruler className="w-4 h-4" /> Altura (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Ex: 175"
              className="w-full bg-dark2 border border-dark4/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-lime/50 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-400 mb-1.5">
              <Ruler className="w-4 h-4" /> Cintura (cm)
            </label>
            <input
              type="number"
              step="0.1"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              placeholder="Ex: 90"
              className="w-full bg-dark2 border border-dark4/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-lime/50 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-400 mb-1.5">
              <User className="w-4 h-4" /> Genero
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-dark2 border border-dark4/50 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-lime/50 transition-colors appearance-none"
            >
              <option value="">Selecione</option>
              {genders.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-400 mb-1.5">
              <Pill className="w-4 h-4" /> Marca de Omega
            </label>
            <input
              type="text"
              value={omegaBrand}
              onChange={(e) => setOmegaBrand(e.target.value)}
              placeholder="Ex: Zinzino BalanceOil+"
              className="w-full bg-dark2 border border-dark4/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-lime/50 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-400 mb-1.5">
              <Globe className="w-4 h-4" /> Idioma
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-dark2 border border-dark4/50 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-lime/50 transition-colors appearance-none"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 px-5 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair da conta
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-lime text-dark font-semibold rounded-xl hover:bg-lime-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
