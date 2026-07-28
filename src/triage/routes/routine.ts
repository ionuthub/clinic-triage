import { registerRoute } from "./registry";
registerRoute("routine", (referral) => ({
  summary: `Standard pathway for ${referral.reason.toLowerCase()}`,
  recommendedService: referral.service,
  requiresPhoneCall: false,
  instructions: [
    "Confirm demographic details",
    "Offer first suitable appointment",
    "Send preparation guidance",
  ],
}));
