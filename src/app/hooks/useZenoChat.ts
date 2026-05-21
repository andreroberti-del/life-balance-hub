import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface ZenoConversation {
  id: string;
  user_id: string;
  title: string | null;
  last_message_at: string;
  message_count: number;
  is_archived: boolean;
  created_at: string;
}

export interface ZenoMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  audio_url: string | null;
  provider: string | null;
  model_used: string | null;
  created_at: string;
}

export function useZenoChat(activeConvId: string | null) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ZenoConversation[]>([]);
  const [messages, setMessages] = useState<ZenoMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchConversations = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('zeno_conversations')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_archived', false)
      .order('last_message_at', { ascending: false })
      .limit(20);
    setConversations((data ?? []) as ZenoConversation[]);
    setLoading(false);
  }, [user?.id]);

  const fetchMessages = useCallback(async () => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }
    const { data } = await supabase
      .from('zeno_messages')
      .select('*')
      .eq('conversation_id', activeConvId)
      .order('created_at', { ascending: true });
    setMessages((data ?? []) as ZenoMessage[]);
  }, [activeConvId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const createConversation = useCallback(async () => {
    if (!user?.id) return null;
    const { data } = await supabase
      .from('zeno_conversations')
      .insert({ user_id: user.id })
      .select()
      .maybeSingle();
    if (data) {
      await fetchConversations();
    }
    return data as ZenoConversation | null;
  }, [user?.id, fetchConversations]);

  const sendMessage = useCallback(async (conversationId: string, text: string) => {
    if (!user?.id || !text.trim() || sending) return null;
    setSending(true);

    try {
      // 1. Salva mensagem do user
      const { data: userMsg } = await supabase
        .from('zeno_messages')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: 'user',
          content: text.trim(),
        })
        .select()
        .maybeSingle();

      if (userMsg) {
        setMessages((prev) => [...prev, userMsg as ZenoMessage]);
      }

      // 2. Chama edge function zeno-coach
      const { data: aiResp, error } = await supabase.functions.invoke('zeno-coach', {
        body: { message: text.trim() },
      });

      if (error || !aiResp?.reply) {
        const errorMsg = aiResp?.error || error?.message || 'ZENO está fora do ar agora.';
        await supabase
          .from('zeno_messages')
          .insert({
            conversation_id: conversationId,
            user_id: user.id,
            role: 'assistant',
            content: errorMsg,
          });
        await fetchMessages();
        return null;
      }

      // 3. Salva resposta da IA
      const { data: assistantMsg } = await supabase
        .from('zeno_messages')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: 'assistant',
          content: aiResp.reply,
          provider: aiResp.provider ?? null,
          model_used: aiResp.model_used ?? null,
        })
        .select()
        .maybeSingle();

      if (assistantMsg) {
        setMessages((prev) => [...prev, assistantMsg as ZenoMessage]);
      }

      await fetchConversations();
      return assistantMsg as ZenoMessage | null;
    } finally {
      setSending(false);
    }
  }, [user?.id, sending, fetchMessages, fetchConversations]);

  return {
    conversations,
    messages,
    loading,
    sending,
    createConversation,
    sendMessage,
    refetchConversations: fetchConversations,
    refetchMessages: fetchMessages,
  };
}
