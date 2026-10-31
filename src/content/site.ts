// All copy and data for the site, taken from the "Salman Sayyed — Portfolio Shell" design.
// Bracketed values ("[Case study title]") are design placeholders waiting for real content.

export const site = {
  name: 'Salman Sayyed',
  role: 'Full Stack Developer',
  tagline: 'Full Stack Developer · Frontend-heavy',
  location: 'Pune, India (IST)',
  email: 'salman.sayyed5451@outlook.com',
  linkedin: 'https://www.linkedin.com/',
  github: 'https://github.com/',
  resume: '#resume',
  year: 2026,
};

export type NavId = 'home' | 'lab' | 'components' | 'playground' | 'ai';

export const navItems: { id: NavId; label: string; href: string }[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'lab', label: 'Lab', href: '/lab' },
  { id: 'components', label: 'Components', href: '/components' },
  { id: 'playground', label: 'Playground', href: '/playground' },
  { id: 'ai', label: 'AI', href: '/ai' },
];

export const hero = {
  eyebrow: 'Full Stack Developer · Frontend-Heavy · Available Now',
  titleLines: ['Frontend depth.', 'Full stack reach.'],
  lead: '7.8+ years building enterprise web apps with React, Next.js, and TypeScript, most recently as UI Lead. Comfortable across the stack with Node.js, PostgreSQL, and REST APIs.',
};

export const modes = {
  lead: [
    {
      tag: 'L.01 — STANDARDS',
      title: 'Standards teams actually follow',
      body: 'Component, accessibility and code-review standards — written down, reviewed and kept current.',
    },
    {
      tag: 'L.02 — DESIGN SYSTEM',
      title: 'A design system run as a product',
      body: 'Token architecture, component APIs, docs and versioning — with a roadmap and real adopters.',
    },
    {
      tag: 'L.03 — PEOPLE',
      title: 'Mentoring and reviews',
      body: 'Pairing, thoughtful PR reviews and growing engineers into owners of their areas.',
    },
  ],
  build: [
    {
      tag: 'B.01 — REACT · TYPESCRIPT',
      title: 'Production React, typed end to end',
      body: 'Component libraries and app architecture in React and TypeScript, built so other teams can extend them safely.',
    },
    {
      tag: 'B.02 — NEXT.JS',
      title: 'Next.js for data-heavy apps',
      body: 'Routing, server rendering and performance budgets for dashboards and consoles.',
    },
    {
      tag: 'B.03 — SECURITY UI',
      title: 'Interfaces for security workflows',
      body: 'AI security, DLP and policy flows where every state has to be unambiguous.',
    },
  ],
};

export const stats: {
  label: string;
  value: number;
  decimals?: number;
  plus?: boolean;
  sample?: boolean;
}[] = [
  { label: 'Years building UI', value: 7.8, decimals: 1, plus: true },
  { label: 'Companies', value: 4 },
  { label: 'Product domains', value: 5 },
  { label: 'Components', value: 120, plus: true, sample: true },
  { label: 'Mentored', value: 15, plus: true, sample: true },
];

export type Company = {
  id: string;
  name: string;
  word: string;
  role: string;
  years: string;
  line: string;
  tags: string[];
  clients?: string[];
  featured?: boolean;
  span: 1 | 2;
};

export const companies: Company[] = [
  {
    id: 'defenxee',
    name: 'Defenxee',
    word: 'DEFENXEE',
    role: 'UI LEAD',
    years: '2026',
    line: 'Built an AI security browser extension and Enterprise Style Guide',
    tags: ['AI SECURITY', 'DLP'],
    featured: true,
    span: 2,
  },
  {
    id: 'quilrai',
    name: 'QuilrAI',
    word: 'QUILRAI',
    role: 'UI LEAD',
    years: '2024–26',
    line: 'Integrated LLM and MCP APIs for real-time prompt security',
    tags: ['AI', 'CYBERSECURITY'],
    featured: true,
    span: 2,
  },
  {
    id: 'apptware',
    name: 'Apptware Solutions',
    word: 'APPTWARE',
    role: 'SENIOR REACT DEVELOPER',
    years: '2019–24',
    line: 'Led frontend for international clients',
    tags: [],
    clients: ['Acryl Data', 'Savant Labs', 'Fintech Finder'],
    span: 2,
  },
  {
    id: 'aloha',
    name: 'Aloha Technology',
    word: 'ALOHA',
    role: 'SOFTWARE DEVELOPER',
    years: '2018–19',
    line: 'Responsive web apps and frontend modules',
    tags: [],
    span: 1,
  },
];

export const career: { date: string; co: string; role: string; wins: string[]; final?: boolean }[] =
  [
    {
      date: 'NOV 2018 – AUG 2019',
      co: 'ALOHA TECHNOLOGY',
      role: 'Software Developer',
      wins: [
        'Built responsive web apps and complete frontend modules in HTML5, CSS3 and JavaScript',
      ],
    },
    {
      date: 'SEP 2019 – SEP 2024',
      co: 'APPTWARE SOLUTIONS',
      role: 'Senior React Developer',
      wins: [
        'Led frontend for international clients: Acryl Data, Savant Labs, Fintech Finder',
        'Built multi-mode authentication (Azure, Face, Passcode) for FinTech',
        'Built reusable Storybook libraries adopted across projects',
      ],
    },
    {
      date: 'SEP 2024 – APR 2026',
      co: 'QUILRAI',
      role: 'UI Lead',
      wins: [
        'Integrated LLM and MCP APIs to power prompt security features',
        'Built prompt and DLP detection with real-time risk signals in the UI',
        'Created a live analytics dashboard with Highcharts',
      ],
    },
    {
      date: 'APR 2026 – JUL 2026',
      co: 'DEFENXEE',
      role: 'UI Lead',
      wins: [
        'Built a browser extension from scratch to detect sensitive prompts',
        'Created the Enterprise Style Guide and a Storybook component library',
        'Ran Scrum ceremonies, code reviews and mentoring',
      ],
    },
    { date: 'NOW', co: 'AVAILABLE', role: 'Next: your team', wins: [], final: true },
  ];

export const careerYears = ['2018', '2019', '2024', '2026'];

export const cases = [
  { id: 'case-1', domain: 'Enterprise AI Security' },
  { id: 'case-2', domain: 'Cybersecurity' },
  { id: 'case-3', domain: 'Data Platforms' },
].map((c) => ({
  ...c,
  title: '[Case study title]',
  summary: '[The problem, what you built, and the result — in two short lines.]',
  role: '[Role]',
  year: '[Year]',
}));

export const principles: [string, string][] = [
  [
    'Systems before screens.',
    'A token, then a component, then the page. Consistency is designed in, not policed later.',
  ],
  [
    'Accessible is part of done.',
    'Focus states, contrast and keyboard paths ship with the feature, not in a follow-up ticket.',
  ],
  ['Small PRs, clear reviews.', 'Shared standards make reviews about the idea, not the formatting.'],
  ['Lead by building.', 'I stay close to the code my team ships, so decisions stay grounded.'],
];

export type TechItem = { id: string; name: string; word: string[]; cap: string; lab?: boolean };

export const techStack: TechItem[] = [
  { id: 'react', name: 'React', word: ['REACT'], cap: 'Component libraries + app architecture', lab: true },
  { id: 'next', name: 'Next.js', word: ['NEXT.JS'], cap: 'SSR, routing + performance budgets' },
  { id: 'js', name: 'JavaScript', word: ['JAVA', 'SCRIPT'], cap: 'Modern ES, DOM + browser APIs' },
  { id: 'ts', name: 'TypeScript', word: ['TYPE', 'SCRIPT'], cap: 'Typed APIs, end to end' },
  { id: 'node', name: 'Node.js', word: ['NODE.JS'], cap: 'Freelance booking system + Express APIs' },
  { id: 'express', name: 'Express.js', word: ['EXPRESS', '.JS'], cap: 'REST APIs for freelance projects' },
  { id: 'pg', name: 'PostgreSQL', word: ['POSTGRE', 'SQL'], cap: 'Booking system data layer' },
  {
    id: 'ai',
    name: 'AI Engineering',
    word: ['AI', 'ENGINEERING'],
    cap: 'LLM + MCP integration, prompt DLP detection',
    lab: true,
  },
  { id: 'tailwind', name: 'Tailwind CSS', word: ['TAILWIND', 'CSS'], cap: 'Token-driven utility styling' },
  {
    id: 'ds',
    name: 'Design Systems',
    word: ['DESIGN', 'SYSTEMS'],
    cap: 'Enterprise style guide + Storybook',
    lab: true,
  },
  { id: 'storybook', name: 'Storybook', word: ['STORY', 'BOOK'], cap: 'Documented, tested components' },
  { id: 'figma', name: 'Figma', word: ['FIGMA'], cap: 'Design-to-code handoff + tokens' },
  { id: 'claude', name: 'Claude', word: ['CLAUDE'], cap: 'AI pair-programming + review' },
  { id: 'cursor', name: 'Cursor', word: ['CURSOR'], cap: 'AI-native editor workflows' },
  { id: 'mentor', name: 'Mentoring', word: ['MENTOR', 'ING'], cap: 'Growing engineers into owners' },
  { id: 'reviews', name: 'Code Reviews', word: ['CODE', 'REVIEWS'], cap: 'Standards-led, small PRs' },
  { id: 'docker', name: 'Docker', word: ['DOCKER'], cap: 'Reproducible dev + preview environments' },
  { id: 'gitlab', name: 'GitLab CI/CD', word: ['GITLAB', 'CI/CD'], cap: 'Pipelines, checks + releases' },
  { id: 'aws', name: 'AWS', word: ['AWS'], cap: 'Hosting + delivery for frontend apps' },
  { id: 'azure', name: 'Azure', word: ['AZURE'], cap: 'Enterprise cloud deploys' },
  { id: 'jest', name: 'Jest', word: ['JEST'], cap: 'Unit + component tests' },
  { id: 'cypress', name: 'Cypress', word: ['CYPRESS'], cap: 'End-to-end user flows' },
];

export type Subpage = {
  index: string;
  title: string;
  path: string;
  lead: string;
  icon: 'flask' | 'blocks' | 'code' | 'sparkles';
  /** The AI page uses the highlight (mauve) icon colour. */
  iconTone: 'primary' | 'highlight';
  status: { label: string; tone: 'info' | 'warning' };
};

export const subpages: Record<Exclude<NavId, 'home'>, Subpage> = {
  lab: {
    index: '02',
    title: 'Lab',
    path: '/lab',
    lead: 'Small projects that show how a feature gets built, step by step.',
    icon: 'flask',
    iconTone: 'primary',
    status: { label: 'In progress', tone: 'info' },
  },
  components: {
    index: '03',
    title: 'Components',
    path: '/components',
    lead: 'A browsable library of the components in my design system, with live previews and usage notes.',
    icon: 'blocks',
    iconTone: 'primary',
    status: { label: 'In progress', tone: 'info' },
  },
  playground: {
    index: '04',
    title: 'Playground',
    path: '/playground',
    lead: 'A space to practise and collaborate on React and JavaScript.',
    icon: 'code',
    iconTone: 'primary',
    status: { label: 'In progress', tone: 'info' },
  },
  ai: {
    index: '05',
    title: 'AI',
    path: '/ai',
    lead: 'Experiments with AI in interfaces and tooling. Scope to be decided.',
    icon: 'sparkles',
    iconTone: 'highlight',
    status: { label: 'Scoping', tone: 'warning' },
  },
};

/** Skeleton sidebar groups on the Components page (bar widths in px, from the design). */
export const componentsSidebar: { label: string; bars: number[] }[] = [
  { label: 'Getting started', bars: [72, 104, 88] },
  { label: 'Foundations', bars: [64, 96, 76, 112] },
  { label: 'Inputs', bars: [84, 60, 100, 70] },
  { label: 'Navigation', bars: [92, 68, 108] },
  { label: 'Feedback', bars: [56, 94, 78] },
];
