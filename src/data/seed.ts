import { addDays, addHours, setHours, startOfDay } from 'date-fns';
import type { AuditEntry, Clinician, Referral } from '../types/domain';

const patients = [
  ['p01','Amira Shah','1988-04-12','943 476 5910','LS7 2AB','07700 900101','Northgate Medical'],
  ['p02','George Wilkes','1943-11-02','612 905 4438','LS2 8RA','07700 900102','City View Surgery'],
  ['p03','Elena Costa','1975-07-19','485 316 2097','LS11 5DN','07700 900103','Holbeck Health'],
  ['p04','Peter Doyle','1961-02-28','771 628 4053','LS8 4HS','07700 900104','Roundhay Practice'],
  ['p05','Yasmin Ali','2002-09-09','536 294 1876','LS6 1BZ','07700 900105','Woodhouse Clinic'],
  ['p06','Martha Bell','1937-05-14','205 917 6384','LS14 3PP','07700 900106','Seacroft Medical'],
  ['p07','Daniel Price','1982-12-30','896 124 3075','LS10 2HT','07700 900107','Airebank Surgery'],
  ['p08','Grace Okoro','1995-06-21','319 682 7541','LS9 7QJ','07700 900108','East Park Health'],
  ['p09','Noah Bennett','2010-01-15','457 190 8263','LS12 4RW','07700 900109','Westfield Practice'],
  ['p10','Sylvia Grant','1955-08-26','728 451 0936','LS16 6LP','07700 900110','Headingley Medical'],
  ['p11','Imran Khan','1970-03-07','164 839 5027','LS4 2UX','07700 900111','Kirkstall Lane'],
  ['p12','Rose Turner','1948-10-18','903 276 4158','LS17 8NF','07700 900112','Moortown Group'],
  ['p13','Leo Martin','1991-05-04','641 708 3295','LS1 3AD','07700 900113','City View Surgery'],
  ['p14','Jade Thompson','1986-09-23','283 569 7140','LS13 1JT','07700 900114','Bramley Health'],
  ['p15','Frank Hughes','1959-01-31','570 342 9861','LS15 7PA','07700 900115','Crossgates Practice'],
  ['p16','Priya Nair','1978-11-11','814 635 2709','LS18 5WA','07700 900116','Horsforth Medical'],
  ['p17','Owen Roberts','1966-04-08','392 817 5460','LS19 6EE','07700 900117','Yeadon Health'],
  ['p18','Aisha Mensah','1999-12-02','725 094 3816','LS8 5QL','07700 900118','Roundhay Practice'],
  ['p19','Colin Ward','1941-07-16','148 753 6209','LS20 9BD','07700 900119','Guiseley Surgery'],
  ['p20','Mei Chen','1984-02-20','609 421 8753','LS3 1AA','07700 900120','Northgate Medical'],
] as const;

const scenarios = [
 ['routine','Physiotherapy','Persistent shoulder stiffness','Reduced range of movement after gardening',30,4,false,false,false,false],
 ['urgent','Respiratory','Increasing breathlessness','Breathless walking between rooms',5,8,true,false,false,false],
 ['followUp','Cardiology','Post-discharge review','Medication review following inpatient stay',8,3,false,false,true,false],
 ['safeguarding','Community nursing','Unsafe home situation','Referrer requests discreet contact',14,2,false,true,false,false],
 ['routine','Dermatology','Recurring eczema','Topical treatment no longer controlling flare',45,5,false,false,false,false],
 ['urgent','Falls clinic','Three falls this week','New unsteadiness and bruising',4,6,true,false,false,true],
 ['followUp','Diabetes','Glucose review','Readings remain high after medication change',12,3,false,false,false,false],
 ['routine','Podiatry','Painful heel','Morning pain affecting work',25,5,false,false,false,true],
 ['urgent','Neurology','New weakness','Progressive left-sided weakness since Friday',3,7,true,false,false,true],
 ['routine','MSK','Lower back pain','Pain persists despite self-management',36,6,false,false,false,false],
 ['followUp','Respiratory','Inhaler follow-up','Technique and symptom review requested',16,2,false,false,true,false],
 ['urgent','Wound care','Deteriorating leg ulcer','Increased exudate and surrounding redness',9,8,true,false,false,true],
 ['routine','Audiology','Gradual hearing loss','Difficulty following conversations',120,1,false,false,false,false],
 ['safeguarding','Mental health','Welfare concern','Possible coercion reported by neighbour',7,5,false,true,false,false],
 ['followUp','Physiotherapy','Knee rehabilitation','Six-week progress assessment',42,4,false,false,false,true],
 ['routine','Dietitian','Unplanned weight change','Lost weight over two months',60,3,false,false,false,false],
 ['urgent','Cardiology','Palpitations','Episodes increasing in frequency',6,7,true,false,false,false],
 ['routine','Occupational therapy','Home equipment review','Difficulty transferring safely',20,4,false,false,false,true],
 ['followUp','Dermatology','Treatment monitoring','Blood test review before next prescription',28,2,false,false,false,false],
 ['safeguarding','Community nursing','Missed essential care','Repeated carer access concerns',3,6,true,true,false,true],
] as const;

export const seedReferrals: Referral[] = scenarios.map((scenario, index) => {
 const patient = patients[index];
 return {
  id: `REF-${String(index + 101).padStart(4,'0')}`,
  receivedAt: addHours(new Date(), -(index * 3 + 1)).toISOString(),
  type: scenario[0], service: scenario[1], reason: scenario[2], notes: scenario[3],
  patient: { id: patient[0], name: patient[1], dateOfBirth: patient[2], nhsNumber: patient[3], postcode: patient[4], phone: patient[5], registeredPractice: patient[6] },
  signals: { symptomDays: scenario[4], painScore: scenario[5], deterioration: scenario[6], safeguardingConcern: scenario[7], recentDischarge: scenario[8], mobilityRisk: scenario[9] },
  status: index === 15 ? 'declined' : index < 3 ? 'accepted' : 'incoming',
  referrer: `${patient[6]} · Dr ${['Patel','Green','Evans','Hussain'][index % 4]}`,
 };
});

const people = [
 ['c1','Dr Hannah Reed','GP with extended role',['Cardiology','Respiratory'],'Central Clinic'],
 ['c2','Tom Alvarez','Advanced physiotherapist',['Physiotherapy','MSK','Falls clinic'],'North Hub'],
 ['c3','Nina Foster','Community nurse',['Community nursing','Wound care'],'Community Team'],
 ['c4','Dr Samira Iqbal','Consultant physician',['Diabetes','Neurology','Cardiology'],'Central Clinic'],
 ['c5','Lucy Morgan','Allied health practitioner',['Podiatry','Dietitian','Occupational therapy'],'West Hub'],
 ['c6','Dr Eliot Park','Specialty doctor',['Dermatology','Audiology','Mental health'],'East Hub'],
] as const;

export const seedClinicians: Clinician[] = people.map((person, clinicianIndex) => ({
 id: person[0], name: person[1], role: person[2], services: [...person[3]], location: person[4], active: true,
 slots: Array.from({length: 8}, (_, slotIndex) => {
  const day = addDays(startOfDay(new Date()), Math.floor(slotIndex / 2) + 1);
  const startsAt = setHours(day, slotIndex % 2 ? 14 : 9);
  return { id: `${person[0]}-s${slotIndex + 1}`, clinicianId: person[0], startsAt: startsAt.toISOString(), durationMinutes: clinicianIndex === 2 ? 45 : 30, service: person[3][slotIndex % person[3].length], remote: slotIndex % 3 === 0 };
 })
}));

export const seedAudit: AuditEntry[] = [
 { id:'audit-1', occurredAt:addHours(new Date(),-8).toISOString(), actor:'System', action:'Import completed', detail:'20 referrals reconciled from referral gateway', severity:'info' },
 { id:'audit-2', occurredAt:addHours(new Date(),-5).toISOString(), actor:'Alex Morgan', action:'Referral accepted', referralId:'REF-0101', detail:'Priority set to green', severity:'info' },
 { id:'audit-3', occurredAt:addHours(new Date(),-2).toISOString(), actor:'System', action:'Eligibility warning', referralId:'REF-0114', detail:'Contact restrictions require review', severity:'warning' },
];
