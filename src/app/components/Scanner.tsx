import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Camera,
  Upload,
  Loader2,
  X,
  ImageIcon,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";

interface ScanResult {
  id: string;
  product_name: string;
  brand: string | null;
  score: number;
  verdict: string;
  photo_url: string | null;
  ai_analysis: {
    summary?: string;
    ingredients?: Array<{
      name: string;
      category: "GOOD" | "BAD" | "NEUTRAL";
      impact: string;
    }>;
  } | null;
  created_at: string;
}

const mockScanHistory = [
  {
    id: "mock-1",
    product_name: "Extra Virgin Olive Oil",
    brand: "Gallo",
    score: 92,
    verdict: "GOOD",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    photo_url: null,
    ai_analysis: {
      summary: "Excellent source of healthy fats",
      ingredients: [
        {
          name: "Extra virgin olive oil",
          category: "GOOD" as const,
          impact: "Anti-inflammatory, healthy fats",
        },
        {
          name: "Natural antioxidants",
          category: "GOOD" as const,
          impact: "Cell protection",
        },
      ],
    },
  },
  {
    id: "mock-2",
    product_name: "Ruffles Original Chips",
    brand: "Lay's",
    score: 18,
    verdict: "BAD",
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    photo_url: null,
    ai_analysis: {
      summary: "High in inflammatory oils and sodium",
      ingredients: [
        {
          name: "Soybean oil",
          category: "BAD" as const,
          impact: "High Omega-6, inflammatory",
        },
        {
          name: "High sodium",
          category: "BAD" as const,
          impact: "Blood pressure risk",
        },
        {
          name: "Sunflower oil",
          category: "BAD" as const,
          impact: "Processed, high Omega-6",
        },
      ],
    },
  },
  {
    id: "mock-3",
    product_name: "Wild Caught Salmon",
    brand: "Fresh Market",
    score: 95,
    verdict: "GOOD",
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    photo_url: null,
    ai_analysis: {
      summary: "Outstanding source of Omega-3",
      ingredients: [
        {
          name: "Wild salmon",
          category: "GOOD" as const,
          impact: "High Omega-3, reduces inflammation",
        },
        {
          name: "No additives",
          category: "GOOD" as const,
          impact: "Clean, unprocessed",
        },
      ],
    },
  },
  {
    id: "mock-4",
    product_name: "Granola Bar",
    brand: "Nature Valley",
    score: 32,
    verdict: "BAD",
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    photo_url: null,
    ai_analysis: {
      summary: "Contains multiple inflammatory ingredients",
      ingredients: [
        {
          name: "High fructose corn syrup",
          category: "BAD" as const,
          impact: "Metabolic disruption",
        },
        {
          name: "Canola oil",
          category: "BAD" as const,
          impact: "Processed, high Omega-6",
        },
        {
          name: "Sugar",
          category: "BAD" as const,
          impact: "Inflammatory, insulin spike",
        },
      ],
    },
  },
];

const ingredientGuide = [
  { name: "Soybean Oil", type: "BAD", impact: "High Omega-6, inflammatory" },
  {
    name: "High Fructose Corn Syrup",
    type: "BAD",
    impact: "Metabolic disruption",
  },
  { name: "Canola Oil", type: "BAD", impact: "Processed, high Omega-6" },
  { name: "Palm Oil", type: "BAD", impact: "Saturated fat, inflammatory" },
  {
    name: "Extra Virgin Olive Oil",
    type: "GOOD",
    impact: "Anti-inflammatory, healthy fats",
  },
  {
    name: "Turmeric",
    type: "GOOD",
    impact: "Powerful anti-inflammatory",
  },
  {
    name: "Wild Salmon",
    type: "GOOD",
    impact: "High Omega-3, reduces inflammation",
  },
  {
    name: "Avocado",
    type: "GOOD",
    impact: "Healthy fats, anti-inflammatory",
  },
];

type FilterType = "ALL" | "GOOD" | "BAD";

export function Scanner() {
  const [selectedScan, setSelectedScan] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [hasRealData, setHasRealData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  const { user } = useAuth();

  const loadScanHistory = useCallback(async () => {
    if (!user) {
      setScanHistory(mockScanHistory);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("scan_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      if (data && data.length > 0) {
        setScanHistory(data);
        setHasRealData(true);
      } else {
        setScanHistory(mockScanHistory);
        setHasRealData(false);
      }
    } catch (err) {
      console.error("Error loading scan history:", err);
      setScanHistory(mockScanHistory);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadScanHistory();
  }, [loadScanHistory]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setPreviewImage(reader.result as string);
      setScanModalOpen(true);
      setScanError(null);
      setScanResult(null);
      handleScan(base64);
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleScan = async (base64Image: string) => {
    setScanning(true);
    setScanError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("You must be logged in to scan products");
      }

      const supabaseUrl =
        import.meta.env.VITE_SUPABASE_URL ||
        "https://yrlwxqjvisjulcnilcyb.supabase.co";

      const res = await fetch(`${supabaseUrl}/functions/v1/scan-food`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error("Scan API error:", res.status, errorBody);
        throw new Error("AI Scanner coming soon -- try again later");
      }

      const result = await res.json();
      setScanResult(result);
      loadScanHistory();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "AI Scanner coming soon -- try again later";
      setScanError(message);
    } finally {
      setScanning(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.round(
      (now.getTime() - date.getTime()) / (1000 * 3600)
    );
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const filteredHistory =
    filter === "ALL"
      ? scanHistory
      : scanHistory.filter((s) => s.verdict === filter);

  const stats = {
    total: scanHistory.length,
    good: scanHistory.filter((s) => s.verdict === "GOOD").length,
    bad: scanHistory.filter((s) => s.verdict === "BAD").length,
    rate:
      scanHistory.length > 0
        ? Math.round(
            (scanHistory.filter((s) => s.verdict === "GOOD").length /
              scanHistory.length) *
              100
          )
        : 0,
  };

  return (
    <div className="min-h-screen p-6 md:p-8 bg-[#FAFAFA]">
      <div className="max-w-[1600px] mx-auto">
        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-[#1a1a1a]">
                {t.scanner.title}
              </h1>
              <div className="w-2 h-2 rounded-full bg-[#D4FF00]"></div>
            </div>
            <p className="text-sm text-gray-400">{t.scanner.subtitle}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-3 bg-[#1a1a1a] text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-black transition-all shadow-lg"
            >
              <Camera className="w-5 h-5" />
              {t.scanner.scanProduct}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 bg-white text-[#1a1a1a] px-6 py-3.5 rounded-2xl font-bold border border-gray-200 hover:border-gray-300 transition-all"
            >
              <Upload className="w-5 h-5" />
              Upload
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">{t.scanner.totalScans}</p>
            <p className="text-4xl font-bold text-[#1a1a1a]">{stats.total}</p>
            {!hasRealData && (
              <p className="text-[10px] text-gray-300 mt-1">Example data</p>
            )}
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">
              {t.scanner.goodChoices}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-[#1a1a1a]">{stats.good}</p>
              <span className="text-sm text-[#D4FF00] font-bold">
                {stats.rate}%
              </span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">{t.scanner.avoided}</p>
            <p className="text-4xl font-bold text-[#1a1a1a]">{stats.bad}</p>
          </div>
          <div className="bg-[#D4FF00] rounded-2xl p-5">
            <p className="text-sm text-black/70 mb-2 font-semibold">
              {t.scanner.successRate}
            </p>
            <p className="text-4xl font-bold text-[#1a1a1a]">{stats.rate}%</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Scan History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#1a1a1a]">
                  {t.scanner.scanHistory}
                </h3>
                <div className="flex gap-2">
                  {(["ALL", "GOOD", "BAD"] as FilterType[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        filter === f
                          ? "bg-[#1a1a1a] text-white"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {f === "ALL"
                        ? t.scanner.all
                        : f === "GOOD"
                          ? t.scanner.good
                          : t.scanner.bad}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <ImageIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">
                        No scans found. Scan a product to get started!
                      </p>
                    </div>
                  ) : (
                    filteredHistory.map((scan) => (
                      <div
                        key={scan.id}
                        onClick={() =>
                          setSelectedScan(
                            selectedScan === scan.id ? null : scan.id
                          )
                        }
                        className="p-5 rounded-2xl border-2 border-gray-100 hover:border-black/20 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-4 flex-1">
                            <div
                              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                                scan.verdict === "GOOD"
                                  ? "bg-[#D4FF00] text-[#1a1a1a]"
                                  : "bg-[#1a1a1a] text-white"
                              }`}
                            >
                              {scan.score}
                            </div>
                            <div className="flex-1">
                              <div
                                className={`inline-block px-3 py-1 rounded-lg text-xs font-bold mb-2 ${
                                  scan.verdict === "GOOD"
                                    ? "bg-[#D4FF00]/20 text-[#1a1a1a]"
                                    : "bg-[#1a1a1a]/10 text-[#1a1a1a]"
                                }`}
                              >
                                {scan.verdict}
                              </div>
                              <h4 className="font-bold text-[#1a1a1a] text-lg mb-1">
                                {scan.product_name}
                              </h4>
                              <div className="flex items-center gap-3">
                                {scan.brand && (
                                  <p className="text-sm text-gray-500">
                                    {scan.brand}
                                  </p>
                                )}
                                <span className="text-xs text-gray-400">
                                  {formatTime(scan.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                          {scan.verdict === "GOOD" ? (
                            <CheckCircle className="w-6 h-6 text-[#D4FF00]" />
                          ) : (
                            <XCircle className="w-6 h-6 text-[#1a1a1a]" />
                          )}
                        </div>

                        {/* Expanded Details */}
                        {selectedScan === scan.id &&
                          scan.ai_analysis?.ingredients && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              {scan.ai_analysis.summary && (
                                <p className="text-sm text-gray-600 mb-4">
                                  {scan.ai_analysis.summary}
                                </p>
                              )}
                              {scan.ai_analysis.ingredients.filter(
                                (i) => i.category === "BAD"
                              ).length > 0 && (
                                <div className="mb-4">
                                  <p className="text-xs font-bold text-[#1a1a1a] mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {t.scanner.inflammatoryFlags}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {scan.ai_analysis.ingredients
                                      .filter((i) => i.category === "BAD")
                                      .map((ing, i) => (
                                        <span
                                          key={i}
                                          className="px-3 py-1.5 bg-[#1a1a1a]/5 text-[#1a1a1a] rounded-xl text-xs font-semibold"
                                        >
                                          {ing.name}
                                        </span>
                                      ))}
                                  </div>
                                </div>
                              )}
                              <div className="space-y-2">
                                {scan.ai_analysis.ingredients.map((ing, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-gray-700"
                                  >
                                    {ing.category === "GOOD" ? (
                                      <CheckCircle className="w-4 h-4 text-[#D4FF00] flex-shrink-0" />
                                    ) : ing.category === "BAD" ? (
                                      <XCircle className="w-4 h-4 text-[#1a1a1a] flex-shrink-0" />
                                    ) : (
                                      <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    )}
                                    <span className="font-medium">
                                      {ing.name}
                                    </span>
                                    <span className="text-gray-400">--</span>
                                    <span className="text-xs text-gray-500">
                                      {ing.impact}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Ingredient Guide */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm">
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-6">
                {t.scanner.ingredientGuide}
              </h3>
              <div className="mb-6">
                <h4 className="text-sm font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  {t.scanner.avoidThese}
                </h4>
                <div className="space-y-3">
                  {ingredientGuide
                    .filter((i) => i.type === "BAD")
                    .map((ing, idx) => (
                      <div key={idx} className="p-4 bg-[#1a1a1a]/5 rounded-xl">
                        <p className="text-sm font-bold text-[#1a1a1a] mb-1">
                          {ing.name}
                        </p>
                        <p className="text-xs text-gray-600">{ing.impact}</p>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {t.scanner.chooseThese}
                </h4>
                <div className="space-y-3">
                  {ingredientGuide
                    .filter((i) => i.type === "GOOD")
                    .map((ing, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-[#D4FF00]/10 rounded-xl border border-[#D4FF00]/20"
                      >
                        <p className="text-sm font-bold text-[#1a1a1a] mb-1">
                          {ing.name}
                        </p>
                        <p className="text-xs text-gray-700">{ing.impact}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Zeno Insight */}
            <div className="bg-[#D4FF00] rounded-3xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <h4 className="text-lg font-bold text-[#1a1a1a]">
                  {t.scanner.zenoInsight}
                </h4>
              </div>
              <p className="text-sm text-black/80 leading-relaxed">
                {t.scanner.zenoInsightText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Modal */}
      {scanModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#1a1a1a]">
                  Scan Result
                </h3>
                <button
                  onClick={() => {
                    setScanModalOpen(false);
                    setPreviewImage(null);
                    setScanResult(null);
                    setScanError(null);
                  }}
                  className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Image Preview */}
              {previewImage && (
                <div className="mb-6 rounded-2xl overflow-hidden border border-gray-200">
                  <img
                    src={previewImage}
                    alt="Scanned product"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* Scanning State */}
              {scanning && (
                <div className="text-center py-8">
                  <Loader2 className="w-10 h-10 animate-spin text-[#D4FF00] mx-auto mb-4" />
                  <p className="text-sm font-semibold text-[#1a1a1a]">
                    Analyzing ingredients...
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    ZENO AI is reviewing the product
                  </p>
                </div>
              )}

              {/* Error State */}
              {scanError && !scanning && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a] mb-2">
                    {scanError}
                  </p>
                  <p className="text-xs text-gray-400 mb-6">
                    The AI analysis feature is being deployed. Check back soon!
                  </p>
                  <button
                    onClick={() => {
                      setScanModalOpen(false);
                      setPreviewImage(null);
                      setScanError(null);
                    }}
                    className="px-6 py-3 bg-[#1a1a1a] text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
                  >
                    Got it
                  </button>
                </div>
              )}

              {/* Result State */}
              {scanResult && !scanning && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold ${
                        scanResult.verdict === "GOOD"
                          ? "bg-[#D4FF00] text-[#1a1a1a]"
                          : "bg-[#1a1a1a] text-white"
                      }`}
                    >
                      {scanResult.score}
                    </div>
                    <div>
                      <div
                        className={`inline-block px-3 py-1 rounded-lg text-xs font-bold mb-1 ${
                          scanResult.verdict === "GOOD"
                            ? "bg-[#D4FF00]/20 text-[#1a1a1a]"
                            : "bg-[#1a1a1a]/10 text-[#1a1a1a]"
                        }`}
                      >
                        {scanResult.verdict}
                      </div>
                      <h4 className="text-lg font-bold text-[#1a1a1a]">
                        {scanResult.product_name}
                      </h4>
                      {scanResult.brand && (
                        <p className="text-sm text-gray-500">
                          {scanResult.brand}
                        </p>
                      )}
                    </div>
                  </div>

                  {scanResult.ai_analysis?.summary && (
                    <p className="text-sm text-gray-600 mb-4 p-4 bg-gray-50 rounded-xl">
                      {scanResult.ai_analysis.summary}
                    </p>
                  )}

                  {scanResult.ai_analysis?.ingredients && (
                    <div className="space-y-2 mb-6">
                      {scanResult.ai_analysis.ingredients.map((ing, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm"
                        >
                          {ing.category === "GOOD" ? (
                            <CheckCircle className="w-4 h-4 text-[#D4FF00] flex-shrink-0" />
                          ) : ing.category === "BAD" ? (
                            <XCircle className="w-4 h-4 text-[#1a1a1a] flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          )}
                          <span className="font-medium text-[#1a1a1a]">
                            {ing.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {ing.impact}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setScanModalOpen(false);
                      setPreviewImage(null);
                      setScanResult(null);
                    }}
                    className="w-full py-3.5 bg-[#1a1a1a] text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
