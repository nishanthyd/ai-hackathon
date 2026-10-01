import { useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { siteNav } from '../../data/content'

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const activePath = useMemo(() => location.pathname, [location.pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-primary/85 backdrop-blur-xl shadow-soft">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3 text-textHigh" aria-label="EduVision home">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-accent2 via-accent3 to-accent1 text-sm font-semibold text-primary shadow-glow">
            EV
          </span>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm uppercase tracking-[0.24em] text-textMid">EduVision</span>
            <span className="text-xs text-textLow">Personalized AI Learning Platform</span>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-8 lg:flex">
          {siteNav.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-accent2 font-semibold' : 'text-textMid hover:text-textHigh'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-3 text-textHigh transition hover:border-accent2 lg:hidden"
          onClick={() => setMenuOpen((state) => !state)}
        >
          <span className={`block h-0.5 w-5 rounded-full bg-textHigh transition-all ${menuOpen ? 'translate-y-0.5 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 rounded-full bg-textHigh transition-all ${menuOpen ? 'opacity-0' : 'my-1'}`} />
          <span className={`block h-0.5 w-5 rounded-full bg-textHigh transition-all ${menuOpen ? '-translate-y-0.5 -rotate-45' : ''}`} />
        </button>
      </div>

      {menuOpen ? (
        <div className="lg:hidden border-t border-white/10 bg-primary/95 px-4 py-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4">
            {siteNav.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-textHigh transition hover:border-accent2 hover:text-accent2 ${
                    isActive ? 'border-accent2 text-accent2' : ''
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
