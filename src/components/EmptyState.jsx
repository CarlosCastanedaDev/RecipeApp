import { Link } from 'react-router-dom'

export default function EmptyState({ icon = '🍽️', title, message, actionTo, actionLabel }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {actionTo && actionLabel && (
        <Link to={actionTo} className="btn btn--primary">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
