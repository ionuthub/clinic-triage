import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { useClinicStore } from '../store/useClinicStore';
import { initials } from '../utils/format';
const links=[{to:'/',label:'Referrals',icon:'⇄'},{to:'/clinicians',label:'Clinicians',icon:'+'},{to:'/audit',label:'Audit log',icon:'≡'}];
export function Layout(){
 const actor=useClinicStore((state)=>state.actor);
 const incoming=useClinicStore((state)=>state.referrals.filter((referral)=>referral.status==='incoming').length);
 return <div className="app-shell">
  <aside className="sidebar">
   <div className="brand"><div className="brand-mark">CT</div><div><strong>Clinic Triage</strong><span>Care coordination</span></div></div>
   <nav aria-label="Primary navigation">
    {links.map((link)=><NavLink key={link.to} to={link.to} end={link.to==='/'} className={({isActive})=>clsx('nav-item',isActive&&'active')}>
     <span className="nav-icon" aria-hidden>{link.icon}</span><span>{link.label}</span>{link.to==='/'&&incoming>0&&<span className="nav-count">{incoming}</span>}
    </NavLink>)}
   </nav>
   <div className="sidebar-note"><strong>Service status</strong><span><i/> Referral gateway online</span><small>Last sync just now</small></div>
   <div className="user-card"><div className="avatar">{initials(actor)}</div><div><strong>{actor}</strong><span>Senior triage coordinator</span></div></div>
  </aside>
  <main className="main-content"><Outlet/></main>
 </div>;
}
