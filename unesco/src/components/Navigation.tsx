import { useState } from 'react'
import clsx from 'clsx'
import { navLinks } from '../data/content'

type LenisInstance = {
  scrollTo: (target: any, options?: { offset?: number; duration?: number; instant?: boolean }) => void
}

interface NavigationProps {
  lenis?: LenisInstance | null
}

export default function Navigation({ lenis }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    const target = document.querySelector(href) as HTMLElement | null
    if (!target) return

    if (lenis) {
      lenis.scrollTo(target, { offset: -90, duration: 1.2 })
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-primary/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3 text-textHigh" aria-label="EduVision home">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-accent2 via-accent3 to-accent1 text-sm font-semibold tracking-[0.18em] text-primary shadow-glow">
            EV
          </span>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm uppercase tracking-[0.24em] text-textMid">EduVision</span>
            <span className="text-xs text-textLow">Cultural AI learning</span>
          </div>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.slice(0, 7).map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
              className="text-sm font-medium text-textMid transition hover:text-textHigh"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="#contact"
            onClick={(event) => handleNavClick(event, '#contact')}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-textHigh transition hover:border-accent2 hover:text-accent2"
          >
            Join the pilot
          </a>
        </div>

        <button
          type="button"
          aria-label="Open navigation menu"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-3 text-textHigh transition hover:border-accent2 lg:hidden"
          onClick={() => setMenuOpen((state) => !state)}
        >
          <span className="sr-only">Toggle menu</span>
          <span className={clsx('block h-0.5 w-5 rounded-full bg-textHigh transition-all', menuOpen && 'translate-y-0.5 rotate-45')} />
          <span className={clsx('block h-0.5 w-5 rounded-full bg-textHigh transition-all', menuOpen && 'opacity-0')} />
          <span className={clsx('block h-0.5 w-5 rounded-full bg-textHigh transition-all', menuOpen && '-translate-y-0.5 -rotate-45')} />
        </button>
      </div>

      {menuOpen ? (
        <div className="lg:hidden border-t border-white/10 bg-primary/95 px-4 py-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-textHigh transition hover:border-accent2 hover:text-accent2"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
