import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ZenoCore } from './ZenoCore';
import { ZenoChat } from './ZenoChat';

export function ZenoFloatingButton() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Não mostrar dentro da rota /zeno (já é a tela do chat)
  if (location.pathname.startsWith('/zeno')) return null;
  if (location.pathname.startsWith('/login') || location.pathname.startsWith('/signup') || location.pathname.startsWith('/onboarding')) return null;

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="Abrir ZENO"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition-opacity" />
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-violet-950 border-2 border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
            <ZenoCore state="idle" size="md" showGlow={false} />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
        </div>
      </motion.button>

      {/* Tooltip on first sight */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="fixed bottom-12 right-28 md:right-32 z-30 bg-white px-4 py-2 rounded-2xl rounded-br-sm shadow-xl border border-violet-100 pointer-events-none"
        style={{ display: open ? 'none' : undefined }}
      >
        <p className="text-xs font-bold text-violet-950">Fala comigo</p>
        <p className="text-[10px] text-gray-500">Estou aqui ZENO</p>
      </motion.div>

      {/* Overlay panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-violet-950/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full md:max-w-5xl h-[88vh] md:h-[85vh] bg-violet-50 rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white shadow-md"
              >
                <X className="w-5 h-5 text-violet-700" />
              </button>
              <div className="h-full overflow-y-auto">
                <ZenoChat />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
