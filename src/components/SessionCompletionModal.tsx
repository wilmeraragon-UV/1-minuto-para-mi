import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { Award, Check, Sparkles, HeartHandshake, ArrowRight } from 'lucide-react';
import { ExerciseGuide } from '../types';
import { HUV_AFFIRMATIONS } from '../data/exercises';

interface SessionCompletionModalProps {
  exercise: ExerciseGuide;
  durationSeconds: number;
  moodBefore: number;
  onSaveSession: (moodAfter: number, notes: string) => void;
  onClose: () => void;
}

export const SessionCompletionModal: React.FC<SessionCompletionModalProps> = ({
  exercise,
  durationSeconds,
  moodBefore,
  onSaveSession,
  onClose,
}) => {
  const [moodAfter, setMoodAfter] = useState<number>(Math.min(5, moodBefore + 2));
  const [notes, setNotes] = useState<string>('');
  const [randomQuote, setRandomQuote] = useState(HUV_AFFIRMATIONS[0]);

  useEffect(() => {
    // Escoger afirmación aleatoria
    const quote = HUV_AFFIRMATIONS[Math.floor(Math.random() * HUV_AFFIRMATIONS.length)];
    setRandomQuote(quote);

    // Lanzar confeti con paleta institucional del HUV
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0A3B74', '#009BB0', '#C41230', '#38BDF8', '#F59E0B'],
      });
    } catch {
      // Ignorar si el canvas no se monta
    }
  }, []);

  const handleSave = () => {
    onSaveSession(moodAfter, notes);
    onClose();
  };

  const moodEmojis = [
    { val: 1, label: 'Aún tenso/a', emoji: '😣' },
    { val: 2, label: 'Mejorando', emoji: '😐' },
    { val: 3, label: 'Despejado/a', emoji: '🙂' },
    { val: 4, label: 'Sereno/a', emoji: '😌' },
    { val: 5, label: 'Renovado/a', emoji: '✨' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Cabecera festiva */}
        <div className="bg-gradient-to-r from-[#0A3B74] to-[#009BB0] text-white p-6 text-center relative">
          <div className="w-14 h-14 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Award className="w-8 h-8 text-amber-300" />
          </div>

          <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/20 text-white mb-2">
            Pausa Consciente HUV
          </span>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            ¡1 minuto completado para ti!
          </h3>

          <p className="text-xs sm:text-sm text-cyan-100 font-medium mt-1">
            Has regalado a tu cuerpo y mente {durationSeconds} segundos de serenidad en el {exercise.title}.
          </p>
        </div>

        {/* Cuerpo del modal */}
        <div className="p-6 space-y-5">
          {/* Comparativo de estado emocional */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">
                ¿Cómo te sientes tras esta pausa?
              </label>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                <span>Antes: nivel {moodBefore}/5</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="font-bold text-[#009BB0]">Ahora: nivel {moodAfter}/5</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {moodEmojis.map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setMoodAfter(item.val)}
                  className={`p-2.5 rounded-xl text-center flex flex-col items-center transition-all ${
                    moodAfter === item.val
                      ? 'bg-[#0A3B74] text-white shadow-md ring-2 ring-[#009BB0]'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="text-2xl mb-1">{item.emoji}</span>
                  <span className="text-[10px] font-semibold leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nota opcional breve del turno */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nota o momento del turno (opcional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Tras atender urgencia, antes de ronda de piso, pausa de almuerzo..."
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#009BB0] focus:border-transparent bg-slate-50/50"
            />
          </div>

          {/* Tarjeta de afirmación institucional */}
          <div className="p-4 rounded-2xl bg-[#E6F7F9] border border-[#009BB0]/25 flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-[#007B8C] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#06234B] leading-relaxed">
              <p className="font-serif italic text-slate-700 mb-1">
                "{randomQuote.quote}"
              </p>
              <span className="font-semibold text-[11px] text-[#0A3B74]">
                — {randomQuote.author}
              </span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSave}
              id="save-session-btn"
              className="flex-1 py-3 px-4 rounded-2xl bg-[#0A3B74] hover:bg-[#06234B] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Guardar en mi jornada
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
