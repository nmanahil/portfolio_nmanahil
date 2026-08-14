export interface Profile {
  name: string
  title: string
  tagline: string
  location: string
  email: string
  linkedin: string
  phone: string
  summary: string
  photos: string[]
}

export interface ExperienceEntry {
  org: string
  role: string
  dateRange: string
  location: string
  status: 'ACTIVE' | 'COMPLETED'
  bullets: string[]
}

export interface ProjectEntry {
  id: string
  name: string
  description: string
  tags: string[]
  status?: string
}

export interface SkillCluster {
  cluster: string
  nodes: string[]
}

export interface Certification {
  name: string
}

export interface LeadershipEntry {
  role: string
  org: string
}

export interface ContactInfo {
  email: string
  linkedin: string
  phone: string
  availability: string
}

export const profile: Profile = {
  name: 'Manahil Nawaz',
  title: 'Cloud IAM Engineer',
  tagline: 'Building secure, scalable identity systems on Azure',
  location: 'Budapest, Hungary',
  email: 'manahilnawaz10@gmail.com',
  linkedin: 'https://linkedin.com/in/manahilnawaz',
  phone: '+36 20 575 2462',
  summary:
    'Final-year BSc Computer Science student at Eötvös Loránd University with industry experience as a Cloud Identity & Access Management Engineering Intern at Morgan Stanley. Experienced in Microsoft Azure, Microsoft Graph API, PowerShell automation, and enterprise identity systems. Passionate about Artificial Intelligence, cloud technologies, and building scalable software.',
  photos: [
    '/87042F7A-858A-4564-AA38-57D0773FD97C.jpeg',
    '/4C2C9910-E54F-46D2-9F59-1D0CD177F48C.jpeg',
    '/5040DCAD-A7B5-4687-BDD1-E186D7396A01.PNG',
  ],
}

export const experience: ExperienceEntry[] = [
  {
    org: 'Morgan Stanley',
    role: 'Technology Intern – Cloud IAM Engineer',
    dateRange: 'Sep 2025 – Present',
    location: 'Budapest, Hungary',
    status: 'ACTIVE',
    bullets: [
      'Developed PowerShell automation to streamline Microsoft Entra ID (Azure AD) B2B group synchronization.',
      'Improved reliability and scalability of enterprise identity workflows while reducing manual operational effort.',
      'Worked with Microsoft Graph API, Azure, IAM, RBAC, and enterprise cloud infrastructure.',
      'Collaborated with cloud security and identity engineering teams on secure access governance.',
    ],
  },
  {
    org: 'Morgan Stanley',
    role: 'Technology Intern – Frontend Developer',
    dateRange: 'Jan 2025 – Aug 2025',
    location: 'Budapest, Hungary',
    status: 'COMPLETED',
    bullets: [
      'Built enterprise Single Page Applications using Angular, TypeScript, HTML, CSS, and JavaScript.',
      'Developed reusable UI components and participated in Agile development, sprint planning, and code reviews.',
      'Contributed to frontend performance optimization across client-facing applications.',
    ],
  },
  {
    org: 'Eötvös Loránd University (ELTE)',
    role: 'Demonstrator – Operating Systems',
    dateRange: 'Feb 2026 – Jul 2026',
    location: 'Budapest, Hungary',
    status: 'COMPLETED',
    bullets: [
      'Conducted practical sessions on Bash and PowerShell scripting.',
      'Mentored students in command-line tools, debugging, and operating systems concepts.',
    ],
  },
  {
    org: 'Meritorious Education Network',
    role: 'Junior IT Assistant',
    dateRange: '2021 – 2022',
    location: 'Remote',
    status: 'COMPLETED',
    bullets: [
      'Supported backend systems, IT operations, and digital platform maintenance.',
      'Ensured reliability of academic systems and accurate record keeping.',
    ],
  },
]

export const projects: ProjectEntry[] = [
  {
    id: 'b2b-identity',
    name: 'B2B Identity Automation Tool',
    description:
      'Enterprise automation solution using PowerShell and Microsoft Graph API to synchronize Azure AD B2B groups and improve operational efficiency at Morgan Stanley.',
    tags: ['PowerShell', 'Microsoft Graph API', 'Azure AD', 'IAM', 'Automation'],
    status: 'Shipped',
  },
  {
    id: 'ai-support',
    name: 'AI Support Assistant',
    description:
      'Contributing to the backend design of an AI-powered enterprise support assistant exploring modern Generative AI concepts and LLM integration.',
    tags: ['Python', 'Generative AI', 'LLMs', 'Backend'],
    status: 'In Progress',
  },
]

export const skills: SkillCluster[] = [
  {
    cluster: 'Cloud & Identity',
    nodes: ['Microsoft Azure', 'Azure AD / Entra ID', 'IAM', 'RBAC', 'B2B Identity', 'Microsoft Graph API', 'Access Governance'],
  },
  {
    cluster: 'Programming',
    nodes: ['Python', 'PowerShell', 'Java', 'C', 'C#', 'TypeScript', 'JavaScript'],
  },
  {
    cluster: 'Web',
    nodes: ['Angular', 'HTML', 'CSS', 'Laravel', 'REST APIs'],
  },
  {
    cluster: 'AI & Concepts',
    nodes: ['Machine Learning', 'Generative AI', 'Prompt Engineering', 'OOP', 'Data Structures', 'Algorithms'],
  },
  {
    cluster: 'Tools',
    nodes: ['Git', 'GitHub', 'Bitbucket', 'Docker', 'VS Code'],
  },
]

export const certifications: Certification[] = [
  { name: 'Python by Google' },
  { name: 'Kali Linux' },
  { name: 'Network Security' },
  { name: 'Encryption' },
  { name: 'Basics of Firewall' },
  { name: 'Cyber Forensics' },
  { name: 'Learning PowerShell' },
]

export const leadership: LeadershipEntry[] = [
  { role: 'International Student Ambassador', org: 'ELTE' },
  { role: 'International Student Advisory Committee Member', org: 'ELTE' },
  { role: 'Senior Student Mentor', org: 'ELTE' },
  { role: 'HOOK Mentor', org: 'ELTE' },
]

export const contact: ContactInfo = {
  email: 'manahilnawaz10@gmail.com',
  linkedin: 'https://linkedin.com/in/manahilnawaz',
  phone: '+36 20 575 2462',
  availability: 'Open to full-time roles and internships in Cloud, IAM, and AI',
}
