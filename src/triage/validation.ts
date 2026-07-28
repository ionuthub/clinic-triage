import { clinicEvents } from "../events/channel";
import { checkEligibility } from "./eligibility";
import type { Appointment, Clinician, Referral } from "../types/domain";

/** Checks whether a requested appointment slot is available for the referral. */
export function checkAppointment(
  referral: Referral,
  clinician: Clinician,
  slotId: string,
  actor: string,
): Appointment {
  const eligibility = checkEligibility(referral);
  if (!eligibility.eligible) {
    clinicEvents.emit("eligibility:failed", {
      referralId: referral.id,
      reasons: eligibility.reasons,
      phase: "booking",
    });
    throw new Error(eligibility.reasons.join(". "));
  }
  const slot = clinician.slots.find((candidate) => candidate.id === slotId);
  if (!slot) throw new Error("The selected slot does not exist");
  if (slot.bookedReferralId)
    throw new Error("The selected slot is no longer available");
  if (!clinician.services.includes(referral.service))
    throw new Error("Clinician does not cover this service");
  const appointment: Appointment = {
    id: `APT-${Date.now()}`,
    referralId: referral.id,
    clinicianId: clinician.id,
    slotId: slot.id,
    startsAt: slot.startsAt,
    createdAt: new Date().toISOString(),
    bookedBy: actor,
  };
  slot.bookedReferralId = referral.id;
  clinicEvents.emit("appointment:booked", {
    appointment,
    patientName: referral.patient.name,
  });
  return appointment;
}
