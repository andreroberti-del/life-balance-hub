-- M7 Life Balance: Download Your Brain (diário noturno pré-sono)
-- 2026-05-21
--
-- Conceito do Roberti: antes de dormir, a pessoa anota tudo que está na cabeça
-- pra ir dormir sem sensação de "estou esquecendo algo". Reduz ansiedade, melhora qualidade do sono.
-- Free: texto. Premium: áudio com transcrição + perguntas inteligentes via IA.

-- 1. Categorias / prompts que o sistema usa pra estimular o brain dump
CREATE TABLE public.brain_dump_prompts (
  code TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  prompt_pt TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  CHECK (category IN ('todo', 'people', 'worry', 'idea', 'gratitude', 'tomorrow', 'unresolved'))
);

INSERT INTO brain_dump_prompts (code, category, prompt_pt, icon_name, display_order) VALUES
  ('todo_pending', 'todo', 'O que ficou pra fazer hoje que você não terminou?', 'ListChecks', 1),
  ('people_followup', 'people', 'Tem alguém que você precisa falar com amanhã?', 'Users', 2),
  ('worry_now', 'worry', 'O que está te preocupando agora?', 'AlertCircle', 3),
  ('idea_today', 'idea', 'Teve alguma ideia hoje que vale registrar antes de esquecer?', 'Lightbulb', 4),
  ('gratitude_today', 'gratitude', 'Pelo que você é grato hoje?', 'Heart', 5),
  ('tomorrow_top', 'tomorrow', 'Qual é a coisa mais importante de amanhã?', 'Sunrise', 6),
  ('unresolved', 'unresolved', 'Tem algo no ar que você não resolveu (conversa, decisão)?', 'MessageCircleQuestion', 7);

-- 2. Entradas do brain dump (uma por dia por usuário)
CREATE TABLE public.brain_dump_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  raw_text TEXT,
  audio_url TEXT,
  audio_duration_seconds INTEGER,
  transcription_text TEXT,
  mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 5),
  mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 5),
  ai_followup_questions JSONB DEFAULT '[]'::jsonb,
  ai_summary TEXT,
  is_premium_entry BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, entry_date)
);

CREATE INDEX idx_brain_dump_user_date ON brain_dump_entries(user_id, entry_date DESC);

-- 3. Itens individuais dentro de um brain dump (estruturação)
CREATE TABLE public.brain_dump_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES brain_dump_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  is_done BOOLEAN DEFAULT FALSE,
  done_at TIMESTAMPTZ,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (category IN ('todo', 'people', 'worry', 'idea', 'gratitude', 'tomorrow', 'unresolved', 'other'))
);

CREATE INDEX idx_brain_dump_items_entry ON brain_dump_items(entry_id);
CREATE INDEX idx_brain_dump_items_user ON brain_dump_items(user_id, is_done);

-- 4. Function: criar/upsert brain dump entry + dar XP se for primeiro do dia
CREATE OR REPLACE FUNCTION public.save_brain_dump(
  p_user_id UUID,
  p_raw_text TEXT,
  p_mood_before INTEGER DEFAULT NULL,
  p_mood_after INTEGER DEFAULT NULL
)
RETURNS TABLE(entry_id UUID, xp_awarded INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_existing_id UUID;
  v_new_id UUID;
  v_xp INTEGER := 0;
BEGIN
  SELECT id INTO v_existing_id
  FROM brain_dump_entries
  WHERE user_id = p_user_id AND entry_date = v_today;

  IF v_existing_id IS NULL THEN
    INSERT INTO brain_dump_entries (user_id, entry_date, raw_text, mood_before, mood_after)
    VALUES (p_user_id, v_today, p_raw_text, p_mood_before, p_mood_after)
    RETURNING id INTO v_new_id;

    v_xp := 20;
    PERFORM add_xp(p_user_id, v_xp, 'Download Your Brain', 'brain_dump', '{}'::jsonb);
    RETURN QUERY SELECT v_new_id, v_xp;
  ELSE
    UPDATE brain_dump_entries
    SET raw_text = p_raw_text,
        mood_before = COALESCE(p_mood_before, mood_before),
        mood_after = COALESCE(p_mood_after, mood_after)
    WHERE id = v_existing_id;
    RETURN QUERY SELECT v_existing_id, 0;
  END IF;
END;
$$;

-- 5. RLS
ALTER TABLE brain_dump_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_dump_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_dump_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads brain dump prompts"
  ON brain_dump_prompts FOR SELECT USING (TRUE);

CREATE POLICY "Users manage own brain dump entries"
  ON brain_dump_entries FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own brain dump items"
  ON brain_dump_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

GRANT EXECUTE ON FUNCTION public.save_brain_dump(UUID, TEXT, INTEGER, INTEGER) TO authenticated;

-- 6. Adicionar Brain Dump como quest opcional
INSERT INTO quest_templates (code, title_pt, description_pt, icon_name, xp_reward, category) VALUES
  ('brain_dump', 'Download Your Brain', 'Esvazie a mente antes de dormir pra dormir tranquilo', 'Moon', 20, 'mind')
ON CONFLICT (code) DO NOTHING;
