// AI Provider abstraction
// Supports Gemini (free tier) and Anthropic (paid).
// Set AI_PROVIDER env var to 'gemini' or 'anthropic' (defaults to 'gemini' if GEMINI_API_KEY exists).

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
  model_tier?: 'fast' | 'best';
}

export interface AIResponse {
  text: string;
  provider: 'gemini' | 'anthropic';
  model_used: string;
  error?: string;
}

const MODEL_MAP = {
  gemini: {
    fast: 'gemini-2.5-flash',
    best: 'gemini-2.5-pro',
  },
  anthropic: {
    fast: 'claude-haiku-4-5-20251001',
    best: 'claude-sonnet-4-6-20251022',
  },
};

export function getProvider(): 'gemini' | 'anthropic' | null {
  const explicit = Deno.env.get('AI_PROVIDER');
  if (explicit === 'gemini' || explicit === 'anthropic') return explicit;
  if (Deno.env.get('GEMINI_API_KEY')) return 'gemini';
  if (Deno.env.get('ANTHROPIC_API_KEY')) return 'anthropic';
  return null;
}

export async function callAI(req: AIRequest): Promise<AIResponse> {
  const provider = getProvider();
  if (!provider) {
    return {
      text: '',
      provider: 'gemini',
      model_used: 'none',
      error: 'No AI provider configured. Set GEMINI_API_KEY or ANTHROPIC_API_KEY in Supabase secrets.',
    };
  }

  const modelTier = req.model_tier ?? 'fast';
  const model = MODEL_MAP[provider][modelTier];

  if (provider === 'gemini') {
    return await callGemini(req, model);
  }
  return await callAnthropic(req, model);
}

async function callGemini(req: AIRequest, model: string): Promise<AIResponse> {
  const key = Deno.env.get('GEMINI_API_KEY')!;
  // Gemini uses a single contents array. We put system instruction in systemInstruction.
  const parts: Array<{ text?: string; inline_data?: { mime_type: string; data: string } }> = [];

  // Build user message (Gemini does not differentiate messages the same way for short prompts)
  const userText = req.messages
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n\n');
  parts.push({ text: userText });

  if (req.image) {
    parts.push({
      inline_data: { mime_type: req.image.mime_type, data: req.image.data },
    });
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
  const text =
    data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join('') || '';

  return { text, provider: 'gemini', model_used: model };
}

async function callAnthropic(req: AIRequest, model: string): Promise<AIResponse> {
  const key = Deno.env.get('ANTHROPIC_API_KEY')!;

  const messages: Array<{ role: string; content: unknown }> = req.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Attach image to last user message if present
  if (req.image && messages.length > 0) {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === 'user') {
      lastMsg.content = [
        { type: 'text', text: lastMsg.content as string },
        {
          type: 'image',
          source: { type: 'base64', media_type: req.image.mime_type, data: req.image.data },
        },
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
      model,
      max_tokens: req.max_tokens ?? 2000,
      system: req.system,
      messages,
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
