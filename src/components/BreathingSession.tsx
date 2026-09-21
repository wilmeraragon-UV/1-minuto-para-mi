import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, X, Volume2, VolumeX, ShieldAlert, HeartPulse, Activity, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import { ExerciseGuide, BreathPhase } from '../types';
import { soundService } from '../services/soundService';

interface BreathingSessionProps {
  exercise: ExerciseGuide;
  onFinishSession: (completedSeconds: number, moodBefore: number) => void;
  onCancel: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const BreathingSession: React.FC<BreathingSessionProps> = ({
  exercise,
  onFinishSession,
  onCancel,
  isMuted,
  onToggleMute,
}) => {
  // Estado de la sesión
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [totalSecondsRemaining, setTotalSecondsRemaining] = useState<number>(60);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [phaseSecondsRemaining, setPhaseSecondsRemaining] = useState<number>(exercise.phases[0].durationSeconds);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [moodBefore, setMoodBefore] = useState<number>(2); // Por defecto un poco estresado
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number>(0);

  const currentPhase: BreathPhase = exercise.phases[currentPhaseIndex] || exercise.phases[0];

  // Referencias para timers precisos
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Iniciar sonido inicial al arrancar
  useEffect(() => {
    soundService.playTibetanBowl(0.35);
  }, []);

  // Timer principal de cuenta regresiva (60 segundos)
  useEffect(() => {
    if (!hasStarted || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTotalSecondsRemaining((prevTotal) => {
        if (prevTotal <= 1) {
          // Sesión completada (60s)
          clearInterval(timerRef.current!);
          soundService.playCompletionChime();
          onFinishSession(60, moodBefore);
          return 0;
        }

        // Manejar tiempo de fase
        setPhaseSecondsRemaining((prevPhase) => {
          if (prevPhase <= 1) {
            // Cambiar a la siguiente fase
            const nextIndex = (currentPhaseIndex + 1) % exercise.phases.length;
            const nextPhase = exercise.phases[nextIndex];
            setCurrentPhaseIndex(nextIndex);

            if (nextIndex === 0) {
              setCurrentCycle((c) => c + 1);
            }

            // Tocar sonido suave de la fase
            soundService.playPhaseCue(nextPhase.name);

            return nextPhase.durationSeconds;
          }
          return prevPhase - 1;
        });

        // Rotar prompt inspirador cada 15 segundos
        if ((60 - prevTotal) % 15 === 0) {
          setCurrentPromptIndex((prev) => (prev + 1) % exercise.mindfulPrompts.length);
        }

        return prevTotal - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStarted, isPlaying, currentPhaseIndex, exercise, moodBefore, onFinishSession]);

  // Manejo de play/pause
  const togglePlayPause = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setIsPlaying(true);
      soundService.playPhaseCue(exercise.phases[0].name);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = () => {
    setTotalSecondsRemaining(60);
    setCurrentPhaseIndex(0);
    setPhaseSecondsRemaining(exercise.phases[0].durationSeconds);
    setCurrentCycle(1);
    setIsPlaying(true);
    setHasStarted(true);
    soundService.playTibetanBowl(0.3);
  };

  // Cálculo de escala para la animación de respiración
  const getScaleTarget = () => {
    if (!hasStarted || !isPlaying) return 1;
    switch (currentPhase.name) {
      case 'inhala':
        return 1.45; // Expansión pulmonar completa
      case 'sosten':
        return 1.45; // Mantener expandido
      case 'exhala':
        return 0.95; // Contracción y desahogo
      case 'reposa':
        return 0.95; // Reposo en vacío
      default:
        return 1.1;
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase.name) {
      case 'inhala':
        return {
          bg: 'from-[#0A3B74] to-[#009BB0]',
          border: 'border-[#009BB0]',
          text: 'text-[#009BB0]',
          glow: 'rgba(0, 155, 176, 0.35)',
        };
      case 'sosten':
        return {
          bg: 'from-[#0A3B74] to-[#06234B]',
          border: 'border-amber-400',
          text: 'text-amber-500',
          glow: 'rgba(245, 158, 11, 0.3)',
        };
      case 'exhala':
        return {
          bg: 'from-[#009BB0] to-[#0A3B74]',
          border: 'border-[#0A3B74]',
          text: 'text-[#0A3B74]',
          glow: 'rgba(10, 59, 116, 0.35)',
        };
      case 'reposa':
        return {
          bg: 'from-slate-600 to-[#0A3B74]',
          border: 'border-emerald-500',
          text: 'text-emerald-600',
          glow: 'rgba(16, 185, 129, 0.25)',
        };
      default:
        return {
          bg: 'from-[#0A3B74] to-[#009BB0]',
          border: 'border-[#009BB0]',
          text: 'text-[#009BB0]',
          glow: 'rgba(0, 155, 176, 0.3)',
        };
    }
  };

  const phaseStyle = getPhaseColor();
  const progressPercent = ((60 - totalSecondsRemaining) / 60) * 100;
  const minutes = Math.floor(totalSecondsRemaining / 60);
  const seconds = totalSecondsRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const renderIcon = () => {
    switch (exercise.category) {
      case 'urgencia':
        return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      case 'relajacion':
        return <HeartPulse className="w-5 h-5 text-rose-500" />;
      case 'enfoque':
        return <Activity className="w-5 h-5 text-[#009BB0]" />;
      case 'fatiga_visual':
        return <Eye className="w-5 h-5 text-indigo-500" />;
      case 'compasion':
      default:
        return <Sparkles className="w-5 h-5 text-[#0A3B74]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-gradient-to-b from-white via-slate-50 to-[#EBF3F6] rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Barra superior de la sesión */}
        <div className="px-5 py-3.5 bg-white border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">
              {renderIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#009BB0]">
                  {exercise.categoryLabel}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">• 1 Minuto</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-[#0A3B74] leading-tight">
                {exercise.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              type="button"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#0A3B74]" />}
            </button>

            <button
              onClick={onCancel}
              type="button"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Salir de la sesión"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de progreso de los 60 segundos */}
        <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#0A3B74] via-[#009BB0] to-emerald-500 h-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Contenido interactivo */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center relative overflow-y-auto">
          {/* Pantalla previa: Selección de estado previo si no ha iniciado */}
          {!hasStarted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md text-center py-4 flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E6F7F9] text-[#007B8C] border border-[#009BB0]/30 mb-4">
                Hospital Universitario del Valle • Autocuidado
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#0A3B74] mb-2">
                Tómate 60 segundos conscientes
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                {exercise.subtitle}. {exercise.clinicalBenefit}
              </p>

              {/* Chequeo inicial de ánimo */}
              <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 text-left">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  ¿Cómo te sientes en este punto de tu turno?
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { val: 1, label: 'Muy tenso/a', emoji: '😣' },
                    { val: 2, label: 'Cansado/a', emoji: '😓' },
                    { val: 3, label: 'Neutro', emoji: '😐' },
                    { val: 4, label: 'Tranquilo/a', emoji: '🙂' },
                    { val: 5, label: 'Con energía', emoji: '✨' },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setMoodBefore(item.val)}
                      className={`p-2 rounded-xl text-center flex flex-col items-center transition-all ${
                        moodBefore === item.val
                          ? 'bg-[#0A3B74] text-white shadow-md ring-2 ring-[#009BB0]'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span className="text-xl mb-0.5">{item.emoji}</span>
                      <span className="text-[10px] font-semibold leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={togglePlayPause}
                id="start-breathing-btn"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#0A3B74] to-[#009BB0] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#0A3B74]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Play className="w-5 h-5 fill-current" />
                Iniciar mi minuto de pausa
              </button>
            </motion.div>
          )}

          {/* Núcleo visual animado de respiración durante la sesión */}
          {hasStarted && (
            <div className="w-full flex flex-col items-center justify-center py-2">
              {/* Cronómetro 60s superior */}
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tiempo restante:
                </span>
                <span className="font-mono text-xl font-extrabold text-[#0A3B74] bg-white px-3 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                  {formattedTime}
                </span>
              </div>

              {/* Anillo y Mandala de respiración */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-3">
                {/* Ondas concéntricas de aura */}
                <motion.div
                  animate={{
                    scale: getScaleTarget() * 1.15,
                    opacity: isPlaying ? [0.15, 0.35, 0.15] : 0.1,
                  }}
                  transition={{
                    duration: currentPhase.durationSeconds,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0A3B74]/20 to-[#009BB0]/30 blur-xl pointer-events-none"
                />

                {/* Círculo guía exterior */}
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-slate-300/80" />

                {/* Orbe principal de respiración */}
                <motion.div
                  animate={{
                    scale: getScaleTarget(),
                  }}
                  transition={{
                    duration: currentPhase.durationSeconds,
                    ease: 'easeInOut',
                  }}
                  className={`relative w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br ${phaseStyle.bg} flex flex-col items-center justify-center text-white shadow-xl shadow-[#0A3B74]/30 p-4 transition-colors duration-500`}
                >
                  {/* Reflejo de luz superior */}
                  <div className="absolute top-3 inset-x-6 h-6 rounded-full bg-white/20 blur-xs" />

                  {/* Nombre de la fase */}
                  <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-200 mb-1">
                    {currentPhase.name}
                  </span>

                  {/* Segundos de la fase */}
                  <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight drop-shadow-sm">
                    {phaseSecondsRemaining}
                  </span>

                  <span className="text-[10px] text-white/70 font-medium">segundos</span>
                </motion.div>
              </div>

              {/* Etiqueta y guía instructiva de la fase activa */}
              <div className="text-center mt-2 max-w-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentPhase.name}-${currentPhaseIndex}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    <h4 className={`text-base sm:text-lg font-extrabold ${phaseStyle.text} mb-1`}>
                      {currentPhase.label}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-snug">
                      {currentPhase.instruction}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mensaje inspirador rotativo para personal del HUV */}
              <div className="mt-5 px-4 py-2 bg-white/80 rounded-xl border border-slate-200/80 text-center max-w-md">
                <p className="text-xs italic text-slate-600 font-serif">
                  "{exercise.mindfulPrompts[currentPromptIndex]}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Barra inferior de controles de reproducción */}
        {hasStarted && (
          <div className="px-6 py-4 bg-white border-t border-slate-200/80 flex items-center justify-between">
            <button
              onClick={handleRestart}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Reiniciar 60 segundos"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>

            {/* Botón central Play/Pausa */}
            <button
              onClick={togglePlayPause}
              id="pause-resume-btn"
              type="button"
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#0A3B74] text-white font-bold text-xs sm:text-sm shadow-md hover:bg-[#06234B] transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Reanudar</span>
                </>
              )}
            </button>

            {/* Terminar antes si el usuario necesita atender una urgencia */}
            <button
              onClick={() => {
                const elapsed = 60 - totalSecondsRemaining;
                if (elapsed >= 15) {
                  onFinishSession(elapsed, moodBefore);
                } else {
                  onCancel();
                }
              }}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Cerrar sesión"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Completar</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
