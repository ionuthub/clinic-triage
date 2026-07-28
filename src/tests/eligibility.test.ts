import { beforeEach, describe, expect, it } from "vitest";
import { seedReferrals } from "../data/seed";
import { useClinicStore } from "../store/useClinicStore";

describe("acceptance eligibility", () => {
  beforeEach(() => {
    useClinicStore.setState({ referrals: structuredClone(seedReferrals) });
  });

  it("accepts a complete local referral", () => {
    useClinicStore.getState().acceptReferral(seedReferrals[3].id);
    const updated = useClinicStore
      .getState()
      .referrals.find((item) => item.id === seedReferrals[3].id);
    expect(updated?.status).toBe("accepted");
  });

  it("rejects an out-of-area postcode", () => {
    const referrals = structuredClone(seedReferrals);
    referrals[3].patient.postcode = "M1 1AA";
    useClinicStore.setState({ referrals });
    expect(() =>
      useClinicStore.getState().acceptReferral(referrals[3].id),
    ).toThrow("outside the commissioned area");
  });

  it("does not alter an ineligible referral status", () => {
    const referrals = structuredClone(seedReferrals);
    referrals[3].patient.registeredPractice = "";
    useClinicStore.setState({ referrals });
    expect(() =>
      useClinicStore.getState().acceptReferral(referrals[3].id),
    ).toThrow();
    expect(useClinicStore.getState().referrals[3].status).toBe("incoming");
  });
});
