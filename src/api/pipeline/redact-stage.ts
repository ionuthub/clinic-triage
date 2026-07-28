import type { Referral } from "../../types/domain";
import type { ApiStage } from "./types";
function redactBody(body: unknown): unknown {
  const referral = body as Partial<Referral> | undefined;
  if (!referral || referral.type !== "safeguarding" || !referral.patient)
    return body;
  return {
    ...referral,
    notes: "[restricted clinical note]",
    patient: {
      ...referral.patient,
      phone: "[safe contact required]",
      postcode: "[restricted]",
    },
  };
}
export const redactStage: ApiStage = async (request, next) =>
  await next({ ...request, body: redactBody(request.body) });
