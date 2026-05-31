import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Browse', icon: '🍳', end: true },
  { to: '/add', label: 'Add', icon: '➕' },
  { to: '/pantry', label: 'Pantry', icon: '🧺' },
  { to: '/meal-plan', label: 'Meal Plan', icon: '🗓️' },
  { to: '/shopping-list', label: 'Shopping', icon: '🛒' },
]

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" end className="navbar__brand">
          🥘 Pantry Chef
        </NavLink>
        <nav className="navbar__links">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                'navbar__link' + (isActive ? ' navbar__link--active' : '')
              }
            >
              <span className="navbar__icon">{l.icon}</span>
              <span className="navbar__label">{l.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
