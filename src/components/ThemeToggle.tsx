import { Moon, Sun } from 'lucide-react'
import type { Theme } from '../hooks/useTheme'

type Props = { theme: Theme; onToggle: () => void }

export default function ThemeToggle({ theme, onToggle }: Props) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative grid size-10 cursor-pointer place-items-center rounded-full border border-line transition-colors hover:bg-fg/10"
    >
      <Sun
        size={18}
        className={`absolute transition-all duration-500 ${
          isDark
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-0 -rotate-90 opacity-0'
        }`}
      />
      <Moon
        size={18}
        className={`absolute transition-all duration-500 ${
          isDark
            ? 'scale-0 rotate-90 opacity-0'
            : 'scale-100 rotate-0 opacity-100'
        }`}
      />
    </button>
  )
}