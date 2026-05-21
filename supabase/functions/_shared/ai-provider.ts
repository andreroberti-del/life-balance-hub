// AI Provider abstraction with FREE-TIER guardrails
// Default: Gemini 2.5 Flash (free tier 1500/day)
// Per-call quota check + usage logging to prevent any paid usage.

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIImageContent {
  type: 'image';
  mime_type: string;
  data: string;
}

export interface AIRequest {
  system: string;
  messages: AIMessage[];
  max_tokens?: number;
  json_mode?: boolean;
  image?: AIImageContent;
  /** Ignored: we always force Flash (free tier) regardless of model_tier hint */
  model_tier?: 'fast' | 'best';
}

export interface AIResponse {
  text: string;
  provider: 'gemini' | 'anthropic';
  model_used: string;
  error?: string;
  quota_blocked?: boolean;
  quota_reason?: string;
}

// CRITICAL: always Flash (free tier 1500/day).
// "best" tier requests are intentionally ignored — Roberti wants ZERO paid usage.
const FREE_TIER_MODEL = {
  gemini: 'gemini-2.5-flash',
  anthropic: 'claude-haiku-4-5-20251001',
};

export function getProvider(): 'gemini' | 'anthropic' | null {
  const explicit = Deno.env.get('AI_PROVIDER');
  if (explicit === 'gemini' || explicit === 'anthropic') return explicit;
  if (Deno.env.get('GEMINI_API_KEY')) return 'gemini';
  if (Deno.env.get('ANTHROPIC_API_KEY')) return 'anthropic';
  return null;
}

/**
 * Wrapper that enforces quota before calling AI and logs every call.
 * @param functionName  Identifies the calling edge function (zeno-coach, generate-workout-plan, scan-food)
 * @param userId        Auth user UUID (used for per-user quota)
 * @param req           AI request payload
 * @param supabase      Service-role Supabase client for quota check + logging
 */
export async function callAIWithQuota(
  functionName: string,
  userId: string,
  req: AIRequest,
  // deno-lint-ignore no-explicit-any
  supabase: any
): Promise<AIResponse> {
  const provider = getProvider();
  if (!provider) {
    return {
      text: '', provider: 'gemini', model_used: 'none',
      error: 'No AI provider configured. Set GEMINI_API_KEY (free) in Supabase secrets.',
    };
  }

  // 1. Check quota
  const { data: quota } = await supabase.rpc('check_ai_quota', {
    p_user_id: userId, p_function_name: functionName,
  });
  const q = quota?.[0];
  if (q && !q.allowed) {
    return {
      text: '', provider, model_used: 'blocked',
      quota_blocked: true,
      quota_reason: q.reason,
      error: q.reason,
    };
  }

  // 2. Call AI (forces Flash regardless of model_tier hint)
  const model = FREE_TIER_MODEL[provider];
  const result = provider === 'gemini'
    ? await callGemini(req, model)
    : await callAnthropic(req, model);

  // 3. Log usage (don't await, fire and forget)
  supabase.rpc('log_ai_usage', {
    p_user_id: userId,
    p_function_name: functionName,
    p_provider: provider,
    p_model_used: model,
    p_success: !result.error,
    p_error_message: result.error || null,
  }).then(() => undefined);

  return result;
}

/**
 * Direct AI call without quota check.
 * @deprecated Use callAIWithQuota for any user-facing call.
 */
export async function callAI(req: AIRequest): Promise<AIResponse> {
  const provider = getProvider();
  if (!provider) {
    return { text: '', provider: 'gemini', model_used: 'none',
      error: 'No AI provider configured. Set GEMINI_API_KEY in Supabase secrets.' };
  }
  const model = FREE_TIER_MODEL[provider];
  if (provider === 'gemini') return await callGemini(req, model);
  return await callAnthropic(req, model);
}

async function callGemini(req: AIRequest, model: string): Promise<AIResponse> {
  const key = Deno.env.get('GEMINI_API_KEY')!;
  const parts: Array<{ text?: string; inline_data?: { mime_type: string; data: string } }> = [];

  const userText = req.messages
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n\n');
  parts.push({ text: userText });

  if (req.image) {
    parts.push({ inline_data: { mime_type: req.image.mime_type, data: req.image.data } });
  }

  const body: Record<string, unknown> = {
    systemInstruction: { parts: [{ text: req.system }] },
    contents: [{ role: 'user', parts }],
    generationConfig: {
      maxOutputTokens: req.max_tokens ?? 2000,
      temperature: 0.7,
    },
  };

  if (req.json_mode) {
    (body.generationConfig as Record<string, unknown>).responseMimeType = 'application/json';
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    console.error('Gemini API error:', errText);
    return { text: '', provider: 'gemini', model_used: model, error: errText };
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join('') || '';
  return { text, provider: 'gemini', model_used: model };
}

async function callAnthropic(req: AIRequest, model: string): Promise<AIResponse> {
  const key = Deno.env.get('ANTHROPIC_API_KEY')!;

  const messages: Array<{ role: string; content: unknown }> = req.messages.map((m) => ({
    role: m.role, content: m.content,
  }));

  if (req.image && messages.length > 0) {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === 'user') {
      lastMsg.content = [
        { type: 'text', text: lastMsg.content as string },
        { type: 'image', source: { type: 'base64', media_type: req.image.mime_type, data: req.image.data } },
      ];
    }
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model, max_tokens: req.max_tokens ?? 2000, system: req.system, messages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Anthropic API error:', errText);
    return { text: '', provider: 'anthropic', model_used: model, error: errText };
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  return { text, provider: 'anthropic', model_used: model };
}
