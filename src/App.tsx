import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuditLogPage } from './pages/AuditLogPage';
import { ClinicianOverviewPage } from './pages/ClinicianOverviewPage';
import { ReferralDetailPage } from './pages/ReferralDetailPage';
import { ReferralListPage } from './pages/ReferralListPage';
import './scheduling/eventListener';
import './audit/logger';
export default function App(){return <BrowserRouter><Routes><Route element={<Layout/>}><Route index element={<ReferralListPage/>}/><Route path="referrals/:id" element={<ReferralDetailPage/>}/><Route path="clinicians" element={<ClinicianOverviewPage/>}/><Route path="audit" element={<AuditLogPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes></BrowserRouter>;}
