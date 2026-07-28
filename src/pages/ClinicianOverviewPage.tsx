import { useState } from 'react';
import clsx from 'clsx';
import { useClinicStore } from '../store/useClinicStore';
import { formatDateTime, initials } from '../utils/format';
export function ClinicianOverviewPage(){
 const clinicians=useClinicStore((state)=>state.clinicians);const appointments=useClinicStore((state)=>state.appointments);const [service,setService]=useState('all');
 const services=Array.from(new Set(clinicians.flatMap((item)=>item.services))).sort();const visible=service==='all'?clinicians:clinicians.filter((item)=>item.services.includes(service));
 return <div className="page"><header className="page-header"><div><span className="eyebrow">Capacity</span><h1>Clinician overview</h1><p>Check clinical coverage and upcoming appointment capacity across the service.</p></div><select value={service} onChange={(event)=>setService(event.target.value)}><option value="all">All services</option>{services.map((item)=><option key={item}>{item}</option>)}</select></header>
  <section className="metrics"><div className="metric"><span>Active clinicians</span><strong>{clinicians.filter((item)=>item.active).length}</strong><small>Across four locations</small></div><div className="metric"><span>Open slots</span><strong>{clinicians.flatMap((item)=>item.slots).filter((slot)=>!slot.bookedReferralId).length}</strong><small>Next four working days</small></div><div className="metric"><span>Appointments</span><strong>{appointments.length}</strong><small>Booked this session</small></div></section>
  <div className="clinician-grid">{visible.map((clinician)=>{const open=clinician.slots.filter((slot)=>!slot.bookedReferralId);return <article className="card clinician-card" key={clinician.id}>
   <header><div className="clinician-avatar">{initials(clinician.name)}</div><div><h2>{clinician.name}</h2><p>{clinician.role}</p></div><span className={clsx('availability',clinician.active&&'online')}><i/>{clinician.active?'Available':'Away'}</span></header>
   <div className="location-row"><span>⌖</span>{clinician.location}</div><div className="service-tags">{clinician.services.map((item)=><span key={item}>{item}</span>)}</div>
   <div className="capacity-row"><div><strong>{open.length}</strong><span>open slots</span></div><div><strong>{clinician.slots.length-open.length}</strong><span>booked</span></div></div>
   <div className="next-slots"><strong>Next availability</strong>{open.slice(0,3).map((slot)=><div key={slot.id}><span>{formatDateTime(slot.startsAt)}</span><em>{slot.remote?'Remote':'Clinic'}</em></div>)}</div>
  </article>;})}</div>
 </div>;
}
