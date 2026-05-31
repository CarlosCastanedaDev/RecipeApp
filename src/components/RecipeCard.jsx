import { thumbnailFor, PLATFORM_LABELS } from '../utils/video'

const MEAL_EMOJI = {
  breakfast: '🌅',
  lunch: '🥪',
  dinner: '🍝',
  snack: '🍿',
  dessert: '🍰',
}

export default function RecipeCard({ recipe, canMake, onDelete }) {
  const thumb = thumbnailFor(recipe)
  return (
    <article className={'card' + (canMake ? ' card--makeable' : '')}>
      <a
        className="card__media"
        href={recipe.videoUrl || '#'}
        target="_blank"
        rel="noreferrer"
      >
        {thumb ? (
          <img src={thumb} alt={recipe.title} loading="lazy" />
        ) : (
          <div className="card__media-fallback">
            <span>▶</span>
            <small>{PLATFORM_LABELS[recipe.platform] || 'Video'}</small>
          </div>
        )}
        <span className="card__platform">
          {PLATFORM_LABELS[recipe.platform] || 'Link'}
        </span>
        {canMake && <span className="card__makeable-badge">✓ Can make</span>}
      </a>
      <div className="card__body">
        <div className="card__badges">
          <span className={`badge badge--${recipe.mealType}`}>
            {MEAL_EMOJI[recipe.mealType] || '🍽️'} {recipe.mealType}
          </span>
          {recipe.prepTime ? (
            <span className="badge badge--muted">⏱ {recipe.prepTime} min</span>
          ) : null}
          {recipe.servings ? (
            <span className="badge badge--muted">🍴 {recipe.servings}</span>
          ) : null}
        </div>
        <h3 className="card__title">{recipe.title}</h3>
        {recipe.tags?.length > 0 && (
          <div className="card__tags">
            {recipe.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        )}
        <ul className="card__ingredients">
          {recipe.ingredients?.map((ing, i) => (
            <li key={i}>
              {[ing.quantity, ing.unit, ing.name].filter(Boolean).join(' ')}
            </li>
          ))}
        </ul>
        {onDelete && (
          <button
            className="btn btn--ghost btn--sm card__delete"
            onClick={() => onDelete(recipe)}
          >
            Delete
          </button>
        )}
      </div>
    </article>
  )
}
