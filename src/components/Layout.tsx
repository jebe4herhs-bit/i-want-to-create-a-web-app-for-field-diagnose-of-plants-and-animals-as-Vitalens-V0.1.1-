import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Leaf, ScanSearch, BookOpen, Library, Clock } from 'lucide-react'

const LINKS = [
  { to: '/examine', label: 'Examine', icon: ScanSearch },
  { to: '/atlas', label: 'Atlas', icon: Library },
  { to: '/guide', label: 'Field notes', icon: BookOpen },
  { to: '/history', label: 'Log', icon: Clock },
]

export default function Layout() {
  const { pathname } = useLocation()
  const home = pathname === '/'

  return (
    <div className="min-h-dvh bg-forest text-ink">
      <div className="grain" aria-hidden />
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors ${
          home ? 'bg-transparent' : 'bg-forest/80 backdrop-blur-md border-b border-gold/15'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <NavLink to="/" className="group flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 bg-bark/80">
              <Leaf className="h-4 w-4 text-gold" strokeWidth={1.6} />
            </span>
            <span className="leading-tight">
              <span className="display block text-[17px] font-medium tracking-tight text-ink">
                VitaLens
              </span>
              <span className="specimen-label text-[9px] text-gold/70">Field diagnostics</span>
            </span>
          </NavLink>
          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-1.5 text-[13px] tracking-wide transition ${
                    isActive
                      ? 'bg-gold/15 text-gold'
                      : 'text-ink-dim hover:text-ink'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <NavLink
            to="/examine"
            className="rounded-full bg-gold px-4 py-2 text-[12px] font-medium tracking-wide text-forest hover:bg-ink"
          >
            New reading
          </NavLink>
        </div>
      </header>

      <main className={home ? '' : 'pt-20'}>
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/15 bg-forest/90 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-4">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 text-[10px] tracking-wider uppercase ${
                  isActive ? 'text-gold' : 'text-ink-dim'
                }`
              }
            >
              <Icon className="h-4 w-4" strokeWidth={1.6} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {!home && (
        <footer className="mt-24 border-t border-gold/10 pb-24 pt-10 md:pb-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 text-[12px] text-ink-dim md:flex-row md:items-center md:justify-between">
            <p>VitaLens is a field companion, not a licensed diagnosis.</p>
            <p className="font-mono tracking-widest text-gold/50">SPECIMEN · LIVING TISSUE · 2026</p>
          </div>
        </footer>
      )}
    </div>
  )
}
