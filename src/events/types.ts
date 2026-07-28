import type { Appointment, PriorityBand } from "../types/domain";

export interface ClinicEvents {
  "referral:accepted": {
    referralId: string;
    band: PriorityBand;
    actor: string;
  };
  "appointment:booked": { appointment: Appointment; patientName: string };
  "eligibility:failed": {
    referralId: string;
    reasons: string[];
    phase: string;
  };
}

export type EventName = keyof ClinicEvents;
