-- M7 Life Balance: Distributor Aprovado workflow
-- 2026-05-21 - Sprint COO

-- 1. Perfis de distribuidor (status + critérios + partner_id Zinzino)
CREATE TABLE public.distributor_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_eligible',
  partner_id_zinzino TEXT,
  application_submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by_admin_id UUID REFERENCES profiles(id),
  rejected_reason TEXT,
  termo_assinado_em TIMESTAMPTZ,
  treinamento_completo_em TIMESTAMPTZ,
  oam_protocolo_completo BOOLEAN DEFAULT FALSE,
  premium_days_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (status IN ('not_eligible', 'eligible', 'applied', 'in_review', 'approved', 'rejected', 'suspended'))
);

-- 2. Critérios pra elegibilidade (referência fixa)
CREATE TABLE public.distributor_criteria (
  criterion_code TEXT PRIMARY KEY,
  name_pt TEXT NOT NULL,
  description_pt TEXT NOT NULL,
  required BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0
);

INSERT INTO distributor_criteria (criterion_code, name_pt, description_pt, required, display_order) VALUES
  ('premium_90d', '90 dias Premium ativo', 'Você precisa ser membro Premium do M7 por pelo menos 90 dias consecutivos.', TRUE, 1),
  ('oam_complete', 'Protocolo OAM completo', 'Baseline + 120 dias de suplementação + reteste com melhora documentada nos biomarcadores.', TRUE, 2),
  ('treinamento_mind7', 'Treinamento Mind7 (~2h)', 'Curso online sobre compliance Zinzino, DSSRC, linguagem permitida e proibida.', TRUE, 3),
  ('termo_assinado', 'Termo de compromisso assinado', 'Termo de conduta ética e compliance Mind7+Zinzino.', TRUE, 4),
  ('nivel_minimo', 'Nível "Comprometido" (2000+ XP)', 'Demonstração de engajamento com o método antes de assumir responsabilidade.', FALSE, 5);

-- 3. Function: checar status do usuário
CREATE OR REPLACE FUNCTION public.check_distributor_eligibility(p_user_id UUID)
RETURNS TABLE(
  is_eligible BOOLEAN,
  status TEXT,
  premium_90d_met BOOLEAN,
  oam_complete_met BOOLEAN,
  treinamento_met BOOLEAN,
  termo_met BOOLEAN,
  nivel_minimo_met BOOLEAN,
  missing_pt TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile RECORD;
  v_level INTEGER;
  v_premium_days INTEGER := 0;
  v_oam BOOLEAN := FALSE;
  v_treinamento BOOLEAN := FALSE;
  v_termo BOOLEAN := FALSE;
  v_nivel BOOLEAN := FALSE;
  v_missing TEXT[] := ARRAY[]::TEXT[];
  v_status TEXT := 'not_eligible';
BEGIN
  SELECT * INTO v_profile FROM distributor_profiles WHERE user_id = p_user_id;

  IF v_profile IS NOT NULL THEN
    v_premium_days := v_profile.premium_days_count;
    v_oam := v_profile.oam_protocolo_completo;
    v_treinamento := v_profile.treinamento_completo_em IS NOT NULL;
    v_termo := v_profile.termo_assinado_em IS NOT NULL;
    v_status := v_profile.status;
  END IF;

  SELECT current_level INTO v_level FROM user_levels WHERE user_id = p_user_id;
  v_nivel := COALESCE(v_level, 1) >= 3;

  IF v_premium_days < 90 THEN v_missing := array_append(v_missing, 'premium_90d'); END IF;
  IF NOT v_oam THEN v_missing := array_append(v_missing, 'oam_complete'); END IF;
  IF NOT v_treinamento THEN v_missing := array_append(v_missing, 'treinamento_mind7'); END IF;
  IF NOT v_termo THEN v_missing := array_append(v_missing, 'termo_assinado'); END IF;

  RETURN QUERY SELECT
    array_length(v_missing, 1) IS NULL,
    v_status,
    v_premium_days >= 90,
    v_oam,
    v_treinamento,
    v_termo,
    v_nivel,
    v_missing;
END;
$$;

-- 4. Trigger pra criar distributor_profiles automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user_distributor()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO distributor_profiles (user_id, status)
  VALUES (NEW.id, 'not_eligible')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_distributor
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_distributor();

-- Backfill pra usuários existentes
INSERT INTO distributor_profiles (user_id, status)
SELECT id, 'not_eligible' FROM profiles
WHERE id NOT IN (SELECT user_id FROM distributor_profiles)
ON CONFLICT (user_id) DO NOTHING;

-- 5. RLS
ALTER TABLE distributor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributor_criteria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own distributor profile" ON distributor_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can read criteria" ON distributor_criteria FOR SELECT USING (TRUE);

GRANT EXECUTE ON FUNCTION public.check_distributor_eligibility(UUID) TO authenticated;
