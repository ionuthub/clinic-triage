import { format, formatDistanceToNow, parseISO } from 'date-fns';
import type { PriorityBand, ReferralStatus, ReferralType } from '../types/domain';

export function formatDateTime(value: string): string {
 return format(parseISO(value), 'EEE d MMM, HH:mm');
}
export function formatDate(value: string): string {
 return format(parseISO(value), 'd MMM yyyy');
}
export function relativeTime(value: string): string {
 return formatDistanceToNow(parseISO(value), {addSuffix:true});
}
export function humaniseType(type: ReferralType): string {
 return ({routine:'Routine',urgent:'Urgent',followUp:'Follow-up',safeguarding:'Safeguarding'})[type];
}
export function humaniseStatus(status: ReferralStatus): string {
 return status.charAt(0).toUpperCase()+status.slice(1);
}
export function bandLabel(band?: PriorityBand): string {
 return band ? ({red:'Priority 1',amber:'Priority 2',green:'Priority 3'})[band] : 'Unbanded';
}
export function initials(name:string):string {
 return name.split(/\s+/).map((part)=>part[0]).slice(0,2).join('').toUpperCase();
}
