import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon, Brain, ListChecks, Users, AlertCircle, Lightbulb, Heart, Sunrise, MessageCircleQuestion,
  Mic, CheckCircle, Lock, Sparkles, Frown, Meh, Smile,
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ZenoMascot } from '../zeno/ZenoMascot';
import { toastSuccess, toastInfo } from '../ui/feedback';

interface BrainDumpPrompt {
  code: string;
  category: string;
  prompt_pt: string;
  icon_name: string;
  display_order: number;
}

interface BrainDumpEntry {
  id: string;
  user_id: string;
  entry_date: string;
  raw_text: string | null;
  mood_before: number | null;
  mood_after: number | null;
  created_at: string;
}

const iconMap: Record<string, typeof Brain> = {
  ListChecks, Users, AlertCircle, Lightbulb, Heart, Sunrise, MessageCircleQuestion,
};

const moodIcons = [Frown, Frown, Meh, Smile, Smile];

export function BrainDump() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<BrainDumpPrompt[]>([]);
  const [todayEntry, setTodayEntry] = useState<BrainDumpEntry | null>(null);
  const [history, setHistory] = useState<BrainDumpEntry[]>([]);
  const [rawText, setRawText] = useState('');
  const [moodBefore, setMoodBefore] = useState<number>(0);
  const [moodAfter, setMoodAfter] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPromptHelpers, setShowPromptHelpers] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    const todayDate = new Date().toISOString().split('T')[0];

    const [{ data: p }, { data: today }, { data: h }] = await Promise.all([
      supabase.from('brain_dump_prompts').select('*').order('display_order'),
      supabase.from('brain_dump_entries').select('*').eq('user_id', user.id).eq('entry_date', todayDate).maybeSingle(),
      supabase.from('brain_dump_entries').select('*').eq('user_id', user.id).order('entry_date', { ascending: false }).limit(14),
    ]);

    setPrompts((p ?? []) as BrainDumpPrompt[]);
    if (today) {
      setTodayEntry(today);
      setRawText(today.raw_text ?? '');
      setMoodBefore(today.mood_before ?? 0);
      setMoodAfter(today.mood_after ?? 0);
    }
    setHistory((h ?? []) as BrainDumpEntry[]);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addPromptToText = (prompt: BrainDumpPrompt) => {
    setRawText((prev) => {
      const sep = prev.trim().length > 0 ? '\n\n' : '';
      return `${prev}${sep}[${prompt.prompt_pt}]\n`;
    });
  };

  const handleSave = async () => {
    if (!user?.id || !rawText.trim() || saving) return;
    setSaving(true);
    try {
      const { data } = await supabase.rpc('save_brain_dump', {
        p_user_id: user.id,
        p_raw_text: rawText,
        p_mood_before: moodBefore || null,
        p_mood_after: moodAfter || null,
      });
      const result = data?.[0];
      if (result?.xp_awarded > 0) {
        toastSuccess('Mente esvaziada', 'Boa noite. Você dorme com a cabeça leve.');
      } else {
        toastSuccess('Atualizado', 'Seu brain dump de hoje foi salvo.');
      }
      await fetchAll();
    } finally {
      setSaving(false);
    }
  };

  const handlePremiumAudio = () => {
    toastInfo('Em breve', 'Gravação de áudio + transcrição automática chega na versão Premium.');
  };

  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-10 mb-8 shadow-xl shadow-violet-500/20"
          style={{ background: 'linear-gradient(135deg, #4338CA 0%, #6366F1 60%, #818CF8 100%)' }}
        >
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-20 w-56 h-56 bg-violet-300/30 rounded-full blur-3xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-5">
              <ZenoMascot pose="sleep" size="lg" className="hidden md:block flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="w-5 h-5 text-white/80" />
                  <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Antes de dormir</p>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">Download Your Brain</h1>
                <p className="text-white/85 text-base max-w-xl">
                  Esvazie tudo que está na sua cabeça aqui. Compromissos, preocupações, ideias, tarefas pra amanhã.
                  Dorme leve sabendo que nada vai ser esquecido.
                </p>
              </div>
            </div>
            {history.length > 0 && (
              <div className="bg-white/15 backdrop-blur rounded-2xl px-6 py-5 border border-white/20 min-w-[180px]">
                <p className="text-xs text-white/80 font-bold uppercase tracking-wider mb-2">Streak</p>
                <p className="text-4xl font-bold text-white">{history.length}<span className="text-base text-white/60">/14</span></p>
                <p className="text-xs text-white/70 mt-1">noites registradas</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: textarea + mood */}
          <div className="col-span-12 lg:col-span-8 space-y-6">

            {/* Mood antes */}
            <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg">
              <p className="text-sm font-bold text-violet-950 mb-3">Como você se sente agora, antes de descarregar?</p>
              <div className="grid grid-cols-5 gap-2">
                {moodIcons.map((Icon, i) => {
                  const value = i + 1;
                  const selected = moodBefore === value;
                  return (
                    <button
                      key={i}
                      onClick={() => setMoodBefore(value)}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                        selected ? 'bg-violet-500 border-violet-500' : 'bg-violet-50 border-violet-100 hover:border-violet-300'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${selected ? 'text-white' : 'text-violet-500'}`} />
                      <span className={`text-[10px] font-semibold ${selected ? 'text-white' : 'text-violet-700'}`}>
                        {['Mal', 'Mal', 'OK', 'Bem', 'Ótimo'][i]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brain dump textarea */}
            <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-violet-950">O que está na sua cabeça?</h3>
                  <p className="text-xs text-gray-500">Escreva livre. Tudo. Sem editar.</p>
                </div>
                <button
                  onClick={handlePremiumAudio}
                  className="flex items-center gap-2 px-3 py-2 bg-violet-100 hover:bg-violet-200 rounded-xl text-xs font-bold text-violet-700 transition-colors"
                  title="Gravar áudio (Premium)"
                >
                  <Mic className="w-4 h-4" />
                  <span>Áudio</span>
                  <Lock className="w-3 h-3" />
                </button>
              </div>

              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Comece a escrever... pensamentos, tarefas, preocupações, ideias. Sem ordem, sem filtro. O importante é tirar da cabeça."
                rows={14}
                className="w-full p-4 rounded-2xl border-2 border-violet-100 focus:border-violet-500 focus:outline-none text-violet-950 placeholder:text-gray-400 resize-none"
              />

              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-gray-500">{rawText.trim().length} caracteres</p>
                <button
                  onClick={handleSave}
                  disabled={!rawText.trim() || saving}
                  className="px-6 py-3 bg-violet-500 text-white font-bold rounded-2xl hover:bg-violet-600 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-violet-500/20"
                >
                  {saving ? 'Salvando...' : (
                    <>
                      <Moon className="w-4 h-4" />
                      {todayEntry ? 'Atualizar' : 'Esvaziar a mente (+20 XP)'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Mood depois */}
            {todayEntry && (
              <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg">
                <p className="text-sm font-bold text-violet-950 mb-3">Como você se sente agora?</p>
                <div className="grid grid-cols-5 gap-2">
                  {moodIcons.map((Icon, i) => {
                    const value = i + 1;
                    const selected = moodAfter === value;
                    return (
                      <button
                        key={i}
                        onClick={() => { setMoodAfter(value); handleSave(); }}
                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                          selected ? 'bg-emerald-500 border-emerald-500' : 'bg-emerald-50 border-emerald-100 hover:border-emerald-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 ${selected ? 'text-white' : 'text-emerald-600'}`} />
                        <span className={`text-[10px] font-semibold ${selected ? 'text-white' : 'text-emerald-700'}`}>
                          {['Mal', 'Mal', 'OK', 'Bem', 'Ótimo'][i]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {moodAfter > 0 && moodBefore > 0 && (
                  <p className="text-xs text-gray-500 mt-3">
                    {moodAfter > moodBefore
                      ? `Você melhorou ${moodAfter - moodBefore} ponto${moodAfter - moodBefore > 1 ? 's' : ''} ao esvaziar a mente.`
                      : moodAfter === moodBefore
                      ? 'Estável. Mas pelo menos está fora da sua cabeça agora.'
                      : 'Às vezes escrever ativa o que estava reprimido. Respira. Amanhã é outro dia.'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: prompts + premium upsell + history */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Prompts */}
            <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-violet-950">Perguntas pra ativar</h3>
                <button
                  onClick={() => setShowPromptHelpers(!showPromptHelpers)}
                  className="text-xs font-bold text-violet-500 hover:text-violet-700"
                >
                  {showPromptHelpers ? 'Esconder' : 'Mostrar'}
                </button>
              </div>
              {showPromptHelpers && (
                <div className="space-y-2">
                  {prompts.map((p) => {
                    const Icon = iconMap[p.icon_name] ?? Lightbulb;
                    return (
                      <motion.button
                        key={p.code}
                        whileHover={{ x: 3 }}
                        onClick={() => addPromptToText(p)}
                        className="w-full text-left flex items-center gap-3 p-3 bg-violet-50 rounded-xl border border-violet-100 hover:border-violet-300 hover:shadow-md transition-all"
                      >
                        <Icon className="w-5 h-5 text-violet-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-violet-950">{p.prompt_pt}</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Premium upsell */}
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-700 rounded-3xl p-6 shadow-lg shadow-violet-500/30">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Premium em breve</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Áudio + IA</h3>
                <p className="text-sm text-white/85 mb-4">
                  Grava sua voz. ZENO transcreve, organiza por categoria, identifica preocupações recorrentes,
                  e te ajuda com perguntas que talvez você esqueceu. Tudo enquanto você fala olhando o teto.
                </p>
                <ul className="space-y-1.5 text-xs text-white/85">
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-yellow-300" /> Gravação de até 10 min</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-yellow-300" /> Transcrição automática</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-yellow-300" /> Categorização inteligente</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-yellow-300" /> Perguntas que faltaram</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-yellow-300" /> Histórico analítico preditivo</li>
                </ul>
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg">
                <h3 className="text-lg font-bold text-violet-950 mb-3">Últimas 7 noites</h3>
                <div className="space-y-2">
                  {history.slice(0, 7).map((h) => (
                    <div key={h.id} className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-violet-200 flex items-center justify-center flex-shrink-0">
                        <Moon className="w-4 h-4 text-violet-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-violet-950">
                          {new Date(h.entry_date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}
                        </p>
                        <p className="text-[10px] text-gray-500">{h.raw_text?.split(' ').length || 0} palavras descarregadas</p>
                      </div>
                      {h.mood_after && h.mood_before && h.mood_after > h.mood_before && (
                        <span className="text-xs font-bold text-emerald-600">+{h.mood_after - h.mood_before}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
