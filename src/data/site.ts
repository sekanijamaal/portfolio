/**
 * Central profile + contact details.
 *
 * The project brief did not include live handles or an inbox, so these are
 * intentionally kept in one place. Swap the values below for Sidney's real
 * handles and everything (nav, footer, form, resume) updates with them.
 */
export const site = {
  name: 'Sidney Odum',
  firstName: 'Sidney',
  lastName: 'Odum',
  monogram: 'SO',
  role: 'Software Developer & AWS Solutions Architect',
  shortRole: 'Software Developer & Cloud Architect',
  email: 'hello@sidneyodum.com',
  github: 'https://github.com/sidneyodum',
  linkedin: 'https://www.linkedin.com/in/sidneyodum',
  githubHandle: '@sidneyodum',
  linkedinHandle: 'in/sidneyodum',
  portfolioYear: '2026',
  availability: 'Open to new problems',
  tagline:
    'I build digital products, scalable applications, and the cloud systems behind them.',
  description:
    'I design and build digital products, scalable applications, and cloud infrastructure. My work combines software engineering, cloud architecture, and practical problem-solving to turn ideas into reliable solutions.',
  credentials: [
    'AWS Certified Solutions Architect – Associate',
    'AWS Certified Cloud Practitioner',
  ],
  nav: [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Expertise', href: '#expertise' },
    { label: 'Lab', href: '#lab' },
    { label: 'Experience', href: '#experience' },
  ],
  footerLinks: [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Expertise', href: '#expertise' },
    { label: 'Architecture lab', href: '#lab' },
    { label: 'Certifications', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ],
} as const;
