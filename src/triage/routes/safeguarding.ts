import { registerRoute } from './registry';
registerRoute('safeguarding', (referral) => ({ summary:`Restricted safeguarding review for ${referral.patient.name}`, recommendedService:'Community nursing', requiresPhoneCall:true, instructions:['Do not leave a voicemail','Check safe contact method','Notify safeguarding lead'] }));
