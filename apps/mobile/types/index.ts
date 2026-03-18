export interface UserProfile {
  id: string;
  name: string;
  weight: number;
  height: number;
  waist: number;
  birthDate: string;
  gender: 'male' | 'female';
  currentOmega: OmegaBrand | null;
  createdAt: string;
  language: 'pt' | 'en' | 'es';
  protocolStartDate: string | null;
}

export interface OmegaBrand {
  id: string;
  name: string;
  dosage: string;
  pricePerMonth: number;
  usersCount: number;
  avgRatioBefore: number;
  avgRatioAfter: number;
  improvementRate: number;
}

export interface DailyCheckIn {
  id: string;
  date: string;
  weight: number | null;
  sleepQuality: number;
  waterLiters: number;
  waist: number | null;
  tookOmega: boolean;
}

export interface ScanResult {
  id: string;
  productName: string;
  score: number;
  verdict: 'excellent' | 'good' | 'moderate' | 'avoid';
  ingredients: IngredientAnalysis[];
  personalImpact: string;
  suggestion: string | null;
  scannedAt: string;
}

export interface IngredientAnalysis {
  name: string;
  score: 'good' | 'moderate' | 'bad';
  tag: string;
}

export interface WeekStreak {
  day: string;
  status: 'done' | 'today' | 'future';
}

export interface CommunityMetrics {
  totalMembers: number;
  totalWeightLost: number;
  avgRatioBefore: number;
  avgRatioAfter: number;
  sleepImproved: number;
  painReduced: number;
}
