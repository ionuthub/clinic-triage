import { beforeAll, describe, expect, it } from "vitest";
import { seedReferrals } from "../data/seed";
import { loadRoutes } from "../triage/routes/loadRoutes";
import { registeredRouteCount, routeReferral } from "../triage/routes/registry";
describe("routing registry", () => {
  beforeAll(async () => loadRoutes());
  it("loads four handlers dynamically", () =>
    expect(registeredRouteCount()).toBe(4));
  it("routes urgent referrals to phone contact", () => {
    const referral = seedReferrals.find((item) => item.type === "urgent")!;
    expect(routeReferral(referral).requiresPhoneCall).toBe(true);
  });
  it("preserves requested service for routine work", () => {
    const referral = seedReferrals[0];
    expect(routeReferral(referral).recommendedService).toBe(referral.service);
  });
});
