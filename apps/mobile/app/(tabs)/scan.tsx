import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';
import { ScanResult, IngredientAnalysis } from '../../types';
import { useAuth } from '../../lib/AuthContext';
import { saveScanResult, getScanHistory } from '../../lib/api';

const mockScanResults: ScanResult[] = [
  {
    id: '1',
    productName: 'Granola Natural Graos',
    score: 82,
    verdict: 'good',
    ingredients: [
      { name: 'Aveia integral', score: 'good', tag: 'Anti-inflamatorio' },
      { name: 'Mel organico', score: 'moderate', tag: 'Acucar natural' },
      { name: 'Castanha do Para', score: 'good', tag: 'Selenio' },
      { name: 'Linhaca', score: 'good', tag: 'Omega-3 vegetal' },
    ],
    personalImpact: 'Boa escolha para o seu protocolo anti-inflamatorio.',
    suggestion: null,
    scannedAt: '2026-03-17T10:30:00',
  },
  {
    id: '2',
    productName: 'Iogurte Grego Zero',
    score: 65,
    verdict: 'moderate',
    ingredients: [
      { name: 'Leite desnatado', score: 'moderate', tag: 'Lacteo' },
      { name: 'Proteina do soro', score: 'good', tag: 'Proteina' },
      { name: 'Sucralose', score: 'bad', tag: 'Adocante artificial' },
      { name: 'Amido modificado', score: 'moderate', tag: 'Processado' },
    ],
    personalImpact: 'Sucralose pode interferir no microbioma intestinal.',
    suggestion: 'Prefira iogurte natural integral sem adocantes.',
    scannedAt: '2026-03-16T14:20:00',
  },
  {
    id: '3',
    productName: 'Refrigerante Diet Cola',
    score: 18,
    verdict: 'avoid',
    ingredients: [
      { name: 'Aspartame', score: 'bad', tag: 'Adocante artificial' },
      { name: 'Acido fosforico', score: 'bad', tag: 'Desmineralizacao' },
      { name: 'Corante caramelo IV', score: 'bad', tag: 'Potencial carcinogenico' },
      { name: 'Cafeina', score: 'moderate', tag: 'Estimulante' },
    ],
    personalImpact: 'Alta carga de substancias pro-inflamatorias. Evitar.',
    suggestion: 'Substitua por agua com gas e limao.',
    scannedAt: '2026-03-15T09:45:00',
  },
];

function getScoreColor(score: number) {
  if (score >= 70) return Colors.green;
  if (score >= 40) return Colors.orange;
  return Colors.red;
}

function getScoreBg(score: number) {
  if (score >= 70) return 'rgba(76,175,80,0.15)';
  if (score >= 40) return Colors.orangeBg;
  return Colors.redBg;
}

function getVerdictLabel(verdict: ScanResult['verdict']) {
  switch (verdict) {
    case 'excellent': return 'Excelente';
    case 'good': return 'Bom';
    case 'moderate': return 'Moderado';
    case 'avoid': return 'Evitar';
  }
}

function getIngredientColor(score: IngredientAnalysis['score']) {
  switch (score) {
    case 'good': return Colors.green;
    case 'moderate': return Colors.orange;
    case 'bad': return Colors.red;
  }
}

function getIngredientBg(score: IngredientAnalysis['score']) {
  switch (score) {
    case 'good': return 'rgba(76,175,80,0.15)';
    case 'moderate': return Colors.orangeBg;
    case 'bad': return Colors.redBg;
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
}

// Convert Supabase scan_results row to ScanResult type for display
function dbScanToScanResult(dbScan: any): ScanResult {
  return {
    id: dbScan.id,
    productName: dbScan.product_name,
    score: dbScan.score || 0,
    verdict: dbScan.verdict || 'moderate',
    ingredients: [], // ingredients stored separately, not loaded here
    personalImpact: dbScan.personal_impact || '',
    suggestion: dbScan.suggestion || null,
    scannedAt: dbScan.scanned_at,
  };
}

export default function ScanScreen() {
  const { user } = useAuth();
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);
  const [showMockResult, setShowMockResult] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>(mockScanResults);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadScanHistory = useCallback(async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }

      const history = await getScanHistory(10);
      if (history && history.length > 0) {
        const mapped = history.map(dbScanToScanResult);
        setScanResults(mapped);
      }
      // If empty, keep mock data
    } catch {
      // fallback to mock
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadScanHistory();
  }, [loadScanHistory]);

  useFocusEffect(
    useCallback(() => {
      loadScanHistory();
    }, [loadScanHistory])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadScanHistory();
  }, [loadScanHistory]);

  async function handleScan() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissao necessaria', 'Precisamos de acesso a camera para escanear rotulos.');
      // Show mock result anyway for demo
      setSelectedScan(mockScanResults[0]);
      setShowMockResult(true);
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (result.canceled) return;

      // For now, show mock analysis and save to Supabase
      const mockResult = mockScanResults[0];
      setSelectedScan(mockResult);
      setShowMockResult(true);

      // Save to Supabase if user is logged in
      if (user) {
        try {
          await saveScanResult(
            {
              product_name: mockResult.productName,
              score: mockResult.score,
              verdict: mockResult.verdict,
              personal_impact: mockResult.personalImpact,
              suggestion: mockResult.suggestion,
              barcode: null,
              image_url: result.assets?.[0]?.uri || null,
            },
            mockResult.ingredients.map(ing => ({
              name: ing.name,
              score: ing.score,
              tag: ing.tag,
            }))
          );
          // Reload history
          loadScanHistory();
        } catch {}
      }
    } catch {
      // Show mock result on error too
      setSelectedScan(mockScanResults[0]);
      setShowMockResult(true);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.lime}
            colors={[Colors.lime]}
          />
        }
      >
        <Text style={styles.header}>Scanner de Rotulos</Text>

        {/* Scan Button */}
        <TouchableOpacity style={styles.scanButton} onPress={handleScan} activeOpacity={0.8}>
          <View style={styles.scanIconContainer}>
            <Ionicons name="camera" size={48} color={Colors.dark} />
          </View>
          <Text style={styles.scanButtonText}>Tire uma foto do rotulo</Text>
        </TouchableOpacity>

        {/* Info Text */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.white50} />
          <Text style={styles.infoText}>
            A IA vai analisar os ingredientes e avaliar o impacto no seu perfil anti-inflamatorio
          </Text>
        </View>

        {/* Mock Result (shown after scan) */}
        {showMockResult && selectedScan && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={[styles.scoreCircle, { backgroundColor: getScoreBg(selectedScan.score) }]}>
                <Text style={[styles.scoreText, { color: getScoreColor(selectedScan.score) }]}>
                  {selectedScan.score}
                </Text>
              </View>
              <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{selectedScan.productName}</Text>
                <Text style={[styles.resultVerdict, { color: getScoreColor(selectedScan.score) }]}>
                  {getVerdictLabel(selectedScan.verdict)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowMockResult(false)}>
                <Ionicons name="close-circle" size={24} color={Colors.white30} />
              </TouchableOpacity>
            </View>

            <Text style={styles.resultImpact}>{selectedScan.personalImpact}</Text>
            {selectedScan.suggestion && (
              <View style={styles.suggestionBox}>
                <Ionicons name="bulb-outline" size={16} color={Colors.lime} />
                <Text style={styles.suggestionText}>{selectedScan.suggestion}</Text>
              </View>
            )}

            {/* Ingredients */}
            {selectedScan.ingredients.length > 0 && (
              <>
                <Text style={styles.ingredientsTitle}>Ingredientes Analisados</Text>
                {selectedScan.ingredients.map((ing, i) => (
                  <View key={i} style={styles.ingredientRow}>
                    <View style={[styles.ingredientDot, { backgroundColor: getIngredientColor(ing.score) }]} />
                    <Text style={styles.ingredientName}>{ing.name}</Text>
                    <View style={[styles.ingredientTag, { backgroundColor: getIngredientBg(ing.score) }]}>
                      <Text style={[styles.ingredientTagText, { color: getIngredientColor(ing.score) }]}>
                        {ing.tag}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {/* Recent Scans */}
        <Text style={styles.sectionTitle}>Ultimos scans</Text>
        {loading ? (
          <ActivityIndicator size="small" color={Colors.lime} style={{ marginVertical: Spacing.lg }} />
        ) : (
          scanResults.map((scan) => (
            <TouchableOpacity
              key={scan.id}
              style={styles.scanResultCard}
              onPress={() => {
                setSelectedScan(scan);
                setShowMockResult(true);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.scoreCircleSmall, { backgroundColor: getScoreBg(scan.score) }]}>
                <Text style={[styles.scoreTextSmall, { color: getScoreColor(scan.score) }]}>
                  {scan.score}
                </Text>
              </View>
              <View style={styles.scanResultInfo}>
                <Text style={styles.scanResultName}>{scan.productName}</Text>
                <Text style={[styles.scanResultVerdict, { color: getScoreColor(scan.score) }]}>
                  {getVerdictLabel(scan.verdict)}
                </Text>
              </View>
              <Text style={styles.scanResultDate}>{formatDate(scan.scannedAt)}</Text>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  header: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
  },

  // Scan Button
  scanButton: {
    backgroundColor: Colors.lime,
    borderRadius: Radius.lg,
    padding: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  scanButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },

  // Info
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    backgroundColor: Colors.white08,
    borderRadius: Radius.lg,
  },
  infoText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.white50,
    lineHeight: 20,
  },

  // Result Card
  resultCard: {
    backgroundColor: Colors.dark3,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  scoreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  scoreText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: 2,
  },
  resultVerdict: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  resultImpact: {
    fontSize: FontSize.md,
    color: Colors.white70,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  suggestionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.limeBg2,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  suggestionText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.lime,
    lineHeight: 18,
  },

  // Ingredients
  ingredientsTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white08,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  ingredientName: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.white70,
  },
  ingredientTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  ingredientTagText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },

  // Section
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },

  // Scan Result Cards
  scanResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark3,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  scoreCircleSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  scoreTextSmall: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.extrabold,
  },
  scanResultInfo: {
    flex: 1,
  },
  scanResultName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
    marginBottom: 2,
  },
  scanResultVerdict: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  scanResultDate: {
    fontSize: FontSize.sm,
    color: Colors.white30,
  },
});
