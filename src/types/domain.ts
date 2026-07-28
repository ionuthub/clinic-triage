export type ReferralType = "routine" | "urgent" | "followUp" | "safeguarding";
export type PriorityBand = "red" | "amber" | "green";
export type ReferralStatus = "incoming" | "accepted" | "booked" | "declined";

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  nhsNumber: string;
  postcode: string;
  phone: string;
  registeredPractice: string;
}

export interface ClinicalSignals {
  symptomDays: number;
  painScore: number;
  deterioration: boolean;
  safeguardingConcern: boolean;
  recentDischarge: boolean;
  mobilityRisk: boolean;
}

export interface Referral {
  id: string;
  receivedAt: string;
  type: ReferralType;
  service: string;
  reason: string;
  notes: string;
  patient: Patient;
  signals: ClinicalSignals;
  status: ReferralStatus;
  priority?: PriorityBand;
  assignedClinicianId?: string;
  appointmentId?: string;
  referrer: string;
}

export interface Slot {
  id: string;
  clinicianId: string;
  startsAt: string;
  durationMinutes: number;
  service: string;
  remote: boolean;
  bookedReferralId?: string;
}

export interface Clinician {
  id: string;
  name: string;
  role: string;
  services: string[];
  location: string;
  active: boolean;
  slots: Slot[];
}

export interface Appointment {
  id: string;
  referralId: string;
  clinicianId: string;
  slotId: string;
  startsAt: string;
  createdAt: string;
  bookedBy: string;
}

export interface AuditEntry {
  id: string;
  occurredAt: string;
  actor: string;
  action: string;
  referralId?: string;
  detail: string;
  severity: "info" | "warning" | "critical";
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  checkedAt: string;
}
