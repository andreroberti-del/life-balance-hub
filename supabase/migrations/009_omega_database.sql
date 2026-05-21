-- M7 Life Balance: Banco Ômega 3 x Inflamação (Mecanismo Único OAM)
-- 2026-05-21 - Sprint 2 COO

-- 1. Marcas e produtos de ômega 3 indexados
CREATE TABLE public.omega_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  product_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country_origin TEXT,
  epa_mg_per_serving INTEGER NOT NULL,
  dha_mg_per_serving INTEGER NOT NULL,
  total_omega3_mg INTEGER GENERATED ALWAYS AS (epa_mg_per_serving + dha_mg_per_serving) STORED,
  serving_caps INTEGER NOT NULL DEFAULT 1,
  chemical_form TEXT NOT NULL,
  source TEXT NOT NULL,
  oxidation_totox NUMERIC(5,2),
  oxidation_grade TEXT,
  third_party_certified TEXT,
  price_per_month_usd NUMERIC(6,2),
  price_per_mg_epa NUMERIC(6,4) GENERATED ALWAYS AS (
    CASE WHEN epa_mg_per_serving > 0
    THEN ROUND((price_per_month_usd / (epa_mg_per_serving * 30.0))::numeric, 4)
    ELSE 0 END
  ) STORED,
  absorption_score INTEGER,
  label_accuracy_score INTEGER,
  heavy_metals_pass BOOLEAN DEFAULT TRUE,
  is_benchmark BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (chemical_form IN ('ethyl_ester', 'triglyceride', 're_esterified_triglyceride', 'phospholipid', 'free_fatty_acid')),
  CHECK (source IN ('fish_oil', 'krill', 'algae', 'calamari')),
  CHECK (oxidation_grade IS NULL OR oxidation_grade IN ('excellent', 'good', 'poor')),
  CHECK (absorption_score BETWEEN 0 AND 100),
  CHECK (label_accuracy_score BETWEEN 0 AND 100)
);

CREATE INDEX idx_omega_products_brand ON omega_products(brand);
CREATE INDEX idx_omega_products_slug ON omega_products(slug);

-- 2. Estudos científicos indexados
CREATE TABLE public.omega_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pubmed_id INTEGER UNIQUE,
  study_title TEXT NOT NULL,
  year INTEGER NOT NULL,
  sample_size INTEGER,
  population TEXT,
  intervention TEXT,
  omega3_form_studied TEXT,
  primary_outcome TEXT NOT NULL,
  effect_size NUMERIC(6,3),
  p_value NUMERIC(6,4),
  dose_threshold_mg INTEGER,
  duration_threshold_days INTEGER,
  confidence_grade TEXT,
  funded_by_industry BOOLEAN DEFAULT FALSE,
  doi TEXT,
  summary_pt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (confidence_grade IS NULL OR confidence_grade IN ('high', 'moderate', 'low')),
  CHECK (year BETWEEN 1990 AND 2030)
);

CREATE INDEX idx_omega_studies_outcome ON omega_studies(primary_outcome);

-- 3. Marcadores inflamatórios de referência
CREATE TABLE public.inflammation_biomarkers (
  marker_code TEXT PRIMARY KEY,
  name_pt TEXT NOT NULL,
  name_en TEXT NOT NULL,
  what_is_pt TEXT NOT NULL,
  omega3_effect_pt TEXT,
  optimal_range_pt TEXT,
  unit TEXT,
  display_order INTEGER DEFAULT 0
);

-- 4. Resultado de mundo real (BalanceTest agregado)
CREATE TABLE public.omega_real_world_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_hashed TEXT NOT NULL,
  product_used TEXT NOT NULL,
  baseline_omega3_index NUMERIC(4,2),
  baseline_aa_epa_ratio NUMERIC(4,2),
  post_120d_omega3_index NUMERIC(4,2),
  post_120d_aa_epa_ratio NUMERIC(4,2),
  delta_omega3_index NUMERIC(4,2) GENERATED ALWAYS AS (
    COALESCE(post_120d_omega3_index, 0) - COALESCE(baseline_omega3_index, 0)
  ) STORED,
  duration_days INTEGER,
  age_band TEXT,
  sex TEXT,
  country TEXT,
  reported_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_omega_outcomes_product ON omega_real_world_outcomes(product_used);

-- 5. Function: diagnóstico de produto (chamada do app)
CREATE OR REPLACE FUNCTION public.omega_diagnose(p_product_slug TEXT)
RETURNS TABLE(
  product_name TEXT,
  brand TEXT,
  diagnosis_pt TEXT,
  verdict TEXT,
  score INTEGER,
  total_omega3_mg INTEGER,
  benchmark_total_mg INTEGER,
  benchmark_brand TEXT,
  gap_mg INTEGER,
  recommendations JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_product RECORD;
  v_benchmark RECORD;
  v_score INTEGER;
  v_verdict TEXT;
  v_diagnosis TEXT;
BEGIN
  SELECT * INTO v_product FROM omega_products WHERE slug = lower(p_product_slug);
  IF v_product IS NULL THEN
    RETURN QUERY SELECT
      'Produto não encontrado'::TEXT, NULL::TEXT,
      'Não encontramos esse produto no banco. Adicionaremos em breve.'::TEXT,
      'unknown'::TEXT, 0::INTEGER, 0::INTEGER, 0::INTEGER, NULL::TEXT, 0::INTEGER, '[]'::JSONB;
    RETURN;
  END IF;

  SELECT * INTO v_benchmark FROM omega_products WHERE is_benchmark = TRUE LIMIT 1;

  v_score := (
    COALESCE(v_product.absorption_score, 50) * 0.3 +
    COALESCE(v_product.label_accuracy_score, 50) * 0.3 +
    CASE WHEN v_product.oxidation_grade = 'excellent' THEN 100
         WHEN v_product.oxidation_grade = 'good' THEN 70
         WHEN v_product.oxidation_grade = 'poor' THEN 20
         ELSE 50 END * 0.2 +
    LEAST(100, (v_product.total_omega3_mg::numeric / 2000.0) * 100) * 0.2
  )::INTEGER;

  v_verdict := CASE
    WHEN v_score >= 80 THEN 'excellent'
    WHEN v_score >= 60 THEN 'good'
    WHEN v_score >= 40 THEN 'moderate'
    ELSE 'poor' END;

  v_diagnosis := format(
    'Seu produto entrega %s mg de EPA+DHA por dose, com forma química %s e oxidação %s. ' ||
    'O benchmark (%s) entrega %s mg, com %s e oxidação %s. ' ||
    'Diferença: %s mg de EPA+DHA por dose.',
    v_product.total_omega3_mg,
    v_product.chemical_form,
    COALESCE(v_product.oxidation_grade, 'não medida'),
    COALESCE(v_benchmark.brand, '—'),
    COALESCE(v_benchmark.total_omega3_mg, 0),
    COALESCE(v_benchmark.chemical_form, '—'),
    COALESCE(v_benchmark.oxidation_grade, 'não medida'),
    COALESCE(v_benchmark.total_omega3_mg, 0) - v_product.total_omega3_mg
  );

  RETURN QUERY SELECT
    v_product.product_name,
    v_product.brand,
    v_diagnosis,
    v_verdict,
    v_score,
    v_product.total_omega3_mg,
    COALESCE(v_benchmark.total_omega3_mg, 0),
    COALESCE(v_benchmark.brand, NULL::TEXT),
    COALESCE(v_benchmark.total_omega3_mg, 0) - v_product.total_omega3_mg,
    jsonb_build_object(
      'consider_protocol_120', v_score < 70,
      'oxidation_warning', v_product.oxidation_grade = 'poor',
      'low_absorption', COALESCE(v_product.absorption_score, 100) < 60,
      'verdict_description_pt',
        CASE v_verdict
          WHEN 'excellent' THEN 'Excelente perfil. Mantenha.'
          WHEN 'good' THEN 'Bom perfil, mas há espaço para melhorar.'
          WHEN 'moderate' THEN 'Perfil moderado. Considere fazer um BalanceTest para medir impacto real.'
          ELSE 'Perfil baixo. Recomendamos o protocolo OAM de 120 dias.'
        END
    );
END;
$$;

-- 6. RLS
ALTER TABLE omega_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE omega_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE inflammation_biomarkers ENABLE ROW LEVEL SECURITY;
ALTER TABLE omega_real_world_outcomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read omega products" ON omega_products FOR SELECT USING (true);
CREATE POLICY "Anyone can read studies" ON omega_studies FOR SELECT USING (true);
CREATE POLICY "Anyone can read biomarkers" ON inflammation_biomarkers FOR SELECT USING (true);
CREATE POLICY "Anyone can read outcomes (anonymized)" ON omega_real_world_outcomes FOR SELECT USING (true);

GRANT EXECUTE ON FUNCTION public.omega_diagnose(TEXT) TO authenticated, anon;
