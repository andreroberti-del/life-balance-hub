import { useState, useEffect, useCallback } from "react";
import {
  Scale,
  Ruler,
  Moon,
  Droplets,
  Pill,
  Heart,
  Activity,
  FileText,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Star,
  Zap,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";

interface CheckInData {
  weight: string;
  waist: string;
  sleep_quality: number;
  water_liters: number;
  took_omega: boolean;
  blood_pressure_sys: string;
  blood_pressure_dia: string;
  glucose: string;
  notes: string;
}

interface HistoryEntry {
  id: string;
  check_date: string;
  weight: number | null;
  waist: number | null;
  sleep_quality: number | null;
  water_liters: number | null;
  took_omega: boolean;
  blood_pressure_sys: number | null;
  blood_pressure_dia: number | null;
  glucose: number | null;
  notes: string | null;
}

const WATER_QUICK_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3];

const defaultData: CheckInData = {
  weight: "",
  waist: "",
  sleep_quality: 0,
  water_liters: 0,
  took_omega: false,
  blood_pressure_sys: "",
  blood_pressure_dia: "",
  glucose: "",
  notes: "",
};

export function CheckIn() {
  const { user } = useAuth();
  const [form, setForm] = useState<CheckInData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyOpen, setHistoryOpen] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const loadTodayCheckin = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const { data, error: fetchError } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", user.id)
        .eq("check_date", today)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setIsEditMode(true);
        setForm({
          weight: data.weight?.toString() || "",
          waist: data.waist?.toString() || "",
          sleep_quality: data.sleep_quality || 0,
          water_liters: data.water_liters || 0,
          took_omega: data.took_omega || false,
          blood_pressure_sys: data.blood_pressure_sys?.toString() || "",
          blood_pressure_dia: data.blood_pressure_dia?.toString() || "",
          glucose: data.glucose?.toString() || "",
          notes: data.notes || "",
        });
      }
    } catch (err) {
      console.error("Error loading today's check-in:", err);
    } finally {
      setLoading(false);
    }
  }, [user, today]);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error: fetchError } = await supabase
        .from("daily_checkins")
        .select("*")
        .eq("user_id", user.id)
        .order("check_date", { ascending: false })
        .limit(7);

      if (fetchError) throw fetchError;
      setHistory(data || []);
    } catch (err) {
      console.error("Error loading history:", err);
    }
  }, [user]);

  useEffect(() => {
    loadTodayCheckin();
    loadHistory();
  }, [loadTodayCheckin, loadHistory]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const payload = {
        user_id: user.id,
        check_date: today,
        weight: form.weight ? parseFloat(form.weight) : null,
        waist: form.waist ? parseFloat(form.waist) : null,
        sleep_quality: form.sleep_quality || null,
        water_liters: form.water_liters || null,
        took_omega: form.took_omega,
        blood_pressure_sys: form.blood_pressure_sys
          ? parseInt(form.blood_pressure_sys)
          : null,
        blood_pressure_dia: form.blood_pressure_dia
          ? parseInt(form.blood_pressure_dia)
          : null,
        glucose: form.glucose ? parseFloat(form.glucose) : null,
        notes: form.notes || null,
      };

      const { error: upsertError } = await supabase
        .from("daily_checkins")
        .upsert(payload, { onConflict: "user_id,check_date" });

      if (upsertError) throw upsertError;

      setSaved(true);
      setIsEditMode(true);
      loadHistory();
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save check-in";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    const todayDate = new Date(today + "T00:00:00");
    const diffDays = Math.round(
      (todayDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">
        {/* HERO */}
        <div className="relative overflow-hidden bg-violet-500 rounded-3xl p-8 md:p-10 mb-8 shadow-xl shadow-violet-500/20">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-20 w-56 h-56 bg-violet-300/30 rounded-full blur-3xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-white/80 text-sm font-medium mb-2 uppercase tracking-wider">Daily Wellness</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
                Daily Check-in
              </h1>
              <p className="text-white/85 text-base max-w-md">
                {isEditMode ? "Update today's health metrics" : "Log your daily health metrics to earn +20 XP and keep your streak alive."}
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-6 py-5 border border-white/20">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-300" strokeWidth={2.5} />
                <div>
                  <div className="text-3xl font-bold text-white leading-none">+20</div>
                  <div className="text-xs text-white/70 mt-1">XP reward</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Body Measurements */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-sm font-bold text-violet-950 uppercase tracking-wider mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                Body Measurements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                    <Scale className="w-4 h-4" /> Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 88.5"
                    value={form.weight}
                    onChange={(e) =>
                      setForm({ ...form, weight: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-violet-950 font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                    <Ruler className="w-4 h-4" /> Waist (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 96"
                    value={form.waist}
                    onChange={(e) =>
                      setForm({ ...form, waist: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-violet-950 font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Sleep Quality */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-sm font-bold text-violet-950 uppercase tracking-wider mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                Sleep Quality
              </h3>
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-400" />
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => setForm({ ...form, sleep_quality: val })}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all font-bold text-sm ${
                        form.sleep_quality >= val
                          ? "bg-violet-500 text-white"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      }`}
                    >
                      <Star
                        className={`w-5 h-5 ${form.sleep_quality >= val ? "fill-[#1a1a1a]" : ""}`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-500 ml-2">
                  {form.sleep_quality > 0
                    ? `${form.sleep_quality}/5`
                    : "Not rated"}
                </span>
              </div>
            </div>

            {/* Water Intake */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-sm font-bold text-violet-950 uppercase tracking-wider mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                Water Intake
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <Droplets className="w-5 h-5 text-gray-400" />
                <span className="text-3xl font-bold text-violet-950">
                  {form.water_liters.toFixed(1)}
                </span>
                <span className="text-lg text-gray-400">liters</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {WATER_QUICK_OPTIONS.map((val) => (
                  <button
                    key={val}
                    onClick={() => setForm({ ...form, water_liters: val })}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      form.water_liters === val
                        ? "bg-violet-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {val}L
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.water_liters}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      water_liters: parseFloat(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6366F1]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0L</span>
                  <span>2.5L</span>
                  <span>5L</span>
                </div>
              </div>
            </div>

            {/* Omega Supplement */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Pill className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="text-sm font-bold text-violet-950">
                      Omega Supplement
                    </h3>
                    <p className="text-xs text-gray-400">
                      Did you take your omega supplement today?
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setForm({ ...form, took_omega: !form.took_omega })
                  }
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    form.took_omega ? "bg-violet-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform ${
                      form.took_omega ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Optional: Blood Pressure & Glucose */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-sm font-bold text-violet-950 uppercase tracking-wider mb-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                Medical Metrics
              </h3>
              <p className="text-xs text-gray-400 mb-5">Optional</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4" /> Systolic (mmHg)
                  </label>
                  <input
                    type="number"
                    placeholder="120"
                    value={form.blood_pressure_sys}
                    onChange={(e) =>
                      setForm({ ...form, blood_pressure_sys: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-violet-950 font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4" /> Diastolic (mmHg)
                  </label>
                  <input
                    type="number"
                    placeholder="80"
                    value={form.blood_pressure_dia}
                    onChange={(e) =>
                      setForm({ ...form, blood_pressure_dia: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-violet-950 font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Glucose (mg/dL)
                  </label>
                  <input
                    type="number"
                    placeholder="95"
                    value={form.glucose}
                    onChange={(e) =>
                      setForm({ ...form, glucose: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-violet-950 font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-sm font-bold text-violet-950 uppercase tracking-wider mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                Notes
              </h3>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 mt-3" />
                <textarea
                  placeholder="How are you feeling today? Any observations..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-violet-950 font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex flex-col gap-3">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
                  {error}
                </div>
              )}
              {saved && (
                <div className="bg-violet-500/20 border border-violet-500/40 rounded-xl px-4 py-3 text-sm text-violet-950 font-medium flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Check-in saved successfully!
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-violet-500 text-white py-4 rounded-2xl font-bold text-sm hover:bg-violet-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? (
                  "Update Check-in"
                ) : (
                  "Save Check-in"
                )}
              </button>
            </div>
          </div>

          {/* Right Column - History */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <div className="bg-violet-500 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Check className="w-4 h-4 text-violet-500" />
                </div>
                <h3 className="text-sm font-bold text-violet-950">
                  Today's Status
                </h3>
              </div>
              <p className="text-xs text-violet-950/70 leading-relaxed">
                {isEditMode
                  ? "You've already logged today's check-in. You can update it anytime."
                  : "You haven't logged today's check-in yet. Fill in the form to track your progress."}
              </p>
            </div>

            {/* Recent History */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="flex items-center justify-between w-full mb-4"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                  <h3 className="text-sm font-bold text-violet-950">
                    Recent Check-ins
                  </h3>
                </div>
                {historyOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {historyOpen && (
                <div className="space-y-3">
                  {history.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">
                      No check-ins yet. Start tracking today!
                    </p>
                  ) : (
                    history.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-4 rounded-xl bg-gray-50 border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-violet-950">
                            {formatDate(entry.check_date)}
                          </span>
                          {entry.took_omega && (
                            <span className="px-2 py-0.5 bg-violet-500/20 text-[10px] font-bold text-violet-950 rounded-md">
                              OMEGA
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                          {entry.weight && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Weight</span>
                              <span className="font-semibold text-violet-950">
                                {entry.weight} kg
                              </span>
                            </div>
                          )}
                          {entry.waist && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Waist</span>
                              <span className="font-semibold text-violet-950">
                                {entry.waist} cm
                              </span>
                            </div>
                          )}
                          {entry.sleep_quality && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Sleep</span>
                              <span className="font-semibold text-violet-950">
                                {entry.sleep_quality}/5
                              </span>
                            </div>
                          )}
                          {entry.water_liters && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Water</span>
                              <span className="font-semibold text-violet-950">
                                {entry.water_liters}L
                              </span>
                            </div>
                          )}
                          {entry.blood_pressure_sys && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">BP</span>
                              <span className="font-semibold text-violet-950">
                                {entry.blood_pressure_sys}/
                                {entry.blood_pressure_dia}
                              </span>
                            </div>
                          )}
                          {entry.glucose && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Glucose</span>
                              <span className="font-semibold text-violet-950">
                                {entry.glucose}
                              </span>
                            </div>
                          )}
                        </div>
                        {entry.notes && (
                          <p className="text-xs text-gray-500 mt-2 italic truncate">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-violet-500 rounded-2xl p-5 text-white">
              <h3 className="text-sm font-bold mb-3">Tracking Tips</h3>
              <div className="space-y-3 text-xs text-gray-400">
                <p>
                  Weigh yourself at the same time daily, preferably in the
                  morning before eating.
                </p>
                <p>
                  Measure your waist at the navel level, standing relaxed
                  without sucking in.
                </p>
                <p>
                  Consistency is key -- even partial entries help track your
                  progress over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
