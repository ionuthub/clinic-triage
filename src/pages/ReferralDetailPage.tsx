import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { PriorityPanel } from '../components/PriorityPanel';
import { SlotPicker } from '../components/SlotPicker';
import { useClinicStore } from '../store/useClinicStore';
import { loadRoutes } from '../triage/routes/loadRoutes';
import { routeReferral, type RouteOutcome } from '../triage/routes/registry';
import type { PriorityBand } from '../types/domain';
import { formatDate, formatDateTime, humaniseStatus, humaniseType } from '../utils/format';
export function ReferralDetailPage(){
 const {id}=useParams();const navigate=useNavigate();const referral=useClinicStore((state)=>state.referrals.find((item)=>item.id===id));const clinicians=useClinicStore((state)=>state.clinicians);const accept=useClinicStore((state)=>state.acceptReferral);const decline=useClinicStore((state)=>state.declineReferral);const book=useClinicStore((state)=>state.bookAppointment);
 const [priority,setPriority]=useState<PriorityBand>(referral?.priority??'green');const [route,setRoute]=useState<RouteOutcome>();const [message,setMessage]=useState('');const [showBooking,setShowBooking]=useState(false);
 useEffect(()=>{if(referral)loadRoutes().then(()=>setRoute(routeReferral(referral)));},[referral]);
 if(!referral)return <div className="page"><div className="empty-state"><h1>Referral not found</h1><p>The referral may have moved out of this worklist.</p><Link className="button primary" to="/">Return to referrals</Link></div></div>;
 const onAccept=()=>{try{accept(referral.id,priority);setMessage('Referral accepted and ready to schedule.');setShowBooking(true);}catch(reason){setMessage(reason instanceof Error?reason.message:'Could not accept referral');}};
 const onDecline=()=>{const reason=window.prompt('Record the reason for declining this referral:');if(reason?.trim()){decline(referral.id,reason);navigate('/');}};
 const onBook=(clinicianId:string,slotId:string)=>{book(referral.id,clinicianId,slotId);setMessage('Appointment confirmed. The referral record has been updated.');setShowBooking(false);};
 return <div className="page detail-page">
  <div className="breadcrumb"><Link to="/">Referrals</Link><span>›</span><span>{referral.id}</span></div>
  <header className="detail-header"><div><div className="title-line"><h1>{referral.patient.name}</h1><span className={clsx('status-pill',`status-${referral.status}`)}>{humaniseStatus(referral.status)}</span></div><p>{referral.id} · Received {formatDateTime(referral.receivedAt)} · {humaniseType(referral.type)}</p></div><div className="header-actions"><button className="button danger-ghost" onClick={onDecline}>Decline</button><button className="button primary" onClick={onAccept} disabled={referral.status==='booked'}>{referral.status==='incoming'?'Accept referral':'Update priority'}</button></div></header>
  {message&&<div className="notice success" role="status">{message}</div>}
  <div className="detail-grid"><div className="detail-main">
   <section className="card"><div className="card-heading"><div><span className="eyebrow">Referral summary</span><h2>{referral.reason}</h2></div><span className={clsx('type-badge',`type-${referral.type}`)}>{humaniseType(referral.type)}</span></div><p className="clinical-note">{referral.notes}</p><dl className="detail-list"><div><dt>Requested service</dt><dd>{referral.service}</dd></div><div><dt>Referrer</dt><dd>{referral.referrer}</dd></div><div><dt>Symptom duration</dt><dd>{referral.signals.symptomDays} days</dd></div><div><dt>Pain score</dt><dd>{referral.signals.painScore} / 10</dd></div></dl>
    <div className="signals"><strong>Clinical signals</strong><div>{referral.signals.deterioration&&<span>Deteriorating</span>}{referral.signals.recentDischarge&&<span>Recent discharge</span>}{referral.signals.mobilityRisk&&<span>Mobility risk</span>}{referral.signals.safeguardingConcern&&<span>Safeguarding</span>}{!Object.values(referral.signals).some((value)=>value===true)&&<small>No additional risk flags</small>}</div></div>
   </section>
   <section className="card"><div className="card-heading"><div><span className="eyebrow">Routing guidance</span><h2>Recommended pathway</h2></div></div>{route?<><p>{route.summary}</p><ul className="check-list">{route.instructions.map((instruction)=><li key={instruction}><span>✓</span>{instruction}</li>)}</ul>{route.requiresPhoneCall&&<div className="notice warning">Telephone contact is required before booking.</div>}</>:<p className="muted">Loading pathway guidance…</p>}</section>
   <PriorityPanel referral={referral} selected={priority} onSelect={setPriority}/>
   {(showBooking||referral.status==='accepted')&&<SlotPicker referral={referral} clinicians={clinicians} onBook={onBook}/>} 
  </div><aside className="detail-aside"><section className="card sticky-card"><div className="card-heading"><h2>Patient details</h2></div><div className="patient-summary"><div className="large-avatar">{referral.patient.name.split(' ').map((part)=>part[0]).join('')}</div><div><strong>{referral.patient.name}</strong><span>{formatDate(referral.patient.dateOfBirth)}</span></div></div><dl className="stacked-details"><div><dt>NHS number</dt><dd>{referral.patient.nhsNumber}</dd></div><div><dt>Telephone</dt><dd>{referral.patient.phone}</dd></div><div><dt>Postcode</dt><dd>{referral.patient.postcode}</dd></div><div><dt>Registered practice</dt><dd>{referral.patient.registeredPractice}</dd></div></dl><button className="button secondary full">Verify demographics</button></section></aside></div>
 </div>;
}
