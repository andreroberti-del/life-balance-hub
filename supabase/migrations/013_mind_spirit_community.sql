-- M7 Life Balance: Mind + Spirit + Community Real + Peer Benchmark
-- 2026-05-21 - Sprint 3 COO

-- ============================================================
-- MIND: Check-in emocional diário
-- ============================================================

CREATE TABLE public.emotional_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  check_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood INTEGER NOT NULL CHECK (mood BETWEEN 1 AND 5),
  stress INTEGER CHECK (stress BETWEEN 1 AND 5),
  anxiety INTEGER CHECK (anxiety BETWEEN 1 AND 5),
  energy INTEGER CHECK (energy BETWEEN 1 AND 5),
  gratitude_text TEXT,
  emotions TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, check_date)
);

CREATE INDEX idx_emotional_checkins_user_date ON emotional_checkins(user_id, check_date DESC);

-- ============================================================
-- MIND: Sessões de respiração guiada
-- ============================================================

CREATE TABLE public.breathing_techniques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_pt TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_pt TEXT NOT NULL,
  inhale_seconds INTEGER NOT NULL,
  hold_seconds INTEGER DEFAULT 0,
  exhale_seconds INTEGER NOT NULL,
  hold_after_exhale_seconds INTEGER DEFAULT 0,
  recommended_cycles INTEGER DEFAULT 5,
  benefit_pt TEXT,
  best_for_pt TEXT,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE public.breathing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  technique_slug TEXT NOT NULL REFERENCES breathing_techniques(slug),
  cycles_completed INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 5),
  mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_breathing_sessions_user ON breathing_sessions(user_id, created_at DESC);

-- ============================================================
-- SPIRIT: Devocionais diários
-- ============================================================

CREATE TABLE public.devotionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  publish_date DATE,
  title_pt TEXT NOT NULL,
  scripture_quote TEXT,
  scripture_reference TEXT,
  reflection_pt TEXT NOT NULL,
  prayer_pt TEXT,
  action_pt TEXT,
  category TEXT,
  estimated_minutes INTEGER DEFAULT 5,
  xp_reward INTEGER DEFAULT 15,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE
);

CREATE TABLE public.user_devotional_reads (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  devotional_id UUID NOT NULL REFERENCES devotionals(id) ON DELETE CASCADE,
  reflection_response TEXT,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, devotional_id)
);

-- ============================================================
-- SPIRIT: Diário de gratidão
-- ============================================================

CREATE TABLE public.gratitude_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  item_1 TEXT NOT NULL,
  item_2 TEXT,
  item_3 TEXT,
  reflection TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, entry_date)
);

CREATE INDEX idx_gratitude_user_date ON gratitude_entries(user_id, entry_date DESC);

-- ============================================================
-- BENCHMARK SOCIAL: Demographics + agregação
-- ============================================================

CREATE TABLE public.user_demographics (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  age_band TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  gender TEXT,
  activity_level TEXT,
  is_public_in_benchmark BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (age_band IS NULL OR age_band IN ('18-24','25-34','35-44','45-54','55-64','65+')),
  CHECK (gender IS NULL OR gender IN ('male','female','other')),
  CHECK (activity_level IS NULL OR activity_level IN ('sedentary','light','moderate','active','very_active'))
);

-- Function para auto-popular demographics do profile
CREATE OR REPLACE FUNCTION public.sync_user_demographics()
RETURNS TRIGGER AS $$
DECLARE
  v_band TEXT;
BEGIN
  v_band := CASE
    WHEN NEW.age IS NULL THEN NULL
    WHEN NEW.age BETWEEN 18 AND 24 THEN '18-24'
    WHEN NEW.age BETWEEN 25 AND 34 THEN '25-34'
    WHEN NEW.age BETWEEN 35 AND 44 THEN '35-44'
    WHEN NEW.age BETWEEN 45 AND 54 THEN '45-54'
    WHEN NEW.age BETWEEN 55 AND 64 THEN '55-64'
    WHEN NEW.age >= 65 THEN '65+'
    ELSE NULL
  END;

  INSERT INTO user_demographics (user_id, age_band, gender, activity_level)
  VALUES (NEW.id, v_band, NEW.gender, NEW.activity_level)
  ON CONFLICT (user_id) DO UPDATE SET
    age_band = v_band,
    gender = NEW.gender,
    activity_level = NEW.activity_level,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_demographics_sync
  AFTER INSERT OR UPDATE OF age, gender, activity_level ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_demographics();

-- Backfill pra usuários existentes
INSERT INTO user_demographics (user_id, age_band, gender, activity_level)
SELECT
  id,
  CASE
    WHEN age IS NULL THEN NULL
    WHEN age BETWEEN 18 AND 24 THEN '18-24'
    WHEN age BETWEEN 25 AND 34 THEN '25-34'
    WHEN age BETWEEN 35 AND 44 THEN '35-44'
    WHEN age BETWEEN 45 AND 54 THEN '45-54'
    WHEN age BETWEEN 55 AND 64 THEN '55-64'
    WHEN age >= 65 THEN '65+'
  END,
  gender,
  activity_level
FROM profiles
WHERE id NOT IN (SELECT user_id FROM user_demographics)
ON CONFLICT (user_id) DO NOTHING;

-- Function: peer benchmark do usuário
CREATE OR REPLACE FUNCTION public.peer_benchmark(p_user_id UUID)
RETURNS TABLE(
  peer_count INTEGER,
  peer_group_label_pt TEXT,
  my_xp INTEGER,
  peer_avg_xp NUMERIC,
  my_level INTEGER,
  peer_avg_level NUMERIC,
  percentile INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_demo RECORD;
  v_my_xp INTEGER;
  v_my_level INTEGER;
  v_peer_count INTEGER;
  v_peer_avg_xp NUMERIC;
  v_peer_avg_level NUMERIC;
  v_pct INTEGER;
  v_label TEXT;
BEGIN
  SELECT * INTO v_demo FROM user_demographics WHERE user_id = p_user_id;
  SELECT total_xp, current_level INTO v_my_xp, v_my_level FROM user_levels WHERE user_id = p_user_id;

  IF v_demo IS NULL OR v_demo.age_band IS NULL THEN
    RETURN QUERY SELECT 0, 'Complete seu perfil pra comparações'::TEXT,
      COALESCE(v_my_xp, 0), 0::NUMERIC, COALESCE(v_my_level, 1), 0::NUMERIC, 0;
    RETURN;
  END IF;

  WITH peers AS (
    SELECT ul.total_xp, ul.current_level
    FROM user_demographics d
    INNER JOIN user_levels ul ON ul.user_id = d.user_id
    WHERE d.is_public_in_benchmark = TRUE
      AND d.user_id <> p_user_id
      AND d.age_band = v_demo.age_band
      AND (d.gender = v_demo.gender OR v_demo.gender IS NULL OR d.gender IS NULL)
  )
  SELECT
    COUNT(*)::INTEGER,
    ROUND(AVG(total_xp)::numeric, 0),
    ROUND(AVG(current_level)::numeric, 1)
  INTO v_peer_count, v_peer_avg_xp, v_peer_avg_level
  FROM peers;

  v_label := format('%s, %s', v_demo.age_band, COALESCE(v_demo.gender, 'todos'));

  WITH all_xp AS (
    SELECT ul.total_xp
    FROM user_demographics d
    INNER JOIN user_levels ul ON ul.user_id = d.user_id
    WHERE d.is_public_in_benchmark = TRUE
      AND d.age_band = v_demo.age_band
  )
  SELECT (
    CASE WHEN COUNT(*) = 0 THEN 50
    ELSE ROUND((COUNT(*) FILTER (WHERE total_xp < COALESCE(v_my_xp, 0))::numeric / COUNT(*)) * 100)
    END
  )::INTEGER INTO v_pct
  FROM all_xp;

  RETURN QUERY SELECT
    COALESCE(v_peer_count, 0),
    v_label,
    COALESCE(v_my_xp, 0),
    COALESCE(v_peer_avg_xp, 0),
    COALESCE(v_my_level, 1),
    COALESCE(v_peer_avg_level, 0),
    COALESCE(v_pct, 50);
END;
$$;

-- ============================================================
-- COMMUNITY: Feed social real
-- ============================================================

CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_type TEXT NOT NULL DEFAULT 'text',
  content TEXT NOT NULL,
  image_url TEXT,
  related_lesson_id UUID REFERENCES course_lessons(id) ON DELETE SET NULL,
  related_achievement TEXT,
  metric_value JSONB,
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  visibility TEXT NOT NULL DEFAULT 'public',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (post_type IN ('text','progress','achievement','milestone','question')),
  CHECK (visibility IN ('public','tribe','private'))
);

CREATE INDEX idx_community_posts_created ON community_posts(created_at DESC);
CREATE INDEX idx_community_posts_user ON community_posts(user_id);

CREATE TABLE public.community_post_likes (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- Trigger: atualizar likes_count
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_post_likes
  AFTER INSERT OR DELETE ON community_post_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_likes_count();

-- ============================================================
-- SEED: técnicas de respiração + devocionais iniciais
-- ============================================================

INSERT INTO breathing_techniques (slug, name_pt, name_en, description_pt, inhale_seconds, hold_seconds, exhale_seconds, hold_after_exhale_seconds, recommended_cycles, benefit_pt, best_for_pt, display_order) VALUES
  ('box-breathing', 'Box Breathing (4-4-4-4)', 'Box Breathing',
   'Respiração quadrada usada por militares e atletas para acalmar o sistema nervoso em segundos.',
   4, 4, 4, 4, 5,
   'Reduz cortisol e ativa o sistema parassimpático.',
   'Ansiedade no trabalho, antes de uma decisão importante, dormir.', 1),
  ('4-7-8', 'Técnica 4-7-8', '4-7-8 Breathing',
   'Inspira 4, segura 7, expira 8. Cria um efeito sedativo no sistema nervoso. Andrew Weil torna popular.',
   4, 7, 8, 0, 4,
   'Indução do sono. Reduz frequência cardíaca.',
   'Insônia, ataques de pânico.', 2),
  ('coherent', 'Respiração Coerente', 'Coherent Breathing',
   'Respiração a 6 ciclos por minuto, sincroniza coração e cérebro.',
   5, 0, 5, 0, 10,
   'Alinha variabilidade de frequência cardíaca (HRV).',
   'Meditação, foco, equilíbrio emocional.', 3),
  ('wim-hof-light', 'Wim Hof Leve', 'Wim Hof Light',
   'Respiração rítmica energética. Versão leve, sem retenção longa.',
   2, 0, 2, 0, 30,
   'Energia, foco, despertar.',
   'Manhã, antes de treino, fadiga mental.', 4);

INSERT INTO devotionals (slug, title_pt, scripture_quote, scripture_reference, reflection_pt, prayer_pt, action_pt, category, estimated_minutes, xp_reward, display_order) VALUES
  ('descanso-em-deus',
   'O descanso que vem do alto',
   'Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.',
   'Mateus 11:28',
   'O mundo te ensina que produtividade é virtude máxima. Mas o seu corpo, sua mente e seu espírito têm limites. Descanso não é luxo, é mandamento. Antes mesmo de Deus ordenar amar o próximo, Ele ordenou o sábado. Pare hoje. Respire. Confie que o universo não vai desabar se você sair do controle por algumas horas. O descanso é onde Deus te restaura.',
   'Senhor, eu reconheço que ando ofegante. Que eu me agarro a metas que talvez nem sejam tuas. Hoje eu paro. Recebo o teu descanso. Confio em ti.',
   'Reserve 20 minutos hoje em silêncio absoluto. Sem telefone, sem música, sem agenda. Apenas presença.',
   'descanso', 6, 20, 1),

  ('proposito-acima-do-numero',
   'O propósito acima do número',
   'Não acumuleis para vós tesouros na terra, onde a traça e a ferrugem tudo consomem.',
   'Mateus 6:19',
   'Você pode ganhar todos os zeros do mundo na conta bancária e ainda morrer de dentro pra fora. Roberti aprendeu isso comprando uma Ferrari e caindo em depressão. O número não preenche o vazio. O propósito preenche. Pergunte-se: se eu tirar dinheiro, status e títulos, quem eu sou? Quem eu sirvo? O que deixo de herança? Esse é o tesouro que não enferruja.',
   'Pai, redireciona meu olhar. Que eu acumule no que tem peso eterno, não no que pesa no inventário. Que minha vida sirva.',
   'Liste três pessoas que serão impactadas pela vida que você está construindo. Se a lista estiver vazia, comece a construir a partir de hoje.',
   'proposito', 7, 25, 2),

  ('familia-fundacao',
   'A família como fundação invisível',
   'Quanto a mim e à minha casa, serviremos ao Senhor.',
   'Josué 24:15',
   'Nenhum sucesso financeiro justifica o fracasso de uma família. Família funcional não é família perfeita, é família que sabe perdoar, comunicar, priorizar presença. Quando você é jovem, troca família por trabalho achando que vai recuperar depois. Não recupera. O tempo com filhos pequenos é janela curta. O casamento precisa de manutenção como qualquer sistema vivo. Hoje, escolha a sua casa.',
   'Deus, abençoa minha família. Que eu seja presente, paciente, generoso de tempo. Que minha casa seja um lugar de paz.',
   'Mande uma mensagem agora pra alguém da sua família dizendo algo específico que você ama nela. Sem contexto, só amor.',
   'familia', 5, 20, 3),

  ('gratidao-mecanismo',
   'A gratidão como mecanismo',
   'Em tudo dai graças, porque esta é a vontade de Deus.',
   '1 Tessalonicenses 5:18',
   'O cérebro humano tem um viés natural pra detectar ameaças. É evolutivo: nossos ancestrais que prestavam atenção em perigos sobreviviam. Mas em pleno século XXI, esse viés vira ansiedade crônica. A gratidão é o antídoto neuroplástico. Praticada todo dia, ela literalmente refaz o caminho neural. Não é placebo: ressonância magnética mostra mudança no córtex pré-frontal medial em 8 semanas.',
   'Senhor, hoje eu te agradeço sem barganhar. Sem lista de pedidos. Apenas obrigado.',
   'Escreva 3 coisas pelas quais você é grato hoje. Sem repetir nenhuma da última vez. Veja como se transforma com o tempo.',
   'gratidao', 5, 20, 4),

  ('silencio-sabio',
   'O silêncio do sábio',
   'Aquietai-vos e sabei que eu sou Deus.',
   'Salmos 46:10',
   'Você é bombardeado por 6000 mensagens publicitárias por dia. Sua mente nunca está sozinha consigo. Quando foi a última vez que você ficou 10 minutos em silêncio, sem estímulo externo, sem tarefa? O silêncio é onde Deus fala. Onde insights brotam. Onde você percebe o que está sentindo. Sociedades antigas tinham rituais de silêncio. A moderna baniu o silêncio como improdutividade. Recupere.',
   'Pai, hoje eu calo. Não te peço nada. Só escuto.',
   'Sente em silêncio por 10 minutos sem nenhum estímulo. Cronômetro. O que vier, vem. Apenas observe.',
   'silencio', 8, 25, 5);

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE emotional_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE breathing_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE breathing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE devotionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devotional_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE gratitude_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own emotional checkins"
  ON emotional_checkins FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone read breathing techniques"
  ON breathing_techniques FOR SELECT USING (TRUE);

CREATE POLICY "Users manage own breathing sessions"
  ON breathing_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone read devotionals"
  ON devotionals FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Users manage own devotional reads"
  ON user_devotional_reads FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own gratitude entries"
  ON gratitude_entries FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own demographics"
  ON user_demographics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone view public demographics anonymously (for benchmark)"
  ON user_demographics FOR SELECT USING (is_public_in_benchmark = TRUE);

CREATE POLICY "Anyone read public community posts"
  ON community_posts FOR SELECT USING (visibility = 'public');
CREATE POLICY "Users create own posts"
  ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own posts"
  ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own posts"
  ON community_posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone view likes"
  ON community_post_likes FOR SELECT USING (TRUE);
CREATE POLICY "Users like posts"
  ON community_post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unlike posts"
  ON community_post_likes FOR DELETE USING (auth.uid() = user_id);

GRANT EXECUTE ON FUNCTION public.peer_benchmark(UUID) TO authenticated;
