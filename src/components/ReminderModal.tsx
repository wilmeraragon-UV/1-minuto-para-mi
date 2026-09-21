import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Bell, Volume2, ShieldCheck, Clock, Check, Smartphone, Play } from 'lucide-react';
import { ReminderConfig, WorkShift, GentleToneType } from '../types';
import { WORK_SHIFTS } from '../data/exercises';
import { soundService } from '../services/soundService';
import { NotificationService } from '../services/notificationService';

interface ReminderModalProps {
  config: ReminderConfig;
  onSaveConfig: (newConfig: ReminderConfig) => void;
  onClose: () => void;
  onTriggerTestAlert: () => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  config,
  onSaveConfig,
  onClose,
  onTriggerTestAlert,
}) => {
  const [formData, setFormData] = useState<ReminderConfig>({ ...config });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );

  const handleRequestPermission = async () => {
    const granted = await NotificationService.requestBrowserPermission();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
    setFormData((prev) => ({ ...prev, browserNotifications: granted }));
  };

  const handlePreviewTone = (tone: GentleToneType) => {
    soundService.playConfiguredTone(tone, 0.4);
  };

  const handleSave = () => {
    onSaveConfig(formData);
    onClose();
  };

  const frequencies = [
    { mins: 30, label: 'Cada 30 min', desc: 'Para turnos de alta demanda o urgencias' },
    { mins: 45, label: 'Cada 45 min', desc: 'Recomendado para rotación clínica' },
    { mins: 60, label: 'Cada 60 min', desc: 'Ideal para equilibrio en piso y salas' },
    { mins: 90, label: 'Cada 90 min', desc: 'Para personal administrativo' },
    { mins: 120, label: 'Cada 2 horas', desc: 'Pausas espaciadas' },
  ];

  const toneOptions: { id: GentleToneType; label: string; desc: string }[] = [
    { id: 'tazon_tibetano', label: 'Cuenco Tibetano', desc: 'Resonancia profunda y armónica' },
    { id: 'campana_zen', label: 'Campana Zen', desc: 'Tono cristalino y sereno' },
    { id: 'arpa_suave', label: 'Arpa Relajante', desc: 'Arpegio melódico reconfortante' },
    { id: 'ola_mar', label: 'Ola de Mar', desc: 'Murmullo suave y orgánico' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Cabecera */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0A3B74] to-[#009BB0] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20">
              <Bell className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold leading-tight">
                Recordatorios Suaves de Relajación
              </h3>
              <p className="text-xs text-white/80">
                Pausas conscientes de 1 minuto durante tu jornada en el HUV
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {/* Switch principal de activación */}
          <div className="p-4 rounded-2xl bg-[#E6F7F9] border border-[#009BB0]/30 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-sm text-[#0A3B74] block">
                Activar recordatorios periódicos
              </span>
              <span className="text-xs text-slate-600">
                Te enviará un suave aviso para regalarte 60 segundos de calma durante tu turno.
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData((prev) => ({ ...prev, enabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A3B74]"></div>
            </label>
          </div>

          {/* Frecuencia de los recordatorios */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Frecuencia de las pausas conscientes
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {frequencies.map((f) => (
                <button
                  key={f.mins}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, frequencyMinutes: f.mins }))}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    formData.frequencyMinutes === f.mins
                      ? 'bg-[#0A3B74] text-white border-[#0A3B74] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm">{f.label}</span>
                  <span className={`text-[11px] mt-0.5 ${formData.frequencyMinutes === f.mins ? 'text-cyan-200' : 'text-slate-500'}`}>
                    {f.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Turno laboral activo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Turno hospitalario
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {WORK_SHIFTS.filter((s) => s.id !== 'personalizado').map((shift) => (
                <button
                  key={shift.id}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, shift: shift.id }))}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    formData.shift === shift.id
                      ? 'bg-[#009BB0] text-white border-[#009BB0] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-xs font-bold">{shift.name}</span>
                  <span className={`text-[10px] ${formData.shift === shift.id ? 'text-white/80' : 'text-slate-500'}`}>
                    {shift.timeRange}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sonido de la campana / cuenco */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Tono de campana suave
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {toneOptions.map((tone) => (
                <div
                  key={tone.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    formData.gentleTone === tone.id
                      ? 'bg-slate-100 border-[#0A3B74] ring-1 ring-[#0A3B74]'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, gentleTone: tone.id }))}
                    className="flex-1 text-left"
                  >
                    <span className="font-bold text-xs text-[#0A3B74] block">
                      {tone.label}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {tone.desc}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePreviewTone(tone.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#009BB0] hover:bg-white transition-colors"
                    title="Escuchar muestra de sonido"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Canales de notificación */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            {/* Notificaciones del navegador */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-[#009BB0]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Notificaciones en pantalla
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Avisos en el escritorio mientras tienes el navegador en segundo plano.
                  </span>
                </div>
              </div>

              {notificationPermission === 'granted' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Check className="w-3 h-3" /> Habilitadas
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A3B74] text-xs font-bold border border-slate-300 transition-colors"
                >
                  Permitir avisos
                </button>
              )}
            </div>

            {/* Vibración táctil en móvil */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                  <Smartphone className="w-4 h-4 text-[#0A3B74]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Vibración táctil suave
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Vibración discreta en el bolsillo en dispositivos móviles.
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={formData.vibrateEnabled}
                onChange={(e) => setFormData((prev) => ({ ...prev, vibrateEnabled: e.target.checked }))}
                className="w-4 h-4 text-[#0A3B74] rounded-sm focus:ring-[#009BB0]"
              />
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onTriggerTestAlert}
            className="text-xs font-semibold text-[#007B8C] hover:text-[#0A3B74] flex items-center gap-1.5 transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Probar aviso ahora</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              id="save-reminder-settings-btn"
              className="px-5 py-2 rounded-xl bg-[#0A3B74] hover:bg-[#06234B] text-white text-xs font-bold shadow-xs transition-colors"
            >
              Guardar configuración
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
