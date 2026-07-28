import { compareAsc, isAfter } from "date-fns";
import type { SlotFinder } from "./types";
export const findSlots: SlotFinder = ({ referral, clinicians }) =>
  clinicians
    .filter(
      (clinician) =>
        clinician.active && clinician.services.includes(referral.service),
    )
    .flatMap((clinician) => clinician.slots)
    .filter((slot) => slot.service === referral.service)
    .filter(
      (slot) =>
        !slot.bookedReferralId && isAfter(new Date(slot.startsAt), new Date()),
    )
    .sort((a, b) => compareAsc(new Date(a.startsAt), new Date(b.startsAt)));
