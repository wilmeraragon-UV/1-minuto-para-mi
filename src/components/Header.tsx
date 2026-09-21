import React from 'react';
import { Volume2, VolumeX, Bell, BellOff, Sparkles, Clock } from 'lucide-react';
import { HuvBadge } from './HuvBadge';
import { ReminderConfig, WorkShift } from '../types';
import { WORK_SHIFTS } from '../data/exercises';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  reminderConfig: ReminderConfig;
  onOpenReminderModal: () => void;
  todayMinutes: number;
  streakDays: number;
  currentShift: WorkShift;
  onChangeShift: (shift: WorkShift) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  reminderConfig,
  onOpenReminderModal,
  todayMinutes,
  streakDays,
  currentShift,
  onChangeShift,
}) => {
  const activeShiftInfo = WORK_SHIFTS.find((s) => s.id === currentShift) || WORK_SHIFTS[3];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Barra superior de identidad institucional HUV */}
      <div className="bg-[#0A3B74] text-white px-4 py-1 text-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wide text-cyan-200">
              PROGRAMA DE BIENESTAR Y SALUD OCUPACIONAL
            </span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <span className="text-white/80 text-[11px] hidden sm:inline">
              Cuidamos a quienes cuidan vidas
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {/* Selector rápido de turno laboral */}
            <div className="flex items-center gap-1.5 bg-[#06234B] px-2.5 py-0.5 rounded-full border border-white/10">
              <Clock className="w-3 h-3 text-[#009BB0]" />
              <label htmlFor="shift-select" className="text-white/70">Turno:</label>
              <select
                id="shift-select"
                value={currentShift}
                onChange={(e) => onChangeShift(e.target.value as WorkShift)}
                className="bg-transparent text-white font-medium text-[11px] focus:outline-hidden cursor-pointer"
              >
                {WORK_SHIFTS.map((s) => (
                  <option key={s.id} value={s.id} className="text-slate-900 bg-white">
                    {s.name} ({s.timeRange})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal de la cabecera */}
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo y título de la aplicación */}
          <div className="flex items-center gap-3">
            <HuvBadge variant="full" />
            
            <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-extrabold text-[#0A3B74] tracking-tight flex items-center gap-1.5">
                  1 minuto para mi
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E6F7F9] text-[#007B8C] border border-[#009BB0]/30">
                    HUV
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Pausas de relajación consciente y respiración para tu jornada laboral
              </p>
            </div>
          </div>

          {/* Acciones e indicadores de progreso */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Racha y minutos hoy */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-2xs">
              <div className="flex items-center gap-1 text-amber-600 font-bold text-xs" title="Días consecutivos de pausas activas">
                <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{streakDays} {streakDays === 1 ? 'día' : 'días'}</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="text-xs font-semibold text-slate-700">
                <span className="text-[#009BB0] font-extrabold">{todayMinutes}</span>
                <span className="text-slate-500 text-[11px] ml-1">min hoy</span>
              </div>
            </div>

            {/* Botón de configuración de recordatorios */}
            <button
              onClick={onOpenReminderModal}
              id="header-reminder-btn"
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                reminderConfig.enabled
                  ? 'bg-[#E6F7F9] text-[#007B8C] border-[#009BB0]/40 hover:bg-[#d5f3f7]'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title="Configurar recordatorios suaves durante la jornada"
            >
              {reminderConfig.enabled ? (
                <>
                  <Bell className="w-3.5 h-3.5 text-[#009BB0]" />
                  <span className="hidden xs:inline">Avisos cada {reminderConfig.frequencyMinutes}m</span>
                  <span className="xs:hidden">Avisos {reminderConfig.frequencyMinutes}m</span>
                </>
              ) : (
                <>
                  <BellOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>Avisos pausados</span>
                </>
              )}
            </button>

            {/* Botón de sonido (silenciar / activar cuencos y campanas) */}
            <button
              onClick={onToggleMute}
              id="header-mute-btn"
              type="button"
              className={`p-2 rounded-xl text-xs font-semibold transition-all border ${
                isMuted
                  ? 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                  : 'bg-[#0A3B74]/5 text-[#0A3B74] border-[#0A3B74]/20 hover:bg-[#0A3B74]/10'
              }`}
              title={isMuted ? 'Activar sonido relajante' : 'Silenciar sonido'}
              aria-label={isMuted ? 'Activar sonido relajante' : 'Silenciar sonido'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#0A3B74]" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
