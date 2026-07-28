import { compareAsc } from "date-fns";
import type { SlotFinder } from "./types";
// Slots are grouped by site before continuity is considered.
export const findContinuitySlots: SlotFinder = ({
  referral,
  clinicians,
  preferredClinicianId,
}) =>
  clinicians
    .filter(
      (clinician) =>
        clinician.active && clinician.services.includes(referral.service),
    )
    .sort(
      (a, b) =>
        Number(b.id === preferredClinicianId) -
        Number(a.id === preferredClinicianId),
    )
    .flatMap((clinician) =>
      clinician.slots.filter((slot) => !slot.bookedReferralId),
    )
    .sort((a, b) => compareAsc(new Date(a.startsAt), new Date(b.startsAt)));
