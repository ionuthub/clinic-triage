import type { Referral } from '../types/domain';
import { apiRequest } from './api-client';
export function submitReferral(referral: Referral): Promise<Referral> {
 return apiRequest<Referral>({path:`/referrals/${referral.id}`,method:'PATCH',body:referral}).then(({data}) => data);
}
export function recordBooking(referral: Referral): Promise<void> {
 return apiRequest({path:`/referrals/${referral.id}/booking`,method:'POST',body:referral}).then(() => undefined);
}
