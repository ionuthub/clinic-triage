import { bandThresholds, priorityRules, referralPolicies } from '../config/priorityRules';
import type { PriorityBand, Referral } from '../types/domain';

export interface BandingDecision { band: PriorityBand; score: number; matchedRules: string[]; targetHours: number }

export function calculateBand(referral: Referral): BandingDecision {
 const context = { ...referral.signals, type: referral.type };
 const matched = priorityRules.filter((rule) => rule.matches(context));
 const score = referralPolicies[referral.type].basePoints + matched.reduce((total, rule) => total + rule.points, 0);
 const band = bandThresholds.find((threshold) => score >= threshold.minimum)?.band ?? 'green';
 return { band, score, matchedRules: matched.map((rule) => rule.id), targetHours: referralPolicies[referral.type].targetHours };
}
