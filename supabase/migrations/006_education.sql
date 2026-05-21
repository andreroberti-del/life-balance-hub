-- M7 Life Balance: Sistema de Educação (cursos, módulos, lições)
-- 2026-05-20 - Overnight build COO
-- Trilhas alinhadas às 7 saúdes Mind7

-- 1. Cursos (trilhas educativas)
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_pt TEXT NOT NULL,
  title_es TEXT NOT NULL,
  description_en TEXT,
  description_pt TEXT,
  description_es TEXT,
  health_pillar TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  cover_color TEXT NOT NULL DEFAULT '#668DFF',
  estimated_minutes INTEGER NOT NULL DEFAULT 30,
  total_xp_reward INTEGER NOT NULL DEFAULT 100,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (health_pillar IN ('fisica', 'mental', 'espiritual', 'familiar', 'financeira', 'intelectual', 'profissional', 'social')),
  CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'))
);

CREATE INDEX idx_courses_pillar ON courses(health_pillar);
CREATE INDEX idx_courses_published ON courses(is_published, display_order);

-- 2. Módulos (agrupamento de lições dentro de um curso)
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_pt TEXT NOT NULL,
  title_es TEXT NOT NULL,
  description_pt TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_modules_course ON course_modules(course_id, display_order);

-- 3. Lições (conteúdo atômico)
CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_pt TEXT NOT NULL,
  title_es TEXT NOT NULL,
  lesson_type TEXT NOT NULL DEFAULT 'article',
  content_pt TEXT,
  content_en TEXT,
  content_es TEXT,
  video_url TEXT,
  audio_url TEXT,
  quiz_data JSONB,
  estimated_minutes INTEGER NOT NULL DEFAULT 5,
  xp_reward INTEGER NOT NULL DEFAULT 20,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, slug),
  CHECK (lesson_type IN ('article', 'video', 'audio', 'quiz', 'reflection'))
);

CREATE INDEX idx_lessons_module ON course_lessons(module_id, display_order);
CREATE INDEX idx_lessons_course ON course_lessons(course_id);

-- 4. Progresso de curso por usuário
CREATE TABLE public.user_course_progress (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started',
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  total_lessons INTEGER NOT NULL DEFAULT 0,
  progress_pct INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_lesson_id UUID REFERENCES course_lessons(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id),
  CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
  CHECK (progress_pct BETWEEN 0 AND 100)
);

CREATE INDEX idx_user_course_progress_status ON user_course_progress(user_id, status);

-- 5. Progresso de lição (cada lição completada)
CREATE TABLE public.user_lesson_progress (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  quiz_score INTEGER,
  reflection_text TEXT,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, lesson_id)
);

CREATE INDEX idx_user_lesson_progress_course ON user_lesson_progress(user_id, course_id);

-- 6. Function: marcar lição como completa e dar XP
CREATE OR REPLACE FUNCTION public.complete_lesson(
  p_user_id UUID,
  p_lesson_id UUID,
  p_quiz_score INTEGER DEFAULT NULL,
  p_reflection TEXT DEFAULT NULL
)
RETURNS TABLE(
  xp_earned INTEGER,
  course_completed BOOLEAN,
  new_progress_pct INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_lesson RECORD;
  v_course_id UUID;
  v_xp INTEGER;
  v_already_done BOOLEAN;
  v_lessons_total INTEGER;
  v_lessons_done INTEGER;
  v_progress INTEGER;
  v_course_completed BOOLEAN := FALSE;
BEGIN
  SELECT * INTO v_lesson FROM course_lessons WHERE id = p_lesson_id;
  IF v_lesson IS NULL THEN
    RETURN QUERY SELECT 0, FALSE, 0;
    RETURN;
  END IF;

  v_course_id := v_lesson.course_id;
  v_xp := v_lesson.xp_reward;

  SELECT is_completed INTO v_already_done
  FROM user_lesson_progress WHERE user_id = p_user_id AND lesson_id = p_lesson_id;

  INSERT INTO user_lesson_progress (user_id, lesson_id, course_id, is_completed, quiz_score, reflection_text, completed_at)
  VALUES (p_user_id, p_lesson_id, v_course_id, TRUE, p_quiz_score, p_reflection, NOW())
  ON CONFLICT (user_id, lesson_id) DO UPDATE SET
    is_completed = TRUE,
    quiz_score = COALESCE(p_quiz_score, user_lesson_progress.quiz_score),
    reflection_text = COALESCE(p_reflection, user_lesson_progress.reflection_text),
    completed_at = COALESCE(user_lesson_progress.completed_at, NOW());

  IF v_already_done IS TRUE THEN
    v_xp := 0;
  ELSE
    PERFORM add_xp(p_user_id, v_xp, 'Lição completada: ' || v_lesson.title_pt, 'lesson_completed',
      jsonb_build_object('lesson_id', p_lesson_id, 'course_id', v_course_id));
  END IF;

  SELECT COUNT(*) INTO v_lessons_total
  FROM course_lessons WHERE course_id = v_course_id AND is_published = TRUE;

  SELECT COUNT(*) INTO v_lessons_done
  FROM user_lesson_progress
  WHERE user_id = p_user_id AND course_id = v_course_id AND is_completed = TRUE;

  v_progress := CASE WHEN v_lessons_total = 0 THEN 0
                ELSE (v_lessons_done * 100 / v_lessons_total) END;

  INSERT INTO user_course_progress (user_id, course_id, status, lessons_completed, total_lessons, progress_pct, xp_earned, started_at, last_lesson_id, updated_at)
  VALUES (p_user_id, v_course_id,
    CASE WHEN v_progress = 100 THEN 'completed' ELSE 'in_progress' END,
    v_lessons_done, v_lessons_total, v_progress, v_xp, NOW(), p_lesson_id, NOW())
  ON CONFLICT (user_id, course_id) DO UPDATE SET
    status = CASE WHEN v_progress = 100 THEN 'completed' ELSE 'in_progress' END,
    lessons_completed = v_lessons_done,
    total_lessons = v_lessons_total,
    progress_pct = v_progress,
    xp_earned = user_course_progress.xp_earned + v_xp,
    last_lesson_id = p_lesson_id,
    completed_at = CASE WHEN v_progress = 100 AND user_course_progress.completed_at IS NULL
                   THEN NOW() ELSE user_course_progress.completed_at END,
    updated_at = NOW();

  IF v_progress = 100 AND v_lessons_done > 0 THEN
    v_course_completed := TRUE;
  END IF;

  RETURN QUERY SELECT v_xp, v_course_completed, v_progress;
END;
$$;

-- 7. RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published courses"
  ON courses FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Anyone can read modules of published courses"
  ON course_modules FOR SELECT
  USING (EXISTS (SELECT 1 FROM courses WHERE courses.id = course_modules.course_id AND courses.is_published = TRUE));

CREATE POLICY "Anyone can read published lessons"
  ON course_lessons FOR SELECT
  USING (is_published = TRUE AND EXISTS (SELECT 1 FROM courses WHERE courses.id = course_lessons.course_id AND courses.is_published = TRUE));

CREATE POLICY "Users can view own course progress"
  ON user_course_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own lesson progress"
  ON user_lesson_progress FOR SELECT USING (auth.uid() = user_id);

GRANT EXECUTE ON FUNCTION public.complete_lesson(UUID, UUID, INTEGER, TEXT) TO authenticated;
