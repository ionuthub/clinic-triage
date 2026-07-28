import { describe, expect, it } from "vitest";
import { seedClinicians, seedReferrals } from "../data/seed";
import { availableSlots } from "../scheduling/service";
import { checkAppointment } from "../triage/validation";
describe("scheduling", () => {
  it("finds service-compatible slots", () => {
    const referral = seedReferrals[0];
    expect(
      availableSlots(referral, structuredClone(seedClinicians)).every(
        (slot) => slot.service === referral.service,
      ),
    ).toBe(true);
  });
  it("books an available slot while checking it", () => {
    const referral = structuredClone(seedReferrals[0]);
    const clinicians = structuredClone(seedClinicians);
    const slot = availableSlots(referral, clinicians)[0];
    const clinician = clinicians.find((item) => item.id === slot.clinicianId)!;
    const appointment = checkAppointment(
      referral,
      clinician,
      slot.id,
      "Tester",
    );
    expect(appointment.slotId).toBe(slot.id);
    expect(slot.bookedReferralId).toBe(referral.id);
  });
  it("prevents a second booking", () => {
    const referral = structuredClone(seedReferrals[0]);
    const clinicians = structuredClone(seedClinicians);
    const slot = availableSlots(referral, clinicians)[0];
    const clinician = clinicians.find((item) => item.id === slot.clinicianId)!;
    checkAppointment(referral, clinician, slot.id, "Tester");
    expect(() =>
      checkAppointment(referral, clinician, slot.id, "Tester"),
    ).toThrow("no longer available");
  });
});
