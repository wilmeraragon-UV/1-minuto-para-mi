import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Play, Clock, X, Sparkles } from 'lucide-react';

interface ReminderBannerProps {
  isVisible: boolean;
  onStartPause: () => void;
  onSnooze: (minutes: number) => void;
  onDismiss: () => void;
}

export const ReminderBanner: React.FC<ReminderBannerProps> = ({
  isVisible,
  onStartPause,
  onSnooze,
  onDismiss,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          className="fixed top-18 inset-x-4 max-w-2xl mx-auto z-40 bg-gradient-to-r from-[#0A3B74] via-[#08305e] to-[#009BB0] text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-white/20"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/15 text-amber-300 flex-shrink-0 animate-bounce">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-200 bg-white/10 px-2 py-0.5 rounded-md">
                    Recordatorio de Pausa HUV
                  </span>
                  <span className="text-xs text-white/70">Solo 60 segundos</span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                  Tómate 1 minuto para ti
                </h4>
                <p className="text-xs text-white/90 mt-0.5 leading-relaxed">
                  Despeja tu mente, alinea tu respiración y renueva tu energía para seguir cuidando vidas.
                </p>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              <button
                type="button"
                onClick={() => onSnooze(5)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
                title="Avisarme en 5 minutos"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Posponer 5m</span>
              </button>

              <button
                type="button"
                onClick={onStartPause}
                id="banner-start-btn"
                className="px-4 py-2 rounded-xl bg-white text-[#0A3B74] font-extrabold text-xs shadow-md hover:bg-cyan-50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Iniciar 1 minuto</span>
              </button>

              <button
                type="button"
                onClick={onDismiss}
                className="p-2 text-white/60 hover:text-white transition-colors"
                title="Cerrar aviso"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
