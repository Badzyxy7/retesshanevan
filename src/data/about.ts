export type Stat = {
  icon: 'graduation' | 'layers'
  label: string
  lines: string[]
}

// x and y are percentages of the photo's width and height.
// The line points at that spot, and the label sits outside it on the given side.
export type Callout = {
  label: string
  x: number
  y: number
  side: 'left' | 'right'
}

export const about = {
  headline: ['I build things that work.', 'I design things that stay.'],
  giantWord: 'CRAFT.',
  paragraphs: [
    'I’m Shane Van Retes, a web developer and graphic designer. I build websites, mobile apps and desktop software, then design the visuals that go with them.',
    'My work ranges from a sign language learning and safety system for a school for the deaf, to an equipment borrowing system for a barangay, to a website for a concrete company.',
    'Before anything ships, I test it and hunt for bugs, so the people using it never have to. Away from the code, I shoot and edit videos.',
  ],
  closing: 'If people can’t use it, it isn’t finished.',
  stats: [
    {
      icon: 'graduation',
      label: 'Education',
      lines: ['Bachelor of Science in Information Technology', '2023-2027'],
    },
    {
      icon: 'layers',
      label: 'What I do',
      lines: [
        'Web & mobile development',
        'Graphic design',
        'QA & RFID integration',
      ],
    },
  ] as Stat[],
  callouts: [
    { label: 'Web development', x: 30, y: 30, side: 'left' },
    { label: 'Graphic design', x: 70, y: 42, side: 'right' },
    { label: 'QA testing', x: 26, y: 66, side: 'left' },
    { label: 'RFID integration', x: 74, y: 76, side: 'right' },
  ] as Callout[],
}