import { registerRoute } from "./registry";
registerRoute("urgent", (referral) => ({
  summary: `Urgent clinical review: ${referral.reason}`,
  recommendedService: referral.service,
  requiresPhoneCall: true,
  instructions: [
    "Contact patient within two hours",
    "Confirm symptoms have not escalated",
    "Escalate to emergency services if red flags develop",
  ],
}));
