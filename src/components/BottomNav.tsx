import { NavLink } from 'react-router-dom'
import { cx } from '../lib/format'

const tabs = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/discover', label: 'Discover', icon: SearchIcon },
  { to: '/portfolio', label: 'Portfolio', icon: PieIcon },
  { to: '/learn', label: 'Learn', icon: BookIcon },
]

export function BottomNav() {
  return (
    <nav className="absolute bottom-0 inset-x-0 z-30 px-4 pb-3 pt-2 bg-gradient-to-t from-ink-900 via-ink-900/95 to-transparent">
      <div className="flex items-center justify-around bg-ink-700/80 backdrop-blur border border-white/5 rounded-3xl py-2 shadow-card">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) =>
              cx(
                'flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition',
                isActive ? 'text-accent-soft' : 'text-white/45',
              )
            }
          >
            <t.icon />
            <span className="text-[10px] font-medium">{t.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" />
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
  )
}
function PieIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15.5A9 9 0 1 1 8.5 3" /><path d="M21 12A9 9 0 0 0 12 3v9z" />
    </svg>
  )
}
function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z" /><path d="M9 3v18" />
    </svg>
  )
}
