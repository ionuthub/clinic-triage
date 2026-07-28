import { clinicEvents } from "../events/channel";
import { checkEligibility } from "../triage/eligibility";
import type { Referral } from "../types/domain";
export interface VerificationReport {
  checked: number;
  failures: Array<{ referralId: string; reasons: string[] }>;
  completedAt: string;
}
export async function runNightlyReverification(
  referrals: Referral[],
): Promise<VerificationReport> {
  const candidates = referrals.filter(
    (referral) =>
      referral.status === "accepted" || referral.status === "booked",
  );
  const failures: VerificationReport["failures"] = [];
  for (const referral of candidates) {
    await Promise.resolve();
    const result = checkEligibility(referral);
    if (!result.eligible) {
      failures.push({ referralId: referral.id, reasons: result.reasons });
      clinicEvents.emit("eligibility:failed", {
        referralId: referral.id,
        reasons: result.reasons,
        phase: "nightly",
      });
    }
  }
  return {
    checked: candidates.length,
    failures,
    completedAt: new Date().toISOString(),
  };
}
