import type { Clinician, Referral, Slot } from '../types/domain';
export interface SlotSearch { referral: Referral; clinicians: Clinician[]; preferredClinicianId?: string }
export type SlotFinder = (search: SlotSearch) => Slot[];
