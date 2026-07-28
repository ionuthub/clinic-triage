import { differenceInYears, isFuture, parseISO } from "date-fns";
import type { EligibilityResult, Referral } from "../types/domain";

export function checkEligibility(referral: Referral): EligibilityResult {
  const reasons: string[] = [];
  const age = differenceInYears(
    new Date(),
    parseISO(referral.patient.dateOfBirth),
  );
  if (age < 0 || isFuture(parseISO(referral.patient.dateOfBirth)))
    reasons.push("Date of birth is invalid");
  if (!/^LS\d{1,2}/.test(referral.patient.postcode))
    reasons.push("Patient is outside the commissioned area");
  if (!referral.patient.registeredPractice.trim())
    reasons.push("No registered practice is recorded");
  if (referral.status === "declined")
    reasons.push("Referral has already been declined");
  if (referral.type === "safeguarding" && age < 16)
    reasons.push("Child safeguarding team must coordinate this referral");
  return {
    eligible: reasons.length === 0,
    reasons,
    checkedAt: new Date().toISOString(),
  };
}
