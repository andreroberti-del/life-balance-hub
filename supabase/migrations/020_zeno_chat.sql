-- M7 Life Balance: ZENO Chat conversations
-- 2026-05-21

CREATE TABLE public.zeno_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  message_count INTEGER NOT NULL DEFAULT 0,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_zeno_conversations_user ON zeno_conversations(user_id, last_message_at DESC);

CREATE TABLE public.zeno_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES zeno_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  audio_url TEXT,
  provider TEXT,
  model_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (role IN ('user', 'assistant'))
);

CREATE INDEX idx_zeno_messages_conversation ON zeno_messages(conversation_id, created_at);

-- Trigger: atualizar last_message_at + message_count
CREATE OR REPLACE FUNCTION public.update_zeno_conversation_meta()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE zeno_conversations
  SET last_message_at = NEW.created_at,
      message_count = message_count + 1,
      title = COALESCE(title, LEFT(NEW.content, 60))
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_zeno_message_meta
  AFTER INSERT ON zeno_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_zeno_conversation_meta();

ALTER TABLE zeno_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE zeno_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own conversations" ON zeno_conversations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own messages" ON zeno_messages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
