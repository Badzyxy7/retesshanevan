export type Channel = {
  id: string
  label: string
  // What's shown on the card
  value: string
  // Where the card goes when clicked
  href: string
  // 'mail', or an Iconify name like 'simple-icons:github'
  icon: string
  // Adds a copy-to-clipboard button
  copy?: boolean
}

export const contact = {
  title: ['LET’S', 'WORK', 'TOGETHER'],
  tagline: 'Have a website, app or design in mind?',
  body: 'I’m open to web, mobile and design projects, and to affiliate partnerships.',
  // Put your resume in the public folder with this name, or delete this line to hide the button
  resume: '/resume.png',
  // The "Send me a message" button opens an email to this address
  email: 'retesshanevan@gmail.com',
  channels: [
    {
      id: 'email',
      label: 'Email',
      value: 'retesshanevan@gmail.com',
      href: 'mailto:retesshanevan@gmail.com',
      icon: 'mail',
      copy: true,
    },
    {
      id: 'affiliate',
      label: 'Affiliate email',
      value: 'badzytechaffiliate@gmail.com',
      href: 'mailto:badzytechaffiliate@gmail.com',
      icon: 'mail',
      copy: true,
    },
    {
      id: 'github',
      label: 'GitHub',
      value: 'github.com/Badzyxy7',
      href: 'https://github.com/Badzyxy7',
      icon: 'simple-icons:github',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/in/shanevanretes',
      href: 'https://linkedin.com/in/shanevanretes',
      icon: 'simple-icons:linkedin',
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      value: 'tiktok.com/@bdzyxy',
      href: 'https://tiktok.com/@bdzyxy',
      icon: 'simple-icons:tiktok',
    },
  ] as Channel[],
}