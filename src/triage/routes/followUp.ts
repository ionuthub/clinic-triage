import { registerRoute } from "./registry";
registerRoute("followUp", (referral) => ({
  summary: `Continue existing ${referral.service} pathway`,
  recommendedService: referral.service,
  requiresPhoneCall: false,
  instructions: [
    "Review previous clinical letter",
    "Prefer the previous care team",
    "Check outstanding investigations",
  ],
}));
