import React from 'react';
import { Sparkles, Calendar, TrendingUp, CheckCircle, Heart, ShieldAlert, ArrowUpRight, Flame } from 'lucide-react';
import { SessionLog } from '../types';

interface WorkdayDashboardProps {
  logs: SessionLog[];
  todayMinutes: number;
  streakDays: number;
  onQuickStartEmergency: () => void;
}

export const WorkdayDashboard: React.FC<WorkdayDashboardProps> = ({
  logs,
  todayMinutes,
  streakDays,
  onQuickStartEmergency,
}) => {
  // Filtrar logs de hoy
  const todayDateStr = new Date().toDateString();
  const todayLogs = logs.filter(
    (l) => new Date(l.timestamp).toDateString() === todayDateStr
  );

  // Calcular mejora promedio de calma
  const avgImprovement = todayLogs.length > 0
    ? (
        todayLogs.reduce((acc, l) => acc + (l.moodAfter - l.moodBefore), 0) /
        todayLogs.length
      ).toFixed(1)
    : null;

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Cabecera del Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Seguimiento de Salud Laboral • HUV
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0A3B74]">
            Mi Registro de Bienestar en el Turno
          </h2>
          <p className="text-xs text-slate-500">
            Pausas activas y micro-descansos de 60 segundos registrados durante el día
          </p>
        </div>

        {/* Botón de descompresión inmediata para alta tensión */}
        <button
          type="button"
          onClick={onQuickStartEmergency}
          id="emergency-pause-btn"
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
          title="Iniciar respiración cuadrada 4-4-4-4 inmediatamente para momentos de alta tensión médica"
        >
          <ShieldAlert className="w-4 h-4 fill-current" />
          <span>Descompresión Rápida (1 min)</span>
        </button>
      </div>

      {/* Métricas clave de la jornada */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Minutos hoy */}
        <div className="bg-gradient-to-br from-[#0A3B74]/5 to-[#009BB0]/10 p-4 rounded-2xl border border-[#0A3B74]/15 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A3B74]">
            Minutos Hoy
          </span>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-3xl font-black text-[#0A3B74]">
              {todayMinutes}
            </span>
            <span className="text-xs text-slate-500 font-semibold">min</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {todayMinutes >= 3 ? '🎉 Meta diaria cumplida' : `Faltan ${Math.max(0, 3 - todayMinutes)} min para la meta`}
          </span>
        </div>

        {/* Pausas completadas hoy */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Pausas Realizadas
          </span>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-3xl font-black text-slate-800">
              {todayLogs.length}
            </span>
            <span className="text-xs text-slate-500 font-semibold">sesiones</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {todayLogs.length > 0 ? 'Constancia activa en turno' : 'Sin pausas aún en el turno'}
          </span>
        </div>

        {/* Racha de días */}
        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Racha de Hábito
            </span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-3xl font-black text-amber-700">
              {streakDays}
            </span>
            <span className="text-xs text-amber-800/80 font-semibold">
              {streakDays === 1 ? 'día' : 'días'}
            </span>
          </div>
          <span className="text-[11px] text-amber-700/80">
            Compromiso con tu salud
          </span>
        </div>

        {/* Mejora de serenidad */}
        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Alivio Emocional
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-3xl font-black text-emerald-700">
              {avgImprovement ? `+${avgImprovement}` : '—'}
            </span>
            <span className="text-xs text-emerald-800/80 font-semibold">pts</span>
          </div>
          <span className="text-[11px] text-emerald-700/80">
            {avgImprovement ? 'Escala de calma post-pausa' : 'Medición antes/después'}
          </span>
        </div>
      </div>

      {/* Historial de pausas de hoy */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#0A3B74]" />
            <span>Pausas conscientes de tu jornada</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        {todayLogs.length === 0 ? (
          <div className="bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
              <Heart className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              Aún no has registrado una pausa en este turno.
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Solo necesitas 60 segundos. Elige cualquier técnica arriba para despejar tu mente y oxigenar tu cuerpo.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayLogs.map((log) => {
              const timeStr = new Date(log.timestamp).toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className="p-3.5 bg-slate-50/80 hover:bg-slate-100/70 rounded-2xl border border-slate-200/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#E6F7F9] border border-[#009BB0]/30 flex items-center justify-center text-[#007B8C] font-bold text-xs">
                      1m
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-[#0A3B74]">
                          {log.exerciseTitle}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {timeStr}
                        </span>
                      </div>
                      {log.notes && (
                        <p className="text-xs text-slate-500 italic mt-0.5">
                          "{log.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs self-end sm:self-auto">
                    <span className="text-slate-400 text-[11px]">Calma:</span>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md font-semibold text-[11px]">
                      {log.moodBefore}/5
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-bold text-[11px]">
                      {log.moodAfter}/5
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Banner de Bienestar HUV con recomendación clínica */}
      <div className="bg-gradient-to-r from-[#0A3B74] to-[#009BB0] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 flex-shrink-0">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">
              Cultura de Autocuidado en el Hospital Universitario del Valle
            </h4>
            <p className="text-xs text-cyan-100 mt-0.5 leading-relaxed">
              3 pausas de 1 minuto durante un turno reducen hasta un 34% los niveles de fatiga tensional y previenen el agotamiento crónico en trabajadores de la salud.
            </p>
          </div>
        </div>

        <div className="text-center sm:text-right flex-shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-200 block">
            HUV Evaristo García
          </span>
          <span className="text-[10px] text-white/80">
            Salud, Docencia e Innovación Humana
          </span>
        </div>
      </div>
    </section>
  );
};
