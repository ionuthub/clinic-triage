import clsx from 'clsx';
import { calculateBand } from '../triage/banding';
import type { PriorityBand, Referral } from '../types/domain';
import { bandLabel } from '../utils/format';
interface Props { referral:Referral; selected:PriorityBand; onSelect:(band:PriorityBand)=>void }
const options:[PriorityBand,string,string][]=[['red','Priority 1','Review within hours'],['amber','Priority 2','Review within days'],['green','Priority 3','Routine scheduling']];
export function PriorityPanel({referral,selected,onSelect}:Props){
 const decision=calculateBand(referral);
 return <section className="card priority-panel">
  <div className="card-heading"><div><span className="eyebrow">Clinical banding</span><h2>Assign priority</h2></div><span className="score">Score {decision.score}</span></div>
  <p className="muted">Suggested band: <strong>{bandLabel(decision.band)}</strong>. Target response within {decision.targetHours} hours.</p>
  <div className="priority-options">{options.map(([band,label,description])=><button key={band} type="button" onClick={()=>onSelect(band)} className={clsx('priority-option',`option-${band}`,selected===band&&'selected')}>
   <span className="radio-dot"/><span><strong>{label}</strong><small>{description}</small></span>{decision.band===band&&<em>Suggested</em>}
  </button>)}</div>
  <div className="rule-list"><strong>Signals considered</strong>{decision.matchedRules.length?<ul>{decision.matchedRules.map((rule)=><li key={rule}>{rule.replaceAll('-',' ')}</li>)}</ul>:<p>No escalation signals matched.</p>}</div>
 </section>;
}
