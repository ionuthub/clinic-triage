import { describe, expect, it } from 'vitest';
import { seedReferrals } from '../data/seed';
import { calculateBand } from '../triage/banding';
describe('calculateBand',()=>{
 it('gives safeguarding work the highest band',()=>{const referral=seedReferrals.find((item)=>item.type==='safeguarding')!;expect(calculateBand(referral).band).toBe('red');});
 it('returns a target derived from policy',()=>{const referral=seedReferrals.find((item)=>item.type==='routine')!;expect(calculateBand(referral).targetHours).toBe(336);});
 it('records matched rules for explainability',()=>{const referral=seedReferrals.find((item)=>item.signals.deterioration)!;expect(calculateBand(referral).matchedRules.length).toBeGreaterThan(0);});
});
