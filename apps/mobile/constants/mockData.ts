import { OmegaBrand, CommunityMetrics } from '../types';

export const omegaBrands: OmegaBrand[] = [
  {
    id: '1',
    name: 'Nordic Naturals Ultimate',
    dosage: '2.840mg/dia',
    pricePerMonth: 37,
    usersCount: 847,
    avgRatioBefore: 12,
    avgRatioAfter: 3,
    improvementRate: 73,
  },
  {
    id: '2',
    name: 'NOW Foods Ultra Omega-3',
    dosage: '1.000mg/dia',
    pricePerMonth: 18,
    usersCount: 523,
    avgRatioBefore: 14,
    avgRatioAfter: 6,
    improvementRate: 52,
  },
  {
    id: '3',
    name: 'Nature Made Fish Oil',
    dosage: '1.200mg/dia',
    pricePerMonth: 12,
    usersCount: 1241,
    avgRatioBefore: 18,
    avgRatioAfter: 11,
    improvementRate: 31,
  },
  {
    id: '4',
    name: 'Kirkland Signature Fish Oil',
    dosage: '1.000mg/dia',
    pricePerMonth: 8,
    usersCount: 2105,
    avgRatioBefore: 20,
    avgRatioAfter: 14,
    improvementRate: 24,
  },
  {
    id: '5',
    name: 'Life Extension Super Omega',
    dosage: '2.000mg/dia',
    pricePerMonth: 28,
    usersCount: 389,
    avgRatioBefore: 11,
    avgRatioAfter: 4,
    improvementRate: 68,
  },
];

export const communityMetrics: CommunityMetrics = {
  totalMembers: 2847,
  totalWeightLost: 12340,
  avgRatioBefore: 12,
  avgRatioAfter: 4.2,
  sleepImproved: 73,
  painReduced: 89,
};

export const mockWeightHistory = [
  { date: '2026-03-05', weight: 91.2 },
  { date: '2026-03-06', weight: 90.8 },
  { date: '2026-03-07', weight: 90.5 },
  { date: '2026-03-08', weight: 91.0 },
  { date: '2026-03-09', weight: 90.1 },
  { date: '2026-03-10', weight: 89.7 },
  { date: '2026-03-11', weight: 89.9 },
  { date: '2026-03-12', weight: 89.3 },
  { date: '2026-03-13', weight: 89.0 },
  { date: '2026-03-14', weight: 88.5 },
  { date: '2026-03-15', weight: 88.2 },
  { date: '2026-03-16', weight: 88.0 },
  { date: '2026-03-17', weight: 87.6 },
];

export const mockSleepHistory = [
  { date: '2026-03-11', quality: 2 },
  { date: '2026-03-12', quality: 2.5 },
  { date: '2026-03-13', quality: 3 },
  { date: '2026-03-14', quality: 2.8 },
  { date: '2026-03-15', quality: 3.5 },
  { date: '2026-03-16', quality: 3.8 },
  { date: '2026-03-17', quality: 4 },
];
