import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, ShieldAlert, HeartPulse, Activity, Eye, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { ExerciseGuide, ExerciseCategory } from '../types';

interface ExerciseSelectorProps {
  exercises: ExerciseGuide[];
  onSelectExercise: (exercise: ExerciseGuide) => void;
  lastCompletedExerciseId?: string;
}

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  exercises,
  onSelectExercise,
  lastCompletedExerciseId,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');

  const filtered = selectedFilter === 'todos'
    ? exercises
    : exercises.filter((e) => e.category === selectedFilter);

  const getCategoryIcon = (category: ExerciseCategory) => {
    switch (category) {
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

  const getCategoryBadgeClass = (category: ExerciseCategory) => {
    switch (category) {
      case 'urgencia':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'relajacion':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'enfoque':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'fatiga_visual':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'compasion':
      default:
        return 'bg-blue-50 text-[#0A3B74] border-blue-200';
    }
  };

  return (
    <section className="space-y-4">
      {/* Encabezado de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#0A3B74] tracking-tight">
            Elige tu pausa consciente de 1 minuto
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Micro-ejercicios validados clínicamente para aliviar la fatiga laboral en el HUV
          </p>
        </div>

        {/* Filtros rápidos por necesidad */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'todos', label: 'Todos (5)' },
            { id: 'urgencia', label: 'Urgencias' },
            { id: 'relajacion', label: 'Relajación' },
            { id: 'enfoque', label: 'Enfoque' },
            { id: 'fatiga_visual', label: 'Postura & Ojos' },
            { id: 'compasion', label: 'Vocación' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === tab.id
                  ? 'bg-[#0A3B74] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de ejercicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((exercise) => {
          const isRecentlyDone = exercise.id === lastCompletedExerciseId;

          return (
            <motion.div
              key={exercise.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#009BB0]/40 transition-all flex flex-col justify-between overflow-hidden relative"
            >
              {/* Banda de color superior según categoría */}
              <div className="h-1 bg-gradient-to-r from-[#0A3B74] to-[#009BB0]" />

              <div className="p-5 flex-1 flex flex-col">
                {/* Cabecera de la tarjeta */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    {getCategoryIcon(exercise.category)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isRecentlyDone && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" /> Realizado
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      <Clock className="w-3 h-3 text-[#009BB0]" /> 1 min
                    </span>
                  </div>
                </div>

                {/* Título y categoría */}
                <div className="mb-2">
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border mb-1.5 ${getCategoryBadgeClass(exercise.category)}`}>
                    {exercise.categoryLabel}
                  </span>
                  <h3 className="text-base font-extrabold text-[#0A3B74] leading-snug">
                    {exercise.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    {exercise.subtitle}
                  </p>
                </div>

                {/* Patrón de respiración */}
                <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-xl p-2.5 my-2.5 text-slate-700 text-xs font-medium">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Ritmo guiado:
                  </span>
                  <span className="font-semibold text-[#06234B]">
                    {exercise.patternName}
                  </span>
                </div>

                {/* Beneficio clínico y contexto ideal */}
                <div className="mt-auto pt-2 text-[11px] text-slate-500 leading-relaxed space-y-1">
                  <p>
                    <strong className="text-slate-700 font-semibold">Beneficio:</strong> {exercise.clinicalBenefit}
                  </p>
                  <p className="text-slate-400">
                    <strong className="text-slate-600 font-medium">Ideal:</strong> {exercise.idealFor}
                  </p>
                </div>
              </div>

              {/* Botón de inicio */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSelectExercise(exercise)}
                  id={`select-exercise-${exercise.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0A3B74] hover:bg-[#06234B] text-white font-bold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                  <span>Realizar pausa de 1 min</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
