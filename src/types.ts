export type ExerciseCategory = 
  | 'urgencia'
  | 'enfoque'
  | 'relajacion'
  | 'fatiga_visual'
  | 'compasion';

export interface BreathPhase {
  name: 'inhala' | 'sosten' | 'exhala' | 'reposa';
  label: string;
  durationSeconds: number;
  instruction: string;
  cueAudioTone?: number; // frequency in Hz
}

export interface ExerciseGuide {
  id: string;
  title: string;
  subtitle: string;
  category: ExerciseCategory;
  categoryLabel: string;
  description: string;
  clinicalBenefit: string;
  idealFor: string;
  iconName: string;
  patternName: string;
  phases: BreathPhase[]; // One cycle of phases
  cycles: number; // Cycles to reach ~60s
  totalSeconds: number; // 60
  mindfulPrompts: string[];
}

export type WorkShift = 'manana' | 'tarde' | 'noche' | 'administrativo' | 'personalizado';

export interface ShiftInfo {
  id: WorkShift;
  name: string;
  timeRange: string;
  startHour: number;
  endHour: number;
  description: string;
}

export type GentleToneType = 'tazon_tibetano' | 'campana_zen' | 'arpa_suave' | 'ola_mar';

export interface ReminderConfig {
  enabled: boolean;
  frequencyMinutes: number; // 30, 45, 60, 90, 120
  shift: WorkShift;
  customStart: string; // "07:00"
  customEnd: string;   // "19:00"
  soundEnabled: boolean;
  browserNotifications: boolean;
  gentleTone: GentleToneType;
  vibrateEnabled: boolean;
  nextReminderTimestamp: number | null;
  lastCompletedTimestamp: number | null;
}

export interface SessionLog {
  id: string;
  timestamp: number;
  exerciseId: string;
  exerciseTitle: string;
  durationSeconds: number;
  moodBefore: number; // 1 (Muy estresado/agotado) a 5 (Muy sereno/enfocado)
  moodAfter: number;  // 1 a 5
  notes?: string;
  shiftDuring: WorkShift;
}

export interface HuvAffirmation {
  quote: string;
  author: string;
  category: string;
}
