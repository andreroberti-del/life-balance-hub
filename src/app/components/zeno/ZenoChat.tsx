import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Plus, Mic, MicOff, Sparkles, MessageSquare, Trash2 } from 'lucide-react';
import { useZenoChat, ZenoConversation } from '../../hooks/useZenoChat';
import { useVoiceReactive } from '../../hooks/useVoiceReactive';
import { ZenoCore, ZenoCoreState } from './ZenoCore';

export function ZenoChat() {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const { conversations, messages, sending, createConversation, sendMessage } = useZenoChat(activeConvId);
  const { amplitude, isListening, start, stop, error } = useVoiceReactive();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Auto-select first conversation
  useEffect(() => {
    if (!activeConvId && conversations.length > 0) {
      setActiveConvId(conversations[0].id);
    }
  }, [conversations, activeConvId]);

  const handleNew = async () => {
    const conv = await createConversation();
    if (conv) setActiveConvId(conv.id);
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    let convId = activeConvId;
    if (!convId) {
      const conv = await createConversation();
      if (!conv) return;
      convId = conv.id;
      setActiveConvId(convId);
    }

    const text = input;
    setInput('');
    await sendMessage(convId, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Decide estado da esfera
  let zenoState: ZenoCoreState = 'idle';
  if (sending) zenoState = 'processing';
  else if (isListening) zenoState = 'listening';
  else if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') zenoState = 'thinking';

  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">

          {/* Sidebar conversations */}
          <aside className="col-span-12 lg:col-span-3 bg-white rounded-3xl p-5 border border-violet-100 shadow-lg overflow-hidden flex flex-col">
            <button
              onClick={handleNew}
              className="w-full py-3 px-4 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 mb-4 shadow-md shadow-violet-500/20"
            >
              <Plus className="w-4 h-4" />
              Nova conversa
            </button>
            <div className="flex-1 overflow-y-auto space-y-1.5 -mx-1 px-1">
              {conversations.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">Nenhuma conversa ainda. Comece uma.</p>
              ) : (
                conversations.map((c: ZenoConversation) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      activeConvId === c.id
                        ? 'bg-violet-100 border border-violet-200'
                        : 'hover:bg-violet-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                      <p className="text-xs font-bold text-violet-950 truncate">
                        {c.title || 'Sem título'}
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-500">{c.message_count} mensagens</p>
                  </button>
                ))
              )}
            </div>
          </aside>

          {/* Chat main */}
          <main className="col-span-12 lg:col-span-9 bg-white rounded-3xl border border-violet-100 shadow-lg overflow-hidden flex flex-col">

            {/* Header com esfera */}
            <div className="relative bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-700 p-6 border-b border-violet-700">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="relative flex items-center gap-4">
                <ZenoCore state={zenoState} size="lg" amplitude={isListening ? amplitude : undefined} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">M7 AI Coach</p>
                  <h1 className="text-2xl font-bold text-white">ZENO</h1>
                  <p className="text-sm text-white/85 mt-1">
                    {sending && 'Pensando...'}
                    {isListening && !sending && 'Te ouvindo...'}
                    {!sending && !isListening && 'Aqui pra te guiar. Fale ou escreva.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && !sending && (
                <div className="text-center py-12">
                  <ZenoCore state="idle" size="xl" className="mx-auto mb-6" />
                  <h2 className="text-xl font-bold text-violet-950 mb-2">Pode falar comigo</h2>
                  <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                    Eu vejo seus dados (sono, peso, scans, humor, gratidão) e respondo direto, baseado em ciência.
                    Tenta perguntar algo sobre seu progresso ou seu protocolo.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mt-8">
                    {[
                      'Como tá meu progresso essa semana?',
                      'Por que minha razão Ômega ainda não baixou?',
                      'O que eu posso melhorar no sono?',
                      'Me dá um insight sobre meu humor',
                    ].map((s) => (
                      <button
                        key={s}
                        onClick={() => setInput(s)}
                        className="p-4 text-left bg-violet-50 hover:bg-violet-100 rounded-2xl border border-violet-100 transition-all"
                      >
                        <p className="text-sm text-violet-950">{s}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="flex-shrink-0 self-end mb-1">
                      <ZenoCore state="idle" size="xs" showGlow={false} />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      m.role === 'user'
                        ? 'bg-violet-500 text-white rounded-br-sm'
                        : 'bg-violet-50 text-violet-950 border border-violet-100 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    {m.role === 'assistant' && m.provider && (
                      <p className="text-[10px] text-violet-500/70 mt-2">
                        {m.provider} · {m.model_used}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}

              {sending && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 self-end mb-1">
                    <ZenoCore state="processing" size="xs" showGlow={false} />
                  </div>
                  <div className="bg-violet-50 text-violet-950 border border-violet-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
                    <p className="text-sm">ZENO está pensando...</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-violet-100 p-4">
              {error && (
                <p className="text-xs text-red-600 mb-2 text-center">{error}</p>
              )}
              <div className="flex items-end gap-2">
                <button
                  onClick={() => (isListening ? stop() : start())}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                  }`}
                  title={isListening ? 'Parar de gravar' : 'Gravar voz'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Fala com o ZENO..."
                  rows={1}
                  className="flex-1 px-4 py-3 rounded-2xl border-2 border-violet-100 focus:border-violet-500 focus:outline-none text-violet-950 placeholder:text-gray-400 resize-none"
                  style={{ maxHeight: '120px' }}
                />

                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="w-12 h-12 rounded-2xl bg-violet-500 hover:bg-violet-600 text-white flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-violet-500/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
