export interface Project {
  id: string;
  index: string;
  name: string;
  category: string;
  status: string;
  summary: string;
  description: string;
  stack: string[];
  image?: string;
  imageAlt?: string;
  coverId?: number;
  artworkLabel?: string;
  href?: string;
  hrefLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'ahome',
    index: '01',
    name: 'AHOME',
    category: 'Real estate & construction',
    status: 'Live',
    summary: 'A property and construction platform for clients in Togo.',
    description:
      'A real estate and construction platform built with Django. AHOME brings property listings, rental management, turnkey construction, civil engineering, and diaspora support into one digital experience — with French and English audiences in mind.',
    stack: ['Django', 'Python', 'Web Platform', 'Real Estate'],
    image: '/projects/ahome.webp',
    imageAlt:
      'Screenshot of the AHOME real estate and construction website homepage.',
    href: 'https://www.ahomemagic.com/',
    hrefLabel: 'Visit the live site',
    coverId: 1,
  },
  {
    id: 'aglf',
    index: '02',
    name: 'AGLF',
    category: 'Conference & events',
    status: 'Live',
    summary: 'The digital home of the Africa Geospatial Leadership Forum.',
    description:
      'An event and conference platform designed to support participation, speaker information, programme details, and event management for the Africa Geospatial Leadership Forum — an invitation-only forum on spatial intelligence for development, investment, and institutional action.',
    stack: ['Django', 'Event Platform', 'Content', 'Deployment'],
    image: '/projects/aglf.webp',
    imageAlt:
      'Screenshot of the Africa Geospatial Leadership Forum website homepage.',
    href: 'https://aglf.bigdataghana.com/',
    hrefLabel: 'Visit the live site',
    coverId: 10,
  },
  {
    id: 'naab',
    index: '03',
    name: 'NAAB',
    category: 'Ecommerce',
    status: 'Project',
    summary: 'An ecommerce platform built around products and discovery.',
    description:
      'An ecommerce platform focused on products and online shopping. NAAB is a space to work through catalogue structure, product discovery, and the details that make a store feel trustworthy — from the first browse to checkout.',
    stack: ['Ecommerce', 'Product Catalogue', 'Web Application'],
    coverId: 16,
    artworkLabel: 'NAAB — Ecommerce',
    href: '#contact',
    hrefLabel: 'Ask about NAAB',
  },
  {
    id: 'iac',
    index: '04',
    name: 'Infrastructure as Code',
    category: 'Cloud experiments',
    status: 'In progress',
    summary: 'Terraform modules for repeatable, reviewable AWS environments.',
    description:
      'An evolving set of Terraform-based infrastructure experiments: reusable VPC modules, IAM boundaries, remote state, and deployment patterns. Built to understand the cloud properly by provisioning it, breaking it, and writing down what the evidence showed.',
    stack: ['Terraform', 'AWS', 'IAM', 'VPC', 'CI/CD'],
    coverId: 3,
    artworkLabel: 'Terraform — Infrastructure as Code',
    href: '#lab',
    hrefLabel: 'Open the architecture lab',
  },
];
