import { ExerciseGuide, ShiftInfo, HuvAffirmation } from '../types';

export const WORK_SHIFTS: ShiftInfo[] = [
  {
    id: 'manana',
    name: 'Turno Mañana',
    timeRange: '07:00 a 13:00',
    startHour: 7,
    endHour: 13,
    description: 'Picos de rondas médicas, entrega de guardia y atención en salas.',
  },
  {
    id: 'tarde',
    name: 'Turno Tarde',
    timeRange: '13:00 a 19:00',
    startHour: 13,
    endHour: 19,
    description: 'Procedimientos, consultas especializadas y alta afluencia.',
  },
  {
    id: 'noche',
    name: 'Turno Noche',
    timeRange: '19:00 a 07:00',
    startHour: 19,
    endHour: 7,
    description: 'Guardias prolongadas, urgencias y manejo de la fatiga circadiana.',
  },
  {
    id: 'administrativo',
    name: 'Jornada Administrativa',
    timeRange: '08:00 a 17:00',
    startHour: 8,
    endHour: 17,
    description: 'Gestión hospitalaria, archivo, facturación y soporte asistencial.',
  },
  {
    id: 'personalizado',
    name: 'Horario Personalizado',
    timeRange: 'Ajustable',
    startHour: 7,
    endHour: 19,
    description: 'Configura tus propias horas de inicio y fin de jornada.',
  },
];

export const HUV_EXERCISES: ExerciseGuide[] = [
  {
    id: 'box-calma',
    title: 'Respiración Cuadrada (Box Breathing)',
    subtitle: 'Calma táctica para momentos de alta presión asistencial',
    category: 'urgencia',
    categoryLabel: 'Urgencias & Estrés',
    description: 'Patrón simétrico 4-4-4-4 utilizado en medicina y rescate para recuperar el control autonómico en solo 60 segundos.',
    clinicalBenefit: 'Regula la presión arterial, reduce el cortisol plasmático y despeja la sobrecarga sensorial.',
    idealFor: 'Tras una situación crítica en urgencias, entrega de turno o antes de una intervención.',
    iconName: 'ShieldAlert',
    patternName: '4s Inhala • 4s Sostén • 4s Exhala • 4s Reposa',
    phases: [
      { name: 'inhala', label: 'Inhala suave por la nariz', durationSeconds: 4, instruction: 'Llena tus pulmones con calma y serenidad.' },
      { name: 'sosten', label: 'Sostén el aire con suavidad', durationSeconds: 4, instruction: 'Siente la quietud en tu pecho.' },
      { name: 'exhala', label: 'Exhala lento por la boca', durationSeconds: 4, instruction: 'Suelta toda la prisa y la tensión acumulada.' },
      { name: 'reposa', label: 'Reposa en vacío', durationSeconds: 4, instruction: 'Permanece en paz antes de la siguiente inhalación.' },
    ],
    cycles: 4, // 15s por ciclo x 4 = 60s
    totalSeconds: 60,
    mindfulPrompts: [
      'Eres el pilar de salud de nuestra comunidad en el Valle.',
      'Inhala presencia, exhala cualquier preocupación ajena a este instante.',
      'Tus manos y tu mente necesitan este minuto de serenidad.',
      'Estás a salvo en este instante presente.',
    ],
  },
  {
    id: 'descompresion-478',
    title: 'Descompresión Nerviosa (4-7-8)',
    subtitle: 'Freno biológico al estrés y la taquicardia',
    category: 'relajacion',
    categoryLabel: 'Relajación Profunda',
    description: 'Técnica desarrollada por la medicina integrativa para activar inmediatamente el sistema parasimpático a través de una exhalación prolongada.',
    clinicalBenefit: 'Estimula el nervio vago, desacelera la frecuencia cardíaca y disipa la sensación de nudo en el pecho.',
    idealFor: 'Sensación de sobrepaso emocional, cansancio extremo o taquicardia por tensión.',
    iconName: 'HeartPulse',
    patternName: '4s Inhala • 7s Sostén • 8s Exhala',
    phases: [
      { name: 'inhala', label: 'Inhala profundamente', durationSeconds: 4, instruction: 'Aire fresco que oxigena cada una de tus células.' },
      { name: 'sosten', label: 'Sostén con calma', durationSeconds: 7, instruction: 'Retén sin forzar, tu ritmo cardíaco comienza a descender.' },
      { name: 'exhala', label: 'Exhala largo y continuo', durationSeconds: 8, instruction: 'Suelta con un suave suspiro todo el peso del día.' },
      { name: 'reposa', label: 'Transición breve', durationSeconds: 1, instruction: 'Prepárate para un nuevo ciclo reparador.' },
    ],
    cycles: 3, // 20s x 3 = 60s
    totalSeconds: 60,
    mindfulPrompts: [
      'Al exhalar largo, le envías a tu cerebro la señal de que todo está bajo control.',
      'Suelta los hombros lejos de las orejas.',
      'Este minuto te pertenece solo a ti.',
      'Gracias por tu dedicación incondicional a la salud humana.',
    ],
  },
  {
    id: 'coherencia-55',
    title: 'Coherencia Cardíaca (5-5)',
    subtitle: 'Sincronía entre corazón, mente y respiración',
    category: 'enfoque',
    categoryLabel: 'Enfoque & Claridad',
    description: 'Ritmo resonante de 6 respiraciones por minuto (0.1 Hz) que maximiza la variabilidad de la frecuencia cardíaca (VFC).',
    clinicalBenefit: 'Optimiza la claridad cognitiva, la memoria de trabajo y la estabilidad emocional para toma de decisiones.',
    idealFor: 'Antes de revisar historias clínicas complejas, iniciar ronda médica o turno administrativo.',
    iconName: 'Activity',
    patternName: '5s Inhala • 5s Exhala continuo',
    phases: [
      { name: 'inhala', label: 'Inhala continuo y suave', durationSeconds: 5, instruction: 'Expande tu abdomen de manera natural como una ola.' },
      { name: 'exhala', label: 'Exhala continuo y fluido', durationSeconds: 5, instruction: 'Deja que el aire fluya sin resistencia.' },
    ],
    cycles: 6, // 10s x 6 = 60s
    totalSeconds: 60,
    mindfulPrompts: [
      'Siente la armonía en cada latido de tu corazón.',
      'Claridad en tu mente para seguir tomando las mejores decisiones.',
      'Respirar a este ritmo restablece tu equilibrio interno.',
      'En el HUV trabajamos con ciencia y corazón.',
    ],
  },
  {
    id: 'pausa-ocular-postural',
    title: 'Descanso Ocular & Desconexión Postural',
    subtitle: 'Alivio de fatiga por pantallas, luces y bipedestación',
    category: 'fatiga_visual',
    categoryLabel: 'Ergonomía & Vista',
    description: 'Combinación de respiración rítmica con micro-estiramiento consciente de trapecios, cuello y relajación de la acomodación visual.',
    clinicalBenefit: 'Reduce la cefalea tensional, lubrica la superficie ocular y descontractura la zona cervical.',
    idealFor: 'Personal frente a computadores clínicos, microscopios, laboratorios o tras horas de pie.',
    iconName: 'Eye',
    patternName: '4s Inhala estirando • 6s Exhala soltando',
    phases: [
      { name: 'inhala', label: 'Inhala y mira a lo lejos', durationSeconds: 4, instruction: 'Despega la mirada de la pantalla y relaja los párpados.' },
      { name: 'sosten', label: 'Abre el pecho suavemente', durationSeconds: 2, instruction: 'Rueda tus hombros suavemente hacia atrás.' },
      { name: 'exhala', label: 'Exhala y suelta la mandíbula', durationSeconds: 6, instruction: 'Desaprieta los dientes, deja caer los hombros.' },
    ],
    cycles: 5, // 12s x 5 = 60s
    totalSeconds: 60,
    mindfulPrompts: [
      'Permite que tus ojos descansen de la luz artificial.',
      'Tu postura es el soporte de tu labor médica.',
      'Libera la tensión del cuello y la zona dorsal.',
      'Respira hondo: tu cuerpo agradece esta pausa consciente.',
    ],
  },
  {
    id: 'micro-gratitud',
    title: 'Pausa de Compasión & Gratitud',
    subtitle: 'Reconexión con el propósito vocacional del servidor de la salud',
    category: 'compasion',
    categoryLabel: 'Bienestar Interior',
    description: 'Meditación guiada de 60 segundos con visualización de calidez humana, bondad hacia uno mismo y recarga emocional.',
    clinicalBenefit: 'Previene el desgaste por empatía (compassion fatigue) y refuerza la resiliencia en el ambiente hospitalario.',
    idealFor: 'Momentos de cansancio anímico, frustración o para cerrar con serenidad la jornada.',
    iconName: 'Sparkles',
    patternName: '4s Inhala luz • 2s Reconoce • 4s Exhala alivio • 2s Sonríe',
    phases: [
      { name: 'inhala', label: 'Inhala amabilidad para ti', durationSeconds: 4, instruction: 'Reconoce todo el esfuerzo que has puesto hoy.' },
      { name: 'sosten', label: 'Abraza tu vocación', durationSeconds: 2, instruction: 'Siente el valor de tu presencia en este hospital.' },
      { name: 'exhala', label: 'Exhala con agradecimiento', durationSeconds: 4, instruction: 'Envía bienestar a ti mismo y a quienes te rodean.' },
      { name: 'reposa', label: 'Paz interna', durationSeconds: 2, instruction: 'Dibuja una pequeña sonrisa suave en tus labios.' },
    ],
    cycles: 5, // 12s x 5 = 60s
    totalSeconds: 60,
    mindfulPrompts: [
      'Para cuidar bien de otros, primero debes cuidar de ti.',
      'Cada vida tocada en el HUV lleva tu huella de servicio.',
      'No tienes que ser invencible, solo humano y compasivo.',
      'Respira hondo: tu esfuerzo tiene un valor incalculable.',
    ],
  },
];

export const HUV_AFFIRMATIONS: HuvAffirmation[] = [
  {
    quote: 'Para cuidar con calidez y excelencia, primero debes permitirte cuidar de ti mismo.',
    author: 'Hospital Universitario del Valle "Evaristo García" E.S.E.',
    category: 'Autocuidado',
  },
  {
    quote: 'Un minuto de respiración consciente restaura la serenidad que tus pacientes necesitan ver en ti.',
    author: 'Bienestar del Talento Humano HUV',
    category: 'Presencia',
  },
  {
    quote: 'La pausa no es pérdida de tiempo: es la recarga biológica que salva vidas.',
    author: 'Medicina Preventiva & Salud en el Trabajo',
    category: 'Salud Ocupacional',
  },
  {
    quote: 'En cada pasillo y sala del HUV, tu calma es un faro de esperanza para Cali y el Valle.',
    author: 'Comunidad Hospitalaria HUV',
    category: 'Vocación',
  },
  {
    quote: 'Inhala fuerza, exhala cansancio. Hoy estás haciendo una diferencia real.',
    author: 'Facultad de Salud Univalle & HUV',
    category: 'Resiliencia',
  },
];
