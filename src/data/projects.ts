export type Category = 'web' | 'mobile' | 'desktop'

export type Project = {
  id: string
  title: string
  category: Category
  description: string
  tech: string[]
  // Put screenshots in public/projects/ and set e.g. '/projects/safecheck.png'
  image?: string
  // Add a live link or repo URL and a "View project" button appears
  link?: string
}

export const categories: { id: Category; label: string }[] = [
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'desktop', label: 'Desktop apps' },
]

export const projects: Project[] = [
  {
    id: 'safecheck-web',
    title: 'SafeCheck-SignSpeak',
    category: 'web',
    description:
      'An AI-powered educational and student safety monitoring system designed for the Philippine School for the Deaf. It combines two main functions: Filipino Sign Language (FSL) learning and recognition, and RFID-based student attendance and safety monitoring.',
    tech: [
      'Next.js',
      'Python',
      'PostgreSQL',
      'Supabase',
      'Node.js',
      'Prisma ORM',
      'MediaPipe',
      'OpenCV',
      'NumPy',
    ],
    image: '/projects/safecheck.png',
  },
  {
    id: 'eborrow',
    title: 'eBorrow System for Barangay Alabang',
    category: 'web',
    description:
      'Comprehensive web-based equipment borrowing management system for Barangay Alabang featuring equipment tracking, request management, approval workflows, return processing, and cancellation handling. The system streamlines the borrowing process with an intuitive interface for both residents and administrators.',
    tech: ['PHP', 'Tailwind CSS', 'MySQL'],
    image: '/projects/eborrow.png',
  },
  {
    id: 'ald-concrete',
    title: 'ALD Concrete Products',
    category: 'web',
    description:
      'Professional business website for ALD Concrete Products showcasing their construction materials and services. Features include a comprehensive product catalog, company profile, service offerings, and customer inquiry system. Built with modern web technologies for optimal performance and user experience.',
    tech: ['Next.js', 'Tailwind CSS', 'Supabase'],
    image: '/projects/ald-concrete.png',
  },
  {
    id: 'safecheck-mobile',
    title: 'SafeCheck-SignSpeak',
    category: 'mobile',
    description:
      'An AI-powered educational and student safety monitoring system designed for the Philippine School for the Deaf. It combines two main functions: Filipino Sign Language (FSL) learning and recognition, and RFID-based student attendance and safety monitoring.',
    tech: [
      'React Native',
      'Next.js',
      'Python',
      'PostgreSQL',
      'Supabase',
      'Node.js',
      'Prisma ORM',
      'MediaPipe',
      'OpenCV',
      'NumPy',
    ],
    image: '/projects/mobile.jpg',
  },
  {
    id: 'parking',
    title: 'Parking Management System',
    category: 'desktop',
    description:
      'Desktop application for comprehensive parking lot management featuring vehicle check-in and check-out processing, real-time parking space availability tracking, automated billing calculations, and detailed reporting. Designed to streamline parking operations with an efficient user interface.',
    tech: ['C#', 'Windows Forms', 'MySQL', '.NET Framework'],
    image: '/projects/pglogin.png',
  },
  {
    id: 'equipment-borrowing',
    title: 'Equipment Borrowing System',
    category: 'desktop',
    description:
      'Windows desktop application for managing equipment loans and rentals. Features comprehensive user profile management, detailed borrowing history tracking, real-time equipment status monitoring, return processing, and overdue notifications. Streamlines equipment inventory and borrowing operations.',
    tech: ['C#', 'Windows Forms', 'MySQL', '.NET Framework'],
    image: '/projects/eqdashboard.png',
  },
  
]