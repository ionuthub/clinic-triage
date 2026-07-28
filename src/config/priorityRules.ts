import type { ClinicalSignals, PriorityBand, ReferralType } from '../types/domain';

export interface RuleContext extends ClinicalSignals {
  type: ReferralType;
}

export interface PriorityRule {
  id: string;
  band: PriorityBand;
  points: number;
  matches: (context: RuleContext) => boolean;
}

export type FinderKey = 'standard' | 'continuity';

export interface ReferralPolicy {
  basePoints: number;
  finder: FinderKey;
  targetHours: number;
}

export const referralPolicies: Record<ReferralType, ReferralPolicy> = {
  routine: { basePoints: 0, finder: 'standard', targetHours: 336 },
  urgent: { basePoints: 5, finder: 'standard', targetHours: 24 },
  followUp: { basePoints: 1, finder: 'continuity', targetHours: 168 },
  safeguarding: { basePoints: 8, finder: 'standard', targetHours: 4 },
};

export const priorityRules: PriorityRule[] = [
  {
    id: 'safeguarding-signal',
    band: 'red',
    points: 10,
    matches: (context) => context.safeguardingConcern,
  },
  {
    id: 'rapid-deterioration',
    band: 'red',
    points: 7,
    matches: (context) => context.deterioration && context.painScore >= 7,
  },
  {
    id: 'severe-pain',
    band: 'amber',
    points: 4,
    matches: (context) => context.painScore >= 7,
  },
  {
    id: 'post-discharge',
    band: 'amber',
    points: 3,
    matches: (context) => context.recentDischarge,
  },
  {
    id: 'mobility',
    band: 'amber',
    points: 2,
    matches: (context) => context.mobilityRisk,
  },
  {
    id: 'persistent-symptoms',
    band: 'green',
    points: 1,
    matches: (context) => context.symptomDays > 21,
  },
];

export const bandThresholds: Array<{ minimum: number; band: PriorityBand }> = [
  { minimum: 9, band: 'red' },
  { minimum: 4, band: 'amber' },
  { minimum: 0, band: 'green' },
];
