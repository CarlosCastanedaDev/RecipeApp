import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useToast } from '../components/Toast'
import EmptyState from '../components/EmptyState'
import { thumbnailFor } from '../utils/video'
import { upcomingDays, toKey, formatDay } from '../utils/dates'

function AssignModal({ recipes, onPick, onClose, dateLabel }) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return recipes
    return recipes.filter((r) => r.title.toLowerCase().includes(q))
  }, [recipes, query])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Add recipe to {dateLabel}</h2>
          <button className="btn btn--ghost btn--sm" onClick={onClose}>
            ✕
          </button>
        </div>
        <input
          autoFocus
          className="search"
          placeholder="Search recipes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="modal__results">
          {results.length === 0 ? (
            <p className="muted">No recipes match.</p>
          ) : (
            results.map((r) => {
              const thumb = thumbnailFor(r)
              return (
                <button
                  key={r.id}
                  className="result-row"
                  onClick={() => onPick(r.id)}
                >
                  {thumb ? (
                    <img src={thumb} alt="" />
                  ) : (
                    <div className="result-row__noimg">▶</div>
                  )}
                  <div>
                    <strong>{r.title}</strong>
                    <small>{r.mealType}</small>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default function MealPlan() {
  const { recipes, mealPlan, getRecipe, assignToDay, removeFromDay } =
    useStore()
  const { addToast } = useToast()
  const [activeDate, setActiveDate] = useState(null)

  const days = useMemo(() => upcomingDays(14), [])

  if (recipes.length === 0) {
    return (
      <EmptyState
        icon="🗓️"
        title="No recipes to plan"
        message="Add some recipes first, then schedule them across the next two weeks."
        actionTo="/add"
        actionLabel="Add a recipe"
      />
    )
  }

  const handlePick = (recipeId) => {
    assignToDay(activeDate, recipeId)
    addToast('Added to meal plan')
    setActiveDate(null)
  }

  const activeLabel = activeDate
    ? (() => {
        const d = new Date(activeDate)
        const f = formatDay(d)
        return `${f.weekday} ${f.month} ${f.day}`
      })()
    : ''

  return (
    <div className="page">
      <div className="page__header">
        <h1>Meal Plan</h1>
        <p className="page__sub">Next 14 days</p>
      </div>

      <div className="calendar">
        {days.map((date) => {
          const key = toKey(date)
          const f = formatDay(date)
          const ids = mealPlan[key] || []
          return (
            <div
              key={key}
              className={
                'cal-day' +
                (f.isToday ? ' cal-day--today' : '') +
                (f.isWeekend ? ' cal-day--weekend' : '')
              }
            >
              <div className="cal-day__head">
                <span className="cal-day__weekday">{f.weekday}</span>
                <span className="cal-day__date">
                  {f.month} {f.day}
                </span>
              </div>
              <div className="cal-day__meals">
                {ids.map((id) => {
                  const recipe = getRecipe(id)
                  if (!recipe) return null
                  const thumb = thumbnailFor(recipe)
                  return (
                    <div className="planned" key={id}>
                      {thumb ? (
                        <img src={thumb} alt="" />
                      ) : (
                        <div className="planned__noimg">▶</div>
                      )}
                      <span className="planned__title">{recipe.title}</span>
                      <button
                        className="planned__remove"
                        aria-label="Remove"
                        onClick={() => removeFromDay(key, id)}
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}
              </div>
              <button
                className="cal-day__add"
                onClick={() => setActiveDate(key)}
              >
                + Add
              </button>
            </div>
          )
        })}
      </div>

      <p className="meal-plan__hint">
        Planned meals feed your{' '}
        <Link to="/shopping-list">shopping list</Link>.
      </p>

      {activeDate && (
        <AssignModal
          recipes={recipes}
          dateLabel={activeLabel}
          onPick={handlePick}
          onClose={() => setActiveDate(null)}
        />
      )}
    </div>
  )
}
