export type Tool = {
  name: string
  // 'collection:name' from Iconify (e.g. 'simple-icons:figma'),
  // or a local file like '/icons/capcut.svg'
  icon?: string
}

export const tools: Tool[] = [
  { name: 'Next.js', icon: 'simple-icons:nextdotjs' },
  { name: 'React Native', icon: 'simple-icons:react' },
  { name: 'Python', icon: 'simple-icons:python' },
  { name: 'Node.js', icon: 'simple-icons:nodedotjs' },
  { name: 'PHP', icon: 'simple-icons:php' },
  { name: 'C#', icon: 'devicon-plain:csharp' },
  { name: '.NET Framework', icon: 'simple-icons:dotnet' },
  { name: 'PostgreSQL', icon: 'simple-icons:postgresql' },
  { name: 'MySQL', icon: 'simple-icons:mysql' },
  { name: 'Supabase', icon: 'simple-icons:supabase' },
  { name: 'Prisma ORM', icon: 'simple-icons:prisma' },
  { name: 'Tailwind CSS', icon: 'simple-icons:tailwindcss' },
  { name: 'OpenCV', icon: 'simple-icons:opencv' },
  { name: 'NumPy', icon: 'simple-icons:numpy' },
  { name: 'MediaPipe', icon: 'simple-icons:mediapipe' },
  { name: 'Figma', icon: 'simple-icons:figma' },
  { name: 'Canva', icon: 'simple-icons:canva' },
  { name: 'CapCut', icon: 'simple-icons:capcut' },
]

export type Capability = {
  number: string
  title: string
  icon: 'code' | 'film'
  description: string
  skills: string[]
  tech: string[]
}

export const capabilities: Capability[] = [
  {
    number: '01',
    title: 'Web, mobile & design',
    icon: 'code',
    description:
      'I build websites, mobile apps and desktop software, then test them to catch bugs before users do. I also connect RFID hardware to the systems I build and design the visuals around them.',
    skills: [
      'Web development',
      'Mobile development',
      'Graphic design',
      'Bug identification',
      'QA',
      'RFID integration',
    ],
    tech: [
      'Next.js',
      'React Native',
      'Python',
      'Node.js',
      'PHP',
      'C#',
      '.NET Framework',
      'Windows Forms',
      'PostgreSQL',
      'MySQL',
      'Supabase',
      'Prisma ORM',
      'Tailwind CSS',
      'OpenCV',
      'NumPy',
      'MediaPipe',
      'Figma',
      'Canva',
    ],
  },
  {
    number: '02',
    title: 'Video & marketing',
    icon: 'film',
    description:
      'I shoot and edit videos, and use them to promote products as an affiliate marketer.',
    skills: ['Affiliate marketing', 'Film making', 'Video editing'],
    tech: ['CapCut', 'Canva'],
  },
]