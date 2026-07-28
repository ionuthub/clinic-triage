import { clinicEvents } from '../events/channel';
import type { AuditEntry } from '../types/domain';
const eventEntries: AuditEntry[] = [];
clinicEvents.on('appointment:booked', ({appointment,patientName}) => {
 eventEntries.unshift({id:`event-${appointment.id}`,occurredAt:new Date().toISOString(),actor:appointment.bookedBy,action:'Appointment booked',referralId:appointment.referralId,detail:`Booked ${patientName} with clinician ${appointment.clinicianId}`,severity:'info'});
});
export function getEventAudit(): AuditEntry[] { return [...eventEntries]; }
