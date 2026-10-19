import React, { useState } from 'react';
import { Sparkles, Key, Loader2, ArrowRight, RefreshCw, Wand2, CheckCircle2, AlertCircle } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { ExerciseGuide, WorkShift } from '../types';
import { WORK_SHIFTS } from '../data/exercises';

interface AiPauseGeneratorProps {
  currentShift: WorkShift;
  onStartGeneratedExercise: (exercise: ExerciseGuide) => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

const HOSPITAL_PRESETS = [
  'Salí de Código Azul o procedimiento de alta presión',
  'Sobrecarga sensorial en urgencias o UCI',
  'Fatiga muscular por larga bipedestación o rondas',
  'Cansancio profundo en turno de madrugada',
  'Pausa de desconexión antes de entrega de turno',
];

export const AiPauseGenerator: React.FC<AiPauseGeneratorProps> = ({
  currentShift,
  onStartGeneratedExercise,
  onOpenApiKeyModal,
  hasApiKey,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>(HOSPITAL_PRESETS[0]);
  const [customInput, setCustomInput] = useState<string>('');
  const [useCustom, setUseCustom] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedExercise, setGeneratedExercise] = useState<ExerciseGuide | null>(null);

  const activeShiftName = WORK_SHIFTS.find((s) => s.id === currentShift)?.name || 'Jornada';

  const handleGenerate = async () => {
    if (!hasApiKey) {
      onOpenApiKeyModal();
      return;
    }

    const situation = useCustom && customInput.trim() ? customInput.trim() : selectedPreset;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const exercise = await GeminiService.generatePersonalizedPause(situation, activeShiftName);
      setGeneratedExercise(exercise);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al generar la pausa con Gemini.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-white via-cyan-50/40 to-blue-50/30 rounded-3xl p-6 sm:p-7 border border-[#009BB0]/25 shadow-md relative overflow-hidden">
      {/* Detalle visual superior */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-200/80">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#0A3B74] to-[#009BB0] text-white shadow-sm shrink-0">
            <Wand2 className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-[#0A3B74]">
                Pausa Consciente Personalizada con Gemini AI
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E6F7F9] text-[#007B8C] border border-[#009BB0]/30">
                Turno {activeShiftName}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Adapta el minuto de respiración a tu momento exacto en el hospital mediante Inteligencia Artificial.
            </p>
          </div>
        </div>

        {/* Indicador y botón de clave */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {hasApiKey ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gemini Conectado</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenApiKeyModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>Configurar API Key</span>
            </button>
          )}
        </div>
      </div>

      {/* Selector de situación asistencial */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            ¿Cuál es tu situación o necesidad en este momento del turno?
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {HOSPITAL_PRESETS.map((preset, idx) => {
              const isSelected = !useCustom && selectedPreset === preset;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(preset);
                    setUseCustom(false);
                    setGeneratedExercise(null);
                  }}
                  className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A3B74] text-white border-[#0A3B74] shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90'
                  }`}
                >
                  {preset}
                </button>
              );
            })}

            {/* Opción personalizada */}
            <button
              type="button"
              onClick={() => {
                setUseCustom(true);
                setGeneratedExercise(null);
              }}
              className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                useCustom
                  ? 'bg-[#0A3B74] text-white border-[#0A3B74] shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90'
              }`}
            >
              ✏️ Describir otra situación...
            </button>
          </div>
        </div>

        {useCustom && (
          <div className="animate-fadeIn">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Ejemplo: Llevo 5 horas de cirugía continua y siento tensión cervical..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#009BB0] focus:ring-2 focus:ring-[#009BB0]/20 text-xs font-medium text-slate-800 focus:outline-hidden"
            />
          </div>
        )}

        {/* Botón para generar con IA */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#009BB0] to-[#0A3B74] hover:from-[#00899c] hover:to-[#08305e] text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-cyan-200" />
                <span>Generando con Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generar mi micro-pausa de 1 minuto con IA</span>
              </>
            )}
          </button>

          {!hasApiKey && (
            <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
              <Key className="w-3 h-3 text-amber-600" />
              Requiere ingresar tu API Key gratuita desde el botón superior 🔑
            </span>
          )}
        </div>

        {/* Mensaje de error si ocurre */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{errorMsg}</span>
              {!hasApiKey && (
                <button
                  type="button"
                  onClick={onOpenApiKeyModal}
                  className="block mt-1 font-bold underline hover:text-rose-900"
                >
                  Abrir configuración de API Key 🔑
                </button>
              )}
            </div>
          </div>
        )}

        {/* Resultado generado */}
        {generatedExercise && (
          <div className="mt-4 p-5 rounded-2xl bg-white border-2 border-[#009BB0]/40 shadow-md animate-scaleUp">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E6F7F9] text-[#007B8C]">
                    Ejercicio Generado por Gemini
                  </span>
                  <span className="text-xs font-bold text-slate-400">• 1 minuto exacto</span>
                </div>
                <h4 className="text-base font-extrabold text-[#0A3B74] mt-1">
                  {generatedExercise.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium">{generatedExercise.subtitle}</p>
              </div>

              <button
                type="button"
                onClick={() => onStartGeneratedExercise(generatedExercise)}
                className="px-5 py-2.5 rounded-xl bg-[#C41230] hover:bg-[#a80f29] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
              >
                <span>Comenzar este minuto ahora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-1">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#0A3B74] uppercase tracking-wide">
                  Patrón Respiratorio:
                </span>
                <p className="text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-lg font-mono border border-slate-200">
                  {generatedExercise.patternName}
                </p>
                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  {generatedExercise.phases.slice(0, 2).map((phase, i) => (
                    <p key={i} className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#009BB0]" />
                      <strong>{phase.name}:</strong> {phase.instruction}
                    </p>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-amber-900 block mb-1">
                    Afirmación HUV generada:
                  </span>
                  <p className="text-xs italic text-amber-950 font-serif leading-relaxed">
                    "{generatedExercise.mindfulPrompts[0]}"
                  </p>
                </div>
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="text-[11px] text-[#009BB0] hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerar variante
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
