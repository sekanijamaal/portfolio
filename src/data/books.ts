export type BookKind = 'Expertise' | 'Project' | 'Credential' | 'Experiment' | 'Future';

export type CoverMotif =
  | 'horizon'
  | 'arch'
  | 'grid'
  | 'contour'
  | 'blocks'
  | 'waves'
  | 'arcs'
  | 'nodes'
  | 'bars'
  | 'stairs'
  | 'product'
  | 'terminal'
  | 'rings'
  | 'stripes'
  | 'pulse'
  | 'shield'
  | 'speed'
  | 'moon'
  | 'none';

export type CoverLayout = 'editorial' | 'split' | 'full' | 'type' | 'band' | 'frame';

export interface BookPalette {
  /** Cover board colour. */
  bg: string;
  /** Primary typographic colour. */
  ink: string;
  /** Main graphic colour. */
  accent: string;
  /** Secondary graphic colour. */
  soft: string;
  /** Deep shadow / secondary background. */
  deep: string;
}

export interface Book {
  id: number;
  title: string;
  /** Optional all-caps lockup for the cover only. */
  displayTitle?: string;
  eyebrow: string;
  subtitle: string;
  author: string;
  kind: BookKind;
  spine: string;
  palette: BookPalette;
  motif: CoverMotif;
  layout: CoverLayout;
  description: string;
  stack: string[];
  link?: { label: string; href: string };
}

export const BOOKS: Book[] = [
  {
    id: 0,
    title: 'Cloud Architecture',
    eyebrow: 'Cloud & Infrastructure',
    subtitle: 'Designing systems that scale',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#25414c',
    palette: {
      bg: '#0c1a20',
      ink: '#f2ede3',
      accent: '#b8a58a',
      soft: '#587681',
      deep: '#061014',
    },
    motif: 'horizon',
    layout: 'split',
    description:
      'My approach to cloud starts with the workload, not the service menu. Define clear boundaries, design for failure, and make the operational cost visible: VPCs, private subnets, least-privilege IAM, observability, and infrastructure that can be rebuilt from code are part of the architecture, not an afterthought.',
    stack: ['AWS', 'VPC', 'IAM', 'CloudFront', 'RDS', 'CloudWatch'],
    link: { label: 'Explore the architecture lab', href: '#lab' },
  },
  {
    id: 1,
    title: 'AHome',
    displayTitle: 'AHOME',
    eyebrow: 'Selected work — 01',
    subtitle: 'Real estate & construction, Togo',
    author: 'A project by Sidney Odum',
    kind: 'Project',
    spine: '#7a5a3d',
    palette: {
      bg: '#e9e0d1',
      ink: '#181410',
      accent: '#8b6244',
      soft: '#c7b6a1',
      deep: '#2a2119',
    },
    motif: 'arch',
    layout: 'editorial',
    description:
      'A real estate and construction platform built with Django. AHome brings property listings, rental management, turnkey construction, civil engineering, and diaspora support into one considered digital experience for clients in Togo.',
    stack: ['Django', 'Python', 'Real Estate', 'Web Platform'],
    link: { label: 'Visit ahomemagic.com', href: 'https://www.ahomemagic.com/' },
  },
  {
    id: 2,
    title: 'Django Engineering',
    eyebrow: 'Backend',
    subtitle: 'Models, views, and good decisions',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#1e4a34',
    palette: {
      bg: '#102019',
      ink: '#efe9dc',
      accent: '#7e9c83',
      soft: '#3d5c4a',
      deep: '#07100c',
    },
    motif: 'grid',
    layout: 'editorial',
    description:
      'Django is where I turn data models into working products. I care about clean app boundaries, explicit migrations, considered ORM queries, and the unglamorous work that keeps a codebase readable a year later.',
    stack: ['Python', 'Django', 'ORM', 'REST APIs', 'PostgreSQL'],
    link: { label: 'See it in the work', href: '#projects' },
  },
  {
    id: 3,
    title: 'Terraform',
    eyebrow: 'Infrastructure',
    subtitle: 'Infrastructure as a typed conversation',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#4a3c2a',
    palette: {
      bg: '#15120e',
      ink: '#efe5d4',
      accent: '#b8a58a',
      soft: '#6d5c45',
      deep: '#080604',
    },
    motif: 'contour',
    layout: 'full',
    description:
      'I use Terraform to make infrastructure reviewable. Modules, variables, and remote state turn a cloud account into something that can be described, versioned, and rebuilt rather than clicked together.',
    stack: ['Terraform', 'HCL', 'AWS', 'Remote State', 'Modules'],
    link: { label: 'Open the lab notes', href: '#lab' },
  },
  {
    id: 4,
    title: 'SaaS Development',
    eyebrow: 'Product',
    subtitle: 'Software with a business model',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#552f2a',
    palette: {
      bg: '#241619',
      ink: '#f2e9de',
      accent: '#c98d70',
      soft: '#7c4c43',
      deep: '#100809',
    },
    motif: 'blocks',
    layout: 'split',
    description:
      'Building a SaaS product means thinking past the feature list: tenancy, onboarding, permissions, billing concepts, and the feedback loops that make a product worth returning to. I enjoy that whole-system view.',
    stack: ['Product Thinking', 'Django', 'React', 'PostgreSQL', 'Auth'],
    link: { label: 'How I work', href: '#about' },
  },
  {
    id: 5,
    title: 'Serverless Patterns',
    eyebrow: 'Cloud & Infrastructure',
    subtitle: 'Small functions, clear contracts',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#23505a',
    palette: {
      bg: '#0a181b',
      ink: '#e8f0ed',
      accent: '#7fb0aa',
      soft: '#3d6b6a',
      deep: '#041012',
    },
    motif: 'waves',
    layout: 'editorial',
    description:
      'Lambda and API Gateway are at their best when the boundaries are honest: one job per function, idempotent handlers, structured logs, and infrastructure defined alongside the code.',
    stack: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'EventBridge', 'CloudWatch'],
    link: { label: 'Serverless lab note', href: '#lab' },
  },
  {
    id: 6,
    title: 'Python Engineering',
    eyebrow: 'Backend',
    subtitle: 'Clarity as a feature',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#2b3d55',
    palette: {
      bg: '#101b29',
      ink: '#eef0ec',
      accent: '#d1b98e',
      soft: '#5c7391',
      deep: '#060c12',
    },
    motif: 'arcs',
    layout: 'editorial',
    description:
      'Python is my default language for solving problems: scripts that remove repetitive work, APIs that stay small, and data models that are easy to reason about. Readability is part of the design, not a style preference.',
    stack: ['Python', 'Django', 'Scripting', 'Testing', 'Automation'],
    link: { label: 'Technical toolkit', href: '#expertise' },
  },
  {
    id: 7,
    title: 'React Development',
    eyebrow: 'Frontend',
    subtitle: 'Interfaces with a point of view',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#a45c40',
    palette: {
      bg: '#efe9df',
      ink: '#191511',
      accent: '#b55f3f',
      soft: '#c9a98f',
      deep: '#2c2019',
    },
    motif: 'blocks',
    layout: 'editorial',
    description:
      'I build interfaces that feel considered: strong typography, quiet motion, clear states, and components that are easy to extend. React and TypeScript are my tools for keeping that complexity in check.',
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    link: { label: 'See the frontend work', href: '#projects' },
  },
  {
    id: 8,
    title: 'Data Foundations',
    eyebrow: 'Data',
    subtitle: 'PostgreSQL, modelling, and trust',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#294a44',
    palette: {
      bg: '#0c1715',
      ink: '#e9e4d7',
      accent: '#b3a887',
      soft: '#4b6b62',
      deep: '#050c0b',
    },
    motif: 'bars',
    layout: 'editorial',
    description:
      'Good applications start with honest data. I design schemas around the questions the product needs to answer, use constraints to protect integrity, and treat migrations as part of the product’s history.',
    stack: ['PostgreSQL', 'SQL', 'Schema Design', 'Indexes', 'Migrations'],
    link: { label: 'Backend expertise', href: '#expertise' },
  },
  {
    id: 9,
    title: 'CI/CD Pipelines',
    eyebrow: 'Delivery',
    subtitle: 'Ship small, ship often',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#3d3a35',
    palette: {
      bg: '#141311',
      ink: '#f0ebe2',
      accent: '#c2a982',
      soft: '#6d6558',
      deep: '#080706',
    },
    motif: 'bars',
    layout: 'band',
    description:
      'A pipeline is a team agreement made executable. I like builds that are fast, tests that are meaningful, environments that are reproducible, and deployments that can be reversed without drama.',
    stack: ['GitHub Actions', 'Docker', 'Amazon ECR', 'ECS', 'Testing'],
    link: { label: 'Delivery lab note', href: '#lab' },
  },
  {
    id: 10,
    title: 'AGLF',
    displayTitle: 'AGLF',
    eyebrow: 'Selected work — 02',
    subtitle: 'Africa Geospatial Leadership Forum',
    author: 'A project by Sidney Odum',
    kind: 'Project',
    spine: '#9a5a38',
    palette: {
      bg: '#dfe2d6',
      ink: '#182019',
      accent: '#9b5b3b',
      soft: '#b7bfae',
      deep: '#263029',
    },
    motif: 'contour',
    layout: 'editorial',
    description:
      'A conference platform for the Africa Geospatial Leadership Forum, built to support participation, speaker information, programme details, and the run-up to an invitation-only forum on spatial intelligence for development, investment, and decision-making.',
    stack: ['Django', 'Event Platform', 'Content', 'Deployment'],
    link: {
      label: 'Visit aglf.bigdataghana.com',
      href: 'https://aglf.bigdataghana.com/',
    },
  },
  {
    id: 11,
    title: 'System Design',
    eyebrow: 'Architecture',
    subtitle: 'Choosing the right boundaries',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#4b443a',
    palette: {
      bg: '#10100f',
      ink: '#f1ece2',
      accent: '#b8a58a',
      soft: '#6a6255',
      deep: '#070706',
    },
    motif: 'nodes',
    layout: 'editorial',
    description:
      'System design is the work of choosing boundaries: what is one service, what is one table, what can fail independently. I’m interested in designs that are simple enough to operate and explicit enough to change.',
    stack: ['Architecture', 'Trade-offs', 'APIs', 'Queues', 'Observability'],
    link: { label: 'Read the lab notes', href: '#lab' },
  },
  {
    id: 12,
    title: 'API Engineering',
    eyebrow: 'Backend',
    subtitle: 'Contracts that age well',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#2c4a5c',
    palette: {
      bg: '#0e1a21',
      ink: '#e9eef0',
      accent: '#8fb3c2',
      soft: '#4d6f7e',
      deep: '#060e12',
    },
    motif: 'grid',
    layout: 'split',
    description:
      'An API is a contract. I aim for predictable resources, useful errors, consistent naming, and documentation that lets another developer succeed without reading the implementation.',
    stack: ['REST', 'JSON', 'Auth', 'Versioning', 'OpenAPI'],
    link: { label: 'Backend expertise', href: '#expertise' },
  },
  {
    id: 13,
    title: 'DevOps',
    eyebrow: 'Delivery',
    subtitle: 'The path from laptop to production',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#5c4331',
    palette: {
      bg: '#1a1511',
      ink: '#f0e8db',
      accent: '#b98d68',
      soft: '#7a5d45',
      deep: '#0b0806',
    },
    motif: 'stairs',
    layout: 'editorial',
    description:
      'For me, DevOps is empathy for the person deploying at 6pm on a Friday. Automate the repeatable parts, make failures legible, and leave the next person a clear path back to green.',
    stack: ['Linux', 'Docker', 'GitHub Actions', 'AWS', 'Monitoring'],
    link: { label: 'Delivery tools', href: '#expertise' },
  },
  {
    id: 14,
    title: 'Full-Stack Development',
    eyebrow: 'Engineering',
    subtitle: 'From schema to screen',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#3f5c50',
    palette: {
      bg: '#e7e1d6',
      ink: '#171a16',
      accent: '#47675b',
      soft: '#bdb3a2',
      deep: '#242a24',
    },
    motif: 'arch',
    layout: 'split',
    description:
      'I like owning the full path of a feature: the data model, the endpoint, the loading state, the empty state, and the deploy. Full-stack work is less about doing everything and more about seeing the whole.',
    stack: ['Python', 'Django', 'React', 'TypeScript', 'PostgreSQL'],
    link: { label: 'Selected work', href: '#projects' },
  },
  {
    id: 15,
    title: 'Cloud Automation',
    eyebrow: 'Cloud & Infrastructure',
    subtitle: 'Removing the repeatable',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#1f4c4a',
    palette: {
      bg: '#0a1a1a',
      ink: '#e7eee9',
      accent: '#75a89c',
      soft: '#3c625d',
      deep: '#040e0e',
    },
    motif: 'grid',
    layout: 'frame',
    description:
      'Scripts and pipelines that provision, configure, and verify: the small automations that make an environment consistent and give time back to the work that needs a human.',
    stack: ['Python', 'Boto3', 'Terraform', 'Shell', 'AWS CLI'],
    link: { label: 'Automation experiments', href: '#lab' },
  },
  {
    id: 16,
    title: 'NAAB',
    displayTitle: 'NAAB',
    eyebrow: 'Selected work — 03',
    subtitle: 'Ecommerce, end to end',
    author: 'A project by Sidney Odum',
    kind: 'Project',
    spine: '#8f4a2f',
    palette: {
      bg: '#191310',
      ink: '#f2e8da',
      accent: '#c06a43',
      soft: '#7d503a',
      deep: '#0c0806',
    },
    motif: 'product',
    layout: 'editorial',
    description:
      'An ecommerce platform focused on products and online shopping. NAAB is a space to work through catalogue structure, product discovery, and the details that make a store feel trustworthy.',
    stack: ['Ecommerce', 'Product Catalogue', 'Web Application'],
    link: { label: 'Ask about NAAB', href: '#contact' },
  },
  {
    id: 17,
    title: 'Software Architecture',
    eyebrow: 'Architecture',
    subtitle: 'Structure before decoration',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#3c3a33',
    palette: {
      bg: '#f0ebe1',
      ink: '#16140f',
      accent: '#9b7d5a',
      soft: '#cfc4b2',
      deep: '#26221b',
    },
    motif: 'none',
    layout: 'type',
    description:
      'Architecture is the set of decisions that are expensive to change later. I try to make those decisions visible: write them down, name the trade-off, and revisit them when the evidence changes.',
    stack: ['Patterns', 'Boundaries', 'Documentation', 'Trade-offs', 'Evolution'],
    link: { label: 'Read the lab notes', href: '#lab' },
  },
  {
    id: 18,
    title: 'AWS Solutions Architecture',
    eyebrow: 'AWS Certification',
    subtitle: 'Associate',
    author: 'Amazon Web Services',
    kind: 'Credential',
    spine: '#a8642f',
    palette: {
      bg: '#101d26',
      ink: '#f4ead9',
      accent: '#d28b4e',
      soft: '#6b4e35',
      deep: '#071017',
    },
    motif: 'horizon',
    layout: 'editorial',
    description:
      'AWS Certified Solutions Architect – Associate. The certification is a structured way to pressure-test my instincts around resilient, secure, and cost-aware cloud design, and to keep the Well-Architected pillars close to the work.',
    stack: ['AWS', 'Well-Architected', 'Resilience', 'Security', 'Cost'],
    link: { label: 'Verify with AWS', href: 'https://aws.amazon.com/verification/' },
  },
  {
    id: 19,
    title: 'Linux',
    eyebrow: 'Systems',
    subtitle: 'The layer underneath',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#44483e',
    palette: {
      bg: '#0f100e',
      ink: '#e8e6db',
      accent: '#a3ab8f',
      soft: '#5c6252',
      deep: '#060705',
    },
    motif: 'terminal',
    layout: 'band',
    description:
      'The command line is where a lot of cloud work becomes concrete: reading logs, checking a process, moving a file, understanding why a service will not start. I’m comfortable in the terminal and still learning every week.',
    stack: ['Bash', 'SSH', 'systemd', 'Permissions', 'Networking'],
    link: { label: 'Infrastructure toolkit', href: '#expertise' },
  },
  {
    id: 20,
    title: 'Mobile Applications',
    eyebrow: 'Frontend',
    subtitle: 'Small screens, high standards',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#57465e',
    palette: {
      bg: '#211b25',
      ink: '#f0e8ed',
      accent: '#b79fae',
      soft: '#6d586a',
      deep: '#0f0b12',
    },
    motif: 'rings',
    layout: 'split',
    description:
      'An interest I’m developing: mobile interfaces where performance, touch targets, and clarity matter. Android Studio and the fundamentals of responsive, app-like experiences are part of the current learning path.',
    stack: ['Android Studio', 'Kotlin basics', 'Responsive UI', 'Touch'],
    link: { label: 'Frontend expertise', href: '#expertise' },
  },
  {
    id: 21,
    title: 'PostgreSQL',
    eyebrow: 'Data',
    subtitle: 'The quiet centre of the stack',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#2c5164',
    palette: {
      bg: '#0d1a22',
      ink: '#e6edf0',
      accent: '#7fa6b8',
      soft: '#466777',
      deep: '#050d12',
    },
    motif: 'waves',
    layout: 'editorial',
    description:
      'PostgreSQL is my default database: relational integrity, expressive queries, and an ecosystem that rewards understanding the fundamentals. I enjoy the moment a slow query becomes fast for the right reason.',
    stack: ['PostgreSQL', 'SQL', 'Indexes', 'Query Plans', 'JSONB'],
    link: { label: 'Data expertise', href: '#expertise' },
  },
  {
    id: 22,
    title: 'Engineering Experiments',
    eyebrow: 'The lab',
    subtitle: 'Notes from the workbench',
    author: 'Sidney Odum',
    kind: 'Experiment',
    spine: '#4b4132',
    palette: {
      bg: '#17130e',
      ink: '#f0e7d8',
      accent: '#b8a58a',
      soft: '#75644d',
      deep: '#090603',
    },
    motif: 'nodes',
    layout: 'full',
    description:
      'A growing collection of small, honest experiments: Terraform modules, deployment patterns, CI pipelines, and architecture sketches. Each one is a way to learn something properly by building it.',
    stack: ['Terraform', 'AWS', 'CI/CD', 'APIs', 'Prototypes'],
    link: { label: 'Enter the architecture lab', href: '#lab' },
  },
  {
    id: 23,
    title: 'TypeScript',
    eyebrow: 'Frontend',
    subtitle: 'Confidence at compile time',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#3e5b73',
    palette: {
      bg: '#101820',
      ink: '#e9eff2',
      accent: '#7da2c0',
      soft: '#4c6c86',
      deep: '#060c11',
    },
    motif: 'none',
    layout: 'type',
    description:
      'Types are documentation that the compiler checks. I use TypeScript to make interfaces explicit, catch the boring mistakes early, and keep a React codebase easier to change.',
    stack: ['TypeScript', 'React', 'Generics', 'Types', 'Tooling'],
    link: { label: 'Frontend expertise', href: '#expertise' },
  },
  {
    id: 24,
    title: 'Docker',
    eyebrow: 'Delivery',
    subtitle: 'The same app everywhere',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#2b5470',
    palette: {
      bg: '#0c1820',
      ink: '#e8eff2',
      accent: '#7ba5c2',
      soft: '#466b86',
      deep: '#050d12',
    },
    motif: 'blocks',
    layout: 'editorial',
    description:
      'Containers make the environment part of the artifact. I focus on small images, predictable builds, clear environment configuration, and a local setup that resembles production closely enough to be useful.',
    stack: ['Docker', 'Dockerfile', 'Compose', 'Images', 'Amazon ECR'],
    link: { label: 'Delivery toolkit', href: '#expertise' },
  },
  {
    id: 25,
    title: 'JavaScript',
    eyebrow: 'Frontend',
    subtitle: 'The language of the web',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#2e2a1e',
    palette: {
      bg: '#efe5bd',
      ink: '#191710',
      accent: '#2f2c24',
      soft: '#b7a97a',
      deep: '#2b2618',
    },
    motif: 'none',
    layout: 'type',
    description:
      'The language I keep coming back to. I care about the fundamentals — the event loop, the DOM, fetch, modules — because frameworks change and those ideas tend to stay.',
    stack: ['JavaScript', 'ES2023', 'DOM', 'Fetch', 'Modules'],
    link: { label: 'Frontend expertise', href: '#expertise' },
  },
  {
    id: 26,
    title: 'Git & GitHub',
    eyebrow: 'Craft',
    subtitle: 'A record of how the work happened',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#6a3a2e',
    palette: {
      bg: '#1a1210',
      ink: '#f0e6dd',
      accent: '#c58a6d',
      soft: '#7d5444',
      deep: '#0b0706',
    },
    motif: 'stripes',
    layout: 'band',
    description:
      'Clean history, small commits, useful pull requests, and branches that tell a story. Version control is the shared memory of a project, and I try to leave it legible.',
    stack: ['Git', 'GitHub', 'Branches', 'Pull Requests', 'Reviews'],
    link: { label: 'Find me on GitHub', href: 'https://github.com/sidneyodum' },
  },
  {
    id: 27,
    title: 'Tailwind CSS',
    eyebrow: 'Frontend',
    subtitle: 'A system, not a pile of classes',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#3f665c',
    palette: {
      bg: '#e8e2d4',
      ink: '#16201c',
      accent: '#4d766a',
      soft: '#b9b2a0',
      deep: '#232d28',
    },
    motif: 'arcs',
    layout: 'split',
    description:
      'Tailwind works best when it supports a design system rather than replacing one. I use tokens, consistent spacing, and a small set of patterns to keep interfaces coherent as they grow.',
    stack: ['Tailwind CSS', 'Design Tokens', 'Responsive', 'Components'],
    link: { label: 'Frontend expertise', href: '#expertise' },
  },
  {
    id: 28,
    title: 'Observability',
    eyebrow: 'Operations',
    subtitle: 'Understanding what happened',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#2d4d4e',
    palette: {
      bg: '#0a1415',
      ink: '#e4efee',
      accent: '#7fa8a4',
      soft: '#436260',
      deep: '#040b0b',
    },
    motif: 'pulse',
    layout: 'full',
    description:
      'Logs, metrics, and traces answer different questions. I’m learning to instrument systems so that a failure can be understood from evidence rather than guesswork.',
    stack: ['CloudWatch', 'Logs', 'Metrics', 'Tracing', 'Alerts'],
    link: { label: 'Operations lab', href: '#lab' },
  },
  {
    id: 29,
    title: 'Security',
    eyebrow: 'Cloud & Infrastructure',
    subtitle: 'Boring, deliberate, layered',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#6a3f2f',
    palette: {
      bg: '#160f0c',
      ink: '#f2e8dd',
      accent: '#b87650',
      soft: '#754c38',
      deep: '#090504',
    },
    motif: 'shield',
    layout: 'editorial',
    description:
      'Security as a set of defaults: least-privilege roles, private networks, secrets outside the repository, encryption in transit, and a clear idea of what is exposed to the internet and why.',
    stack: ['IAM', 'Secrets Manager', 'WAF', 'TLS', 'Private Subnets'],
    link: { label: 'Secure deployment notes', href: '#lab' },
  },
  {
    id: 30,
    title: 'Performance',
    eyebrow: 'Craft',
    subtitle: 'Respect for the user’s time',
    author: 'Sidney Odum',
    kind: 'Expertise',
    spine: '#4b4a43',
    palette: {
      bg: '#101110',
      ink: '#f1ede4',
      accent: '#b8a58a',
      soft: '#6b6a5e',
      deep: '#060706',
    },
    motif: 'speed',
    layout: 'frame',
    description:
      'Performance is a design constraint, not a cleanup task. I think about payload size, render cost, queries per request, and the small delays that accumulate into a slow experience.',
    stack: ['Profiling', 'Caching', 'Queries', 'Bundle Size', 'Lighthouse'],
    link: { label: 'How I build', href: '#about' },
  },
  {
    id: 31,
    title: 'The Next Chapter',
    eyebrow: 'In progress',
    subtitle: 'Open to what comes next',
    author: 'Sidney Odum',
    kind: 'Future',
    spine: '#7a6a55',
    palette: {
      bg: '#ded4c3',
      ink: '#18140e',
      accent: '#8b6f52',
      soft: '#c3b39c',
      deep: '#2a231a',
    },
    motif: 'moon',
    layout: 'type',
    description:
      'The next volume is unwritten. I’m open to teams and problems where software, cloud, and careful thinking can make a real difference — and where there is still something to learn.',
    stack: ['Open to opportunities', 'Collaboration', 'Curiosity'],
    link: { label: 'Start a conversation', href: '#contact' },
  },
];

/**
 * Back-to-front row order. Index 0 sits closest to the camera at the
 * bottom-right; index 31 disappears off the left edge.
 */
export const BOOK_ORDER = [
  1, 0, 2, 10, 7, 6, 16, 3, 12, 5, 11, 13, 8, 18, 4, 9, 14, 22, 23, 19, 24,
  25, 26, 27, 20, 21, 15, 29, 28, 30, 17, 31,
];

export const BOOK_BY_ID = new Map(BOOKS.map((book) => [book.id, book]));
