import { referralPolicies } from '../config/priorityRules';
import type { Clinician, Referral, Slot } from '../types/domain';
import { findContinuitySlots } from './oldSlotFinder';
import { findSlots } from './slotFinder';
import type { SlotFinder } from './types';
const finders: Record<string, SlotFinder> = { standard: findSlots, continuity: findContinuitySlots };
export function availableSlots(referral: Referral, clinicians: Clinician[]): Slot[] {
 const finder = finders[referralPolicies[referral.type].finder];
 return finder({ referral, clinicians, preferredClinicianId: referral.assignedClinicianId });
}
export function reserveSlot(slot: Slot, referralId: string): Slot {
 if (slot.bookedReferralId) throw new Error('This slot has already been booked');
 return { ...slot, bookedReferralId: referralId };
}
