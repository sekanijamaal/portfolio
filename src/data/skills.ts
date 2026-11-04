export interface SkillGroup {
  index: string;
  title: string;
  blurb: string;
  items: string[];
  bookId: number;
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    index: '01',
    title: 'Cloud & Infrastructure',
    blurb:
      'Designing environments that are secure, repeatable, and understandable at 3am.',
    items: [
      'Amazon Web Services (AWS)',
      'AWS Solutions Architecture',
      'Terraform',
      'Infrastructure as Code',
      'Cloud Deployment',
      'Linux',
    ],
    bookId: 0,
  },
  {
    index: '02',
    title: 'Backend Development',
    blurb:
      'Turning domain rules into APIs, schemas, and services that stay honest as they grow.',
    items: [
      'Python',
      'Django',
      'REST APIs',
      'PostgreSQL',
      'Database Design',
    ],
    bookId: 2,
  },
  {
    index: '03',
    title: 'Frontend Development',
    blurb:
      'Building interfaces with clear typography, deliberate motion, and accessible states.',
    items: [
      'JavaScript',
      'TypeScript',
      'React',
      'HTML',
      'CSS',
      'Tailwind CSS',
    ],
    bookId: 7,
  },
  {
    index: '04',
    title: 'Tools & Engineering',
    blurb:
      'The everyday craft around the code: version control, containers, pipelines, and the editor.',
    items: [
      'Git & GitHub',
      'Docker',
      'CI/CD',
      'VS Code',
      'Android Studio',
    ],
    bookId: 13,
  },
];

export const CURRENTLY_EXPLORING = [
  'Serverless architecture',
  'Observability',
  'Platform engineering',
  'Mobile experiences',
  'Cloud security',
];
