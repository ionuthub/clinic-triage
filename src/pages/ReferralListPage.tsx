import { useClinicStore } from '../store/useClinicStore';
import { ReferralTable } from '../components/ReferralTable';
import { useReferralFilters } from '../hooks/useReferralFilters';
export function ReferralListPage(){
 const referrals=useClinicStore((state)=>state.referrals);const filters=useReferralFilters(referrals);
 const incoming=referrals.filter((item)=>item.status==='incoming').length;const urgent=referrals.filter((item)=>item.priority==='red'||item.type==='urgent'||item.type==='safeguarding').length;const booked=referrals.filter((item)=>item.status==='booked').length;
 return <div className="page">
  <header className="page-header"><div><span className="eyebrow">Referral workspace</span><h1>Incoming referrals</h1><p>Review clinical information, assign a priority and coordinate the next appointment.</p></div><button className="button secondary">Export list</button></header>
  <section className="metrics" aria-label="Referral summary">
   <div className="metric"><span>Awaiting review</span><strong>{incoming}</strong><small>Requires triage decision</small></div>
   <div className="metric accent"><span>Time sensitive</span><strong>{urgent}</strong><small>Urgent or safeguarded</small></div>
   <div className="metric"><span>Booked today</span><strong>{booked}</strong><small>Appointments confirmed</small></div>
   <div className="metric"><span>Total referrals</span><strong>{referrals.length}</strong><small>Current working list</small></div>
  </section>
  <section className="card list-card">
   <div className="filters"><label className="search-field"><span className="sr-only">Search</span><b>⌕</b><input value={filters.query} onChange={(event)=>filters.setQuery(event.target.value)} placeholder="Search patient, NHS number or service"/></label>
    <select aria-label="Filter status" value={filters.status} onChange={(event)=>filters.setStatus(event.target.value as typeof filters.status)}><option value="all">All statuses</option><option value="incoming">Incoming</option><option value="accepted">Accepted</option><option value="booked">Booked</option><option value="declined">Declined</option></select>
    <select aria-label="Filter referral type" value={filters.type} onChange={(event)=>filters.setType(event.target.value as typeof filters.type)}><option value="all">All pathways</option><option value="routine">Routine</option><option value="urgent">Urgent</option><option value="followUp">Follow-up</option><option value="safeguarding">Safeguarding</option></select>
    <select aria-label="Filter priority" value={filters.band} onChange={(event)=>filters.setBand(event.target.value as typeof filters.band)}><option value="all">All priorities</option><option value="red">Priority 1</option><option value="amber">Priority 2</option><option value="green">Priority 3</option><option value="unbanded">Unbanded</option></select>
    {filters.activeCount>0&&<button className="text-button" onClick={filters.reset}>Clear {filters.activeCount}</button>}
   </div>
   <div className="list-summary"><strong>{filters.filtered.length} referrals</strong><span>Sorted by most recently received</span></div>
   <ReferralTable referrals={filters.filtered}/>
  </section>
 </div>;
}
