import type { Referral, ReferralType } from "../../types/domain";
export interface RouteOutcome {
  summary: string;
  recommendedService: string;
  requiresPhoneCall: boolean;
  instructions: string[];
}
export type RouteHandler = (referral: Referral) => RouteOutcome;
const handlers = new Map<ReferralType, RouteHandler>();
export function registerRoute(type: ReferralType, handler: RouteHandler): void {
  handlers.set(type, handler);
}
export function routeReferral(referral: Referral): RouteOutcome {
  const handler = handlers.get(referral.type);
  if (!handler)
    throw new Error(`No routing handler registered for ${referral.type}`);
  return handler(referral);
}
export function registeredRouteCount(): number {
  return handlers.size;
}
