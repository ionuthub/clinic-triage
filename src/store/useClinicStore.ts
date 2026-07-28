import { create } from 'zustand';
import { seedAudit, seedClinicians, seedReferrals } from '../data/seed';
import { clinicEvents } from '../events/channel';
import { calculateBand } from '../triage/banding';
import { checkEligibility } from '../triage/eligibility';
import { checkAppointment } from '../triage/validation';
import type { Appointment, AuditEntry, Clinician, PriorityBand, Referral } from '../types/domain';

interface ClinicState {
 referrals: Referral[]; clinicians: Clinician[]; appointments: Appointment[]; audit: AuditEntry[]; actor:string;
 acceptReferral:(id:string,override?:PriorityBand)=>void; declineReferral:(id:string,reason:string)=>void;
 bookAppointment:(referralId:string,clinicianId:string,slotId:string)=>Appointment;
 setPriority:(id:string,band:PriorityBand)=>void; addAudit:(entry:Omit<AuditEntry,'id'|'occurredAt'>)=>void;
}
const clone = <T,>(value:T):T => structuredClone(value);
export const useClinicStore = create<ClinicState>((set,get) => ({
 referrals:clone(seedReferrals),clinicians:clone(seedClinicians),appointments:[],audit:clone(seedAudit),actor:'Alex Morgan',
 addAudit:(entry) => set((state)=>({audit:[{...entry,id:`audit-${Date.now()}`,occurredAt:new Date().toISOString()},...state.audit]})),
 acceptReferral:(id,override) => {
  const referral=get().referrals.find((item)=>item.id===id); if(!referral) throw new Error('Referral not found');
  const eligibility=checkEligibility(referral);
  if(!eligibility.eligible){clinicEvents.emit('eligibility:failed',{referralId:id,reasons:eligibility.reasons,phase:'acceptance'});throw new Error(eligibility.reasons.join('. '));}
  const band=override ?? calculateBand(referral).band;
  set((state)=>({referrals:state.referrals.map((item)=>item.id===id?{...item,status:'accepted',priority:band}:item)}));
  get().addAudit({actor:get().actor,action:'Referral accepted',referralId:id,detail:`Priority assigned: ${band}`,severity:band==='red'?'critical':'info'});
  clinicEvents.emit('referral:accepted',{referralId:id,band,actor:get().actor});
 },
 declineReferral:(id,reason)=>{set((state)=>({referrals:state.referrals.map((item)=>item.id===id?{...item,status:'declined'}:item)}));get().addAudit({actor:get().actor,action:'Referral declined',referralId:id,detail:reason,severity:'warning'});},
 setPriority:(id,band)=>{set((state)=>({referrals:state.referrals.map((item)=>item.id===id?{...item,priority:band}:item)}));get().addAudit({actor:get().actor,action:'Priority changed',referralId:id,detail:`Priority changed to ${band}`,severity:'info'});},
 bookAppointment:(referralId,clinicianId,slotId)=>{
  const state=get();const referral=state.referrals.find((item)=>item.id===referralId);const clinician=state.clinicians.find((item)=>item.id===clinicianId);
  if(!referral||!clinician) throw new Error('Referral or clinician not found');
  const appointment=checkAppointment(referral,clinician,slotId,state.actor);
  set((current)=>({appointments:[...current.appointments,appointment],clinicians:[...current.clinicians],referrals:current.referrals.map((item)=>item.id===referralId?{...item,status:'booked',appointmentId:appointment.id,assignedClinicianId:clinicianId}:item)}));
  get().addAudit({actor:state.actor,action:'Appointment booked',referralId,detail:`${clinician.name} · ${new Date(appointment.startsAt).toLocaleString()}`,severity:'info'});return appointment;
 }
}));
