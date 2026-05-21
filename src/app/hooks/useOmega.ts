import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';

export interface OmegaProduct {
  id: string;
  brand: string;
  product_name: string;
  slug: string;
  country_origin: string | null;
  epa_mg_per_serving: number;
  dha_mg_per_serving: number;
  total_omega3_mg: number;
  serving_caps: number;
  chemical_form: string;
  source: string;
  oxidation_totox: number | null;
  oxidation_grade: 'excellent' | 'good' | 'poor' | null;
  third_party_certified: string | null;
  price_per_month_usd: number | null;
  price_per_mg_epa: number | null;
  absorption_score: number | null;
  label_accuracy_score: number | null;
  heavy_metals_pass: boolean;
  is_benchmark: boolean;
  notes: string | null;
}

export interface Biomarker {
  marker_code: string;
  name_pt: string;
  name_en: string;
  what_is_pt: string;
  omega3_effect_pt: string | null;
  optimal_range_pt: string | null;
  unit: string | null;
  display_order: number;
}

export interface OmegaStudy {
  id: string;
  pubmed_id: number | null;
  study_title: string;
  year: number;
  sample_size: number | null;
  population: string | null;
  primary_outcome: string;
  effect_size: number | null;
  p_value: number | null;
  confidence_grade: 'high' | 'moderate' | 'low' | null;
  summary_pt: string | null;
}

export interface OmegaDiagnosis {
  product_name: string;
  brand: string;
  diagnosis_pt: string;
  verdict: 'excellent' | 'good' | 'moderate' | 'poor' | 'unknown';
  score: number;
  total_omega3_mg: number;
  benchmark_total_mg: number;
  benchmark_brand: string | null;
  gap_mg: number;
  recommendations: {
    consider_protocol_120?: boolean;
    oxidation_warning?: boolean;
    low_absorption?: boolean;
    verdict_description_pt?: string;
  };
}

export function useOmegaProducts() {
  const [products, setProducts] = useState<OmegaProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('omega_products')
      .select('*')
      .order('is_benchmark', { ascending: false })
      .order('absorption_score', { ascending: false });
    setProducts((data ?? []) as OmegaProduct[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { products, loading, refetch: fetch };
}

export function useBiomarkers() {
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('inflammation_biomarkers')
        .select('*')
        .order('display_order');
      setBiomarkers((data ?? []) as Biomarker[]);
      setLoading(false);
    })();
  }, []);
  return { biomarkers, loading };
}

export function useOmegaStudies(limit = 6) {
  const [studies, setStudies] = useState<OmegaStudy[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('omega_studies')
        .select('*')
        .order('year', { ascending: false })
        .limit(limit);
      setStudies((data ?? []) as OmegaStudy[]);
      setLoading(false);
    })();
  }, [limit]);
  return { studies, loading };
}

export async function diagnoseOmega(productSlug: string): Promise<OmegaDiagnosis | null> {
  const { data, error } = await supabase.rpc('omega_diagnose', { p_product_slug: productSlug });
  if (error || !data?.[0]) return null;
  return data[0] as OmegaDiagnosis;
}
