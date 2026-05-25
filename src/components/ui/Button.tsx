import { Link } from '@/navigation'
import type { ComponentProps } from 'react'

type Variant = 'primary' | 'secondary' | 'ink'

interface ButtonProps {
  variant?: Variant
  href?: string
  children: React.ReactNode
  type?: 'submit' | 'button'
  onClick?: () => void
  className?: string
}

const base =
  'inline-flex items-center gap-2.5 px-[22px] py-3 text-[13px] font-[500] tracking-[-0.005em] border rounded-md transition-all duration-200 whitespace-nowrap cursor-pointer'

const variants: Record<Variant, string> = {
  primary:
    'bg-bone-50 text-ink-950 border-transparent hover:-translate-y-px hover:bg-white',
  secondary:
    'bg-transparent text-bone-50 border-[var(--rule-strong)] hover:border-lav-300 hover:text-lav-300',
  ink: 'bg-ink-950 text-bone-50 border-transparent hover:-translate-y-px',
}

export function Button({ variant = 'secondary', href, children, type = 'button', onClick, className = '' }: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`

  if (href) {
    return (
      <Link href={href as ComponentProps<typeof Link>['href']} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  )
}

export function Arrow() {
  return (
    <span
      className="inline-block font-mono transition-transform duration-200 group-hover:translate-x-0.5"
      aria-hidden
    >
      →
    </span>
  )
}
