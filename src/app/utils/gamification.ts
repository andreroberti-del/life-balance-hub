// Gamification types and utilities
export interface Badge {
  id: string;
  name_en: string;
  name_pt: string;
  name_es: string;
  description_en: string;
  description_pt: string;
  description_es: string;
  icon: string;
  category: 'onboarding' | 'protocol' | 'scan' | 'community' | 'data' | 'achievement';
  requirement: number;
  earnedAt?: Date;
  isLocked: boolean;
}

export interface UserLevel {
  level: number;
  name_en: string;
  name_pt: string;
  name_es: string;
  minXP: number;
  maxXP: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date | null;
  isActive: boolean;
  graceUsed: boolean;
}

// Badge definitions per Design Guide
export const BADGES: Badge[] = [
  {
    id: 'first-scan',
    name_en: 'First Scan',
    name_pt: 'Primeiro Scan',
    name_es: 'Primer Escaneo',
    description_en: 'Scan your first food',
    description_pt: 'Escaneie sua primeira comida',
    description_es: 'Escanea tu primera comida',
    icon: '\u{1F4F8}',
    category: 'onboarding',
    requirement: 1,
    isLocked: true,
  },
  {
    id: 'week-warrior',
    name_en: 'Week Warrior',
    name_pt: 'Guerreiro Semanal',
    name_es: 'Guerrero Semanal',
    description_en: 'Maintain a 7-day streak',
    description_pt: 'Mantenha uma sequ\u00EAncia de 7 dias',
    description_es: 'Mant\u00E9n una racha de 7 d\u00EDas',
    icon: '\u{1F525}',
    category: 'protocol',
    requirement: 7,
    isLocked: true,
  },
  {
    id: 'omega-starter',
    name_en: 'Omega Starter',
    name_pt: 'Iniciante Omega',
    name_es: 'Iniciador Omega',
    description_en: 'Log Omega-3 for 7 days',
    description_pt: 'Registre Omega-3 por 7 dias',
    description_es: 'Registra Omega-3 durante 7 d\u00EDas',
    icon: '\u{1F48A}',
    category: 'protocol',
    requirement: 7,
    isLocked: true,
  },
  {
    id: 'inflammation-fighter',
    name_en: 'Inflammation Fighter',
    name_pt: 'Lutador Anti-Inflama\u00E7\u00E3o',
    name_es: 'Luchador Antiinflamatorio',
    description_en: 'Reduce inflammation score by 10%',
    description_pt: 'Reduza o score de inflama\u00E7\u00E3o em 10%',
    description_es: 'Reduce el puntaje de inflamaci\u00F3n en 10%',
    icon: '\u{1F6E1}\uFE0F',
    category: 'achievement',
    requirement: 10,
    isLocked: true,
  },
  {
    id: 'protocol-pioneer',
    name_en: 'Protocol Pioneer',
    name_pt: 'Pioneiro do Protocolo',
    name_es: 'Pionero del Protocolo',
    description_en: 'Complete Phase 1 (30 days)',
    description_pt: 'Complete a Fase 1 (30 dias)',
    description_es: 'Completa la Fase 1 (30 d\u00EDas)',
    icon: '\u{1F949}',
    category: 'protocol',
    requirement: 30,
    isLocked: true,
  },
  {
    id: 'halfway-hero',
    name_en: 'Halfway Hero',
    name_pt: 'Her\u00F3i da Metade',
    name_es: 'H\u00E9roe de la Mitad',
    description_en: 'Complete 60 days',
    description_pt: 'Complete 60 dias',
    description_es: 'Completa 60 d\u00EDas',
    icon: '\u{1F948}',
    category: 'protocol',
    requirement: 60,
    isLocked: true,
  },
  {
    id: 'data-driven',
    name_en: 'Data Driven',
    name_pt: 'Orientado por Dados',
    name_es: 'Impulsado por Datos',
    description_en: 'Connect wearable and sync 30 days',
    description_pt: 'Conecte wearable e sincronize 30 dias',
    description_es: 'Conecta wearable y sincroniza 30 d\u00EDas',
    icon: '\u231A',
    category: 'data',
    requirement: 30,
    isLocked: true,
  },
  {
    id: 'blood-warrior',
    name_en: 'Blood Warrior',
    name_pt: 'Guerreiro do Sangue',
    name_es: 'Guerrero de Sangre',
    description_en: 'Upload first blood work result',
    description_pt: 'Envie o primeiro resultado de exame de sangue',
    description_es: 'Sube el primer resultado de an\u00E1lisis de sangre',
    icon: '\u{1FA78}',
    category: 'data',
    requirement: 1,
    isLocked: true,
  },
  {
    id: 'community-champion',
    name_en: 'Community Champion',
    name_pt: 'Campe\u00E3o da Comunidade',
    name_es: 'Campe\u00F3n de la Comunidad',
    description_en: 'Give 50 High Fives',
    description_pt: 'D\u00EA 50 High Fives',
    description_es: 'Da 50 High Fives',
    icon: '\u{1F64C}',
    category: 'community',
    requirement: 50,
    isLocked: true,
  },
  {
    id: 'omega-master',
    name_en: 'Omega Master',
    name_pt: 'Mestre Omega',
    name_es: 'Maestro Omega',
    description_en: 'Reach 8%+ Omega-3 Index',
    description_pt: 'Alcance 8%+ no \u00CDndice Omega-3',
    description_es: 'Alcanza 8%+ en el \u00CDndice Omega-3',
    icon: '\u{1F31F}',
    category: 'achievement',
    requirement: 8,
    isLocked: true,
  },
  {
    id: 'transformation-complete',
    name_en: 'Transformation Complete',
    name_pt: 'Transforma\u00E7\u00E3o Completa',
    name_es: 'Transformaci\u00F3n Completa',
    description_en: 'Complete 120-day protocol',
    description_pt: 'Complete o protocolo de 120 dias',
    description_es: 'Completa el protocolo de 120 d\u00EDas',
    icon: '\u{1F3C6}',
    category: 'protocol',
    requirement: 120,
    isLocked: true,
  },
  {
    id: 'perfect-week',
    name_en: 'Perfect Week',
    name_pt: 'Semana Perfeita',
    name_es: 'Semana Perfecta',
    description_en: '7/7 perfect days',
    description_pt: '7/7 dias perfeitos',
    description_es: '7/7 d\u00EDas perfectos',
    icon: '\u2B50',
    category: 'protocol',
    requirement: 7,
    isLocked: true,
  },
  {
    id: 'scan-master',
    name_en: 'Scan Master',
    name_pt: 'Mestre do Scan',
    name_es: 'Maestro del Escaneo',
    description_en: 'Scan 100 foods',
    description_pt: 'Escaneie 100 alimentos',
    description_es: 'Escanea 100 alimentos',
    icon: '\u{1F4F7}',
    category: 'scan',
    requirement: 100,
    isLocked: true,
  },
  {
    id: 'workout-warrior',
    name_en: 'Workout Warrior',
    name_pt: 'Guerreiro do Treino',
    name_es: 'Guerrero del Entrenamiento',
    description_en: 'Complete 30 workouts',
    description_pt: 'Complete 30 treinos',
    description_es: 'Completa 30 entrenamientos',
    icon: '\u{1F4AA}',
    category: 'achievement',
    requirement: 30,
    isLocked: true,
  },
];

// Level system
export const LEVELS: UserLevel[] = [
  {
    level: 1,
    name_en: 'Wellness Novice',
    name_pt: 'Novato do Bem-Estar',
    name_es: 'Novato del Bienestar',
    minXP: 0,
    maxXP: 999,
  },
  {
    level: 2,
    name_en: 'Protocol Explorer',
    name_pt: 'Explorador do Protocolo',
    name_es: 'Explorador del Protocolo',
    minXP: 1000,
    maxXP: 4999,
  },
  {
    level: 3,
    name_en: 'Wellness Warrior',
    name_pt: 'Guerreiro do Bem-Estar',
    name_es: 'Guerrero del Bienestar',
    minXP: 5000,
    maxXP: 14999,
  },
  {
    level: 4,
    name_en: 'Health Champion',
    name_pt: 'Campe\u00E3o da Sa\u00FAde',
    name_es: 'Campe\u00F3n de la Salud',
    minXP: 15000,
    maxXP: 29999,
  },
  {
    level: 5,
    name_en: 'Life Balance Master',
    name_pt: 'Mestre do Life Balance',
    name_es: 'Maestro del Life Balance',
    minXP: 30000,
    maxXP: 999999,
  },
];

// XP rewards
export const XP_REWARDS = {
  scanMeal: 10,
  completeDailyChecklist: 50,
  perfectDay: 100,
  streakBonus: 5, // multiplied by streak days
  uploadBloodWork: 200,
  completePhase: 500,
  winChallenge: 300,
  completeWorkout: 20,
  highFive: 2,
};

// Utility functions
export function getLevelFromXP(xp: number): UserLevel {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getProgressToNextLevel(xp: number): { current: number; total: number; percentage: number } {
  const currentLevel = getLevelFromXP(xp);
  const nextLevelXP = currentLevel.maxXP + 1;
  const progress = xp - currentLevel.minXP;
  const total = nextLevelXP - currentLevel.minXP;
  const percentage = Math.min((progress / total) * 100, 100);

  return { current: progress, total, percentage };
}

export function calculateStreakBonus(streakDays: number): number {
  return streakDays * XP_REWARDS.streakBonus;
}

export function checkBadgeEligibility(badge: Badge, userProgress: any): boolean {
  // This would check against actual user data
  // Placeholder for now
  return false;
}
