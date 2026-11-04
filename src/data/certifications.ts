export interface Certification {
  id: string;
  name: string;
  shortName: string;
  level: string;
  issuer: string;
  emphasis: 'primary' | 'secondary';
  description: string;
  focus: string[];
  verificationUrl: string;
  note: string;
}

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'saa',
    name: 'AWS Certified Solutions Architect – Associate',
    shortName: 'Solutions Architect',
    level: 'Associate',
    issuer: 'Amazon Web Services',
    emphasis: 'primary',
    description:
      'A validation of the ability to design resilient, secure, and cost-aware architectures on AWS — from networking and identity to storage, compute, and database decisions.',
    focus: [
      'Resilient architecture',
      'Security & identity',
      'Cost optimisation',
      'Operational excellence',
    ],
    verificationUrl: 'https://aws.amazon.com/verification/',
    note: 'Credential verification available on request.',
  },
  {
    id: 'ccp',
    name: 'AWS Certified Cloud Practitioner',
    shortName: 'Cloud Practitioner',
    level: 'Foundational',
    issuer: 'Amazon Web Services',
    emphasis: 'secondary',
    description:
      'A foundational understanding of AWS cloud concepts, services, security, architecture, pricing, and support — the shared vocabulary underneath the deeper architecture work.',
    focus: ['Cloud concepts', 'Core services', 'Security', 'Billing & support'],
    verificationUrl: 'https://aws.amazon.com/verification/',
    note: 'Credential verification available on request.',
  },
];

export const EXPERIENCE_CHAPTERS = [
  {
    index: '01',
    label: 'The sciences',
    title: 'A foundation in observation',
    body: 'A background in Animal Biology and Conservation Sciences taught me to observe systems, ask precise questions, and work with complexity that does not fit neatly into a spreadsheet.',
  },
  {
    index: '02',
    label: 'The pivot',
    title: 'Curiosity becomes software',
    body: 'Self-directed learning across Python, the web, and databases turned an interest in technology into working software. The learning has been deliberate, practical, and continuous.',
  },
  {
    index: '03',
    label: 'The craft',
    title: 'Building for real people',
    body: 'Real projects — AHOME, AGLF, and NAAB — became the classroom: Django applications, product thinking, frontend work, and the deployment details that only appear in production.',
  },
  {
    index: '04',
    label: 'The cloud',
    title: 'From applications to systems',
    body: 'AWS certifications and hands-on infrastructure work widened the focus from the application to the environment it runs in: architecture, automation, security, and the operational life of software.',
  },
] as const;

export const INTERESTS = [
  'Scalable systems',
  'Infrastructure automation',
  'SaaS products',
  'Cloud-native technology',
  'Developer experience',
  'Accessible interfaces',
] as const;
