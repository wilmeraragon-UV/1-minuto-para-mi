import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ExerciseSelector } from './components/ExerciseSelector';
import { BreathingSession } from './components/BreathingSession';
import { SessionCompletionModal } from './components/SessionCompletionModal';
import { ReminderModal } from './components/ReminderModal';
import { ReminderBanner } from './components/ReminderBanner';
import { WorkdayDashboard } from './components/WorkdayDashboard';
import { HuvBadge } from './components/HuvBadge';
import { HUV_EXERCISES } from './data/exercises';
import { soundService } from './services/soundService';
import { NotificationService, DEFAULT_REMINDER_CONFIG } from './services/notificationService';
import { ExerciseGuide, ReminderConfig, SessionLog, WorkShift } from './types';
import { Sparkles, HeartHandshake, ShieldCheck, Clock, Bell } from 'lucide-react';

const LOGS_STORAGE_KEY = 'huv_un_minuto_logs_v1';

export default function App() {
  // Configuración de recordatorios
  const [reminderConfig, setReminderConfig] = useState<ReminderConfig>(() => {
    return NotificationService.loadConfig();
  });

  // Estado de sonido
  const [isMuted, setIsMuted] = useState<boolean>(() => soundService.getIsMuted());

  // Estado de modales y sesiones
  const [activeExercise, setActiveExercise] = useState<ExerciseGuide | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false);
  const [isReminderBannerVisible, setIsReminderBannerVisible] = useState<boolean>(false);
  const [completedSessionData, setCompletedSessionData] = useState<{
    exercise: ExerciseGuide;
    durationSeconds: number;
    moodBefore: number;
  } | null>(null);

  // Historial de logs guardados
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(LOGS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignorar
    }
    return [];
  });

  // Guardar logs al cambiar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(sessionLogs));
    } catch (e) {
      console.warn('Error saving session logs', e);
    }
  }, [sessionLogs]);

  // Manejo de sonido
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundService.setMuted(nextMuted);
    setReminderConfig((prev) => {
      const updated = { ...prev, soundEnabled: !nextMuted };
      NotificationService.saveConfig(updated);
      return updated;
    });
  };

  // Cambio de turno laboral
  const handleShiftChange = (shift: WorkShift) => {
    setReminderConfig((prev) => {
      const updated = { ...prev, shift };
      NotificationService.saveConfig(updated);
      return updated;
    });
  };

  // Guardar nueva configuración de recordatorios
  const handleSaveReminderConfig = (newConfig: ReminderConfig) => {
    setReminderConfig(newConfig);
    NotificationService.saveConfig(newConfig);
  };

  // Disparar alerta de prueba
  const handleTriggerTestAlert = () => {
    NotificationService.sendGentleAlert(reminderConfig, () => {
      setActiveExercise(HUV_EXERCISES[0]);
    });
    setIsReminderBannerVisible(true);
  };

  // Iniciar ejercicio desde recordatorio o botón
  const handleStartPauseFromReminder = () => {
    setIsReminderBannerVisible(false);
    // Tomar el ejercicio recomendado para urgencias o coherencia
    const exerciseToStart = HUV_EXERCISES[0];
    setActiveExercise(exerciseToStart);
  };

  // Posponer recordatorio
  const handleSnooze = (minutes: number) => {
    setIsReminderBannerVisible(false);
    const snoozeTime = Date.now() + minutes * 60 * 1000;
    setReminderConfig((prev) => {
      const updated = { ...prev, nextReminderTimestamp: snoozeTime };
      NotificationService.saveConfig(updated);
      return updated;
    });
  };

  // Motor de verificación periódica de recordatorios
  useEffect(() => {
    if (!reminderConfig.enabled) return;

    const interval = setInterval(() => {
      const now = Date.now();

      // Verificar si estamos dentro del horario del turno
      const inShift = NotificationService.isWithinShiftHours(
        reminderConfig.shift,
        reminderConfig.customStart,
        reminderConfig.customEnd
      );
      if (!inShift) return;

      // Si hay un tiempo pospuesto o programado
      if (reminderConfig.nextReminderTimestamp) {
        if (now >= reminderConfig.nextReminderTimestamp) {
          // Disparar recordatorio
          NotificationService.sendGentleAlert(reminderConfig, () => {
            setActiveExercise(HUV_EXERCISES[0]);
          });
          setIsReminderBannerVisible(true);

          // Programar siguiente
          const nextTime = now + reminderConfig.frequencyMinutes * 60 * 1000;
          setReminderConfig((prev) => {
            const updated = { ...prev, nextReminderTimestamp: nextTime };
            NotificationService.saveConfig(updated);
            return updated;
          });
        }
        return;
      }

      // Si no hay timestamp programado, verificar tiempo desde la última sesión completada
      const lastTime = reminderConfig.lastCompletedTimestamp || now - (reminderConfig.frequencyMinutes * 60 * 1000);
      const elapsedMinutes = (now - lastTime) / (60 * 1000);

      if (elapsedMinutes >= reminderConfig.frequencyMinutes) {
        NotificationService.sendGentleAlert(reminderConfig, () => {
          setActiveExercise(HUV_EXERCISES[0]);
        });
        setIsReminderBannerVisible(true);

        const nextTime = now + reminderConfig.frequencyMinutes * 60 * 1000;
        setReminderConfig((prev) => {
          const updated = { ...prev, nextReminderTimestamp: nextTime };
          NotificationService.saveConfig(updated);
          return updated;
        });
      }
    }, 15000); // Chequeo cada 15 segundos

    return () => clearInterval(interval);
  }, [reminderConfig]);

  // Completar sesión de 1 minuto
  const handleFinishSession = useCallback((completedSeconds: number, moodBefore: number) => {
    if (activeExercise) {
      setCompletedSessionData({
        exercise: activeExercise,
        durationSeconds: completedSeconds,
        moodBefore,
      });
      setActiveExercise(null);
    }
  }, [activeExercise]);

  // Guardar sesión en el registro
  const handleSaveCompletedSession = (moodAfter: number, notes: string) => {
    if (!completedSessionData) return;

    const now = Date.now();
    const newLog: SessionLog = {
      id: `session-${now}`,
      timestamp: now,
      exerciseId: completedSessionData.exercise.id,
      exerciseTitle: completedSessionData.exercise.title,
      durationSeconds: completedSessionData.durationSeconds,
      moodBefore: completedSessionData.moodBefore,
      moodAfter,
      notes,
      shiftDuring: reminderConfig.shift,
    };

    setSessionLogs((prev) => [newLog, ...prev]);

    // Actualizar timestamp en la configuración del recordatorio para resetear intervalo
    const nextTime = now + reminderConfig.frequencyMinutes * 60 * 1000;
    setReminderConfig((prev) => {
      const updated = {
        ...prev,
        lastCompletedTimestamp: now,
        nextReminderTimestamp: nextTime,
      };
      NotificationService.saveConfig(updated);
      return updated;
    });

    setCompletedSessionData(null);
  };

  // Métricas de hoy
  const todayDateStr = new Date().toDateString();
  const todayLogs = sessionLogs.filter(
    (l) => new Date(l.timestamp).toDateString() === todayDateStr
  );
  const todayMinutes = todayLogs.reduce((acc, l) => acc + Math.round(l.durationSeconds / 60), 0);

  // Racha de días seguidos
  const calculateStreak = () => {
    if (sessionLogs.length === 0) return 0;
    const uniqueDays = Array.from(
      new Set(sessionLogs.map((l) => new Date(l.timestamp).toDateString()))
    );
    return uniqueDays.length;
  };
  const streakDays = calculateStreak();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-[#009BB0]/20 selection:text-[#0A3B74]">
      {/* Cabecera institucional HUV */}
      <Header
        isMuted={isMuted}
        onToggleMute={toggleMute}
        reminderConfig={reminderConfig}
        onOpenReminderModal={() => setIsReminderModalOpen(true)}
        todayMinutes={todayMinutes}
        streakDays={streakDays}
        currentShift={reminderConfig.shift}
        onChangeShift={handleShiftChange}
      />

      {/* Banner flotante de recordatorio suave cuando se activa */}
      <ReminderBanner
        isVisible={isReminderBannerVisible}
        onStartPause={handleStartPauseFromReminder}
        onSnooze={handleSnooze}
        onDismiss={() => setIsReminderBannerVisible(false)}
      />

      {/* Hero institucional de bienvenida y propósito */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8 space-y-8">
        <section className="bg-gradient-to-br from-[#0A3B74] via-[#083466] to-[#009BB0] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          {/* Ondas decorativas de fondo sutiles */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-40 h-40 rounded-full bg-[#009BB0]/20 blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-cyan-200 border border-white/20 mb-4 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Hospital Universitario del Valle "Evaristo García" E.S.E.</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white mb-3">
              1 minuto para ti en tu jornada de trabajo
            </h2>

            <p className="text-sm sm:text-base text-cyan-100 font-medium leading-relaxed mb-6">
              Durante tu turno en el hospital, tu cuerpo y mente absorben el ritmo acelerado de la atención en salud. 
              Regálate 60 segundos de respiración consciente: recupera la serenidad, disminuye el pulso y renueva tu energía para seguir cuidando con excelencia y calidad humana.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveExercise(HUV_EXERCISES[0])}
                id="hero-quick-start-btn"
                className="px-6 py-3 rounded-2xl bg-white text-[#0A3B74] font-extrabold text-xs sm:text-sm shadow-lg hover:bg-cyan-50 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Hacer mi pausa de 1 minuto ahora</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReminderModalOpen(true)}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <Bell className="w-4 h-4 text-cyan-300" />
                <span>Configurar avisos de turno</span>
              </button>
            </div>
          </div>
        </section>

        {/* Selector de ejercicios de 1 minuto */}
        <ExerciseSelector
          exercises={HUV_EXERCISES}
          onSelectExercise={(ex) => setActiveExercise(ex)}
          lastCompletedExerciseId={sessionLogs[0]?.exerciseId}
        />

        {/* Dashboard de seguimiento de la jornada */}
        <WorkdayDashboard
          logs={sessionLogs}
          todayMinutes={todayMinutes}
          streakDays={streakDays}
          onQuickStartEmergency={() => setActiveExercise(HUV_EXERCISES[0])}
        />

        {/* Pilares institucionales de autocuidado del HUV */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-700">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#E6F7F9] text-[#007B8C]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0A3B74] mb-1">
                Solo 60 Segundos
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Diseñado para intercalarse con facilidad entre rondas médicas, procedimientos clínicos y tareas administrativas sin interrumpir el flujo asistencial.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0A3B74] mb-1">
                Fisiología & Salud Laboral
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ejercicios basados en ritmos respiratorios que activan el sistema nervioso parasimpático y regulan la presión arterial ante situaciones de urgencia.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0A3B74] mb-1">
                Calidez y Humanización
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                El bienestar de nuestros pacientes en el Hospital Universitario del Valle inicia con la serenidad y la salud emocional de nuestro talento humano.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modal de Sesión Activa de 1 Minuto */}
      {activeExercise && (
        <BreathingSession
          exercise={activeExercise}
          onFinishSession={handleFinishSession}
          onCancel={() => setActiveExercise(null)}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />
      )}

      {/* Modal de Sesión Completada */}
      {completedSessionData && (
        <SessionCompletionModal
          exercise={completedSessionData.exercise}
          durationSeconds={completedSessionData.durationSeconds}
          moodBefore={completedSessionData.moodBefore}
          onSaveSession={handleSaveCompletedSession}
          onClose={() => setCompletedSessionData(null)}
        />
      )}

      {/* Modal de Configuración de Recordatorios */}
      {isReminderModalOpen && (
        <ReminderModal
          config={reminderConfig}
          onSaveConfig={handleSaveReminderConfig}
          onClose={() => setIsReminderModalOpen(false)}
          onTriggerTestAlert={handleTriggerTestAlert}
        />
      )}

      {/* Pie de página institucional del HUV */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HuvBadge variant="compact" />
            <div className="border-l border-slate-200 pl-3">
              <p className="font-semibold text-slate-700">
                Hospital Universitario del Valle "Evaristo García" E.S.E.
              </p>
              <p className="text-[11px] text-slate-400">
                Calle 5 No. 36-08 • Cali, Valle del Cauca • Colombia
              </p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <span className="font-semibold text-[#0A3B74] block">
              1 minuto para mi • Programa Institucional de Bienestar y Pausas Activas
            </span>
            <span className="text-[11px] text-slate-400">
              Salud Ocupacional • Comunidad Universitaria Univalle & HUV
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
