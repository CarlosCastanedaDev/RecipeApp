import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import { useToast } from '../components/Toast'
import RecipeCard from '../components/RecipeCard'
import EmptyState from '../components/EmptyState'
import { canMakeRecipe } from '../utils/ingredients'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert']

export default function RecipeBrowser() {
  const { recipes, pantry, deleteRecipe } = useStore()
  const { addToast } = useToast()
  const [mealType, setMealType] = useState('all')
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [onlyMakeable, setOnlyMakeable] = useState(false)

  // All distinct ingredient names across recipes, for the multi-select.
  const allIngredients = useMemo(() => {
    const set = new Set()
    recipes.forEach((r) =>
      r.ingredients?.forEach((i) => i.name && set.add(i.name.toLowerCase().trim()))
    )
    return [...set].sort()
  }, [recipes])

  const makeableMap = useMemo(() => {
    const map = {}
    recipes.forEach((r) => {
      map[r.id] = canMakeRecipe(r, pantry)
    })
    return map
  }, [recipes, pantry])

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (mealType !== 'all' && r.mealType !== mealType) return false
      if (onlyMakeable && !makeableMap[r.id]) return false
      if (selectedIngredients.length) {
        const names = (r.ingredients || []).map((i) =>
          i.name.toLowerCase().trim()
        )
        if (!selectedIngredients.every((sel) => names.includes(sel)))
          return false
      }
      return true
    })
  }, [recipes, mealType, onlyMakeable, makeableMap, selectedIngredients])

  const toggleIngredient = (name) =>
    setSelectedIngredients((sel) =>
      sel.includes(name) ? sel.filter((s) => s !== name) : [...sel, name]
    )

  const handleDelete = (recipe) => {
    if (window.confirm(`Delete "${recipe.title}"?`)) {
      deleteRecipe(recipe.id)
      addToast('Recipe deleted')
    }
  }

  if (recipes.length === 0) {
    return (
      <EmptyState
        icon="🍳"
        title="No recipes yet"
        message="Add your first recipe from a YouTube or TikTok link to get cooking."
        actionTo="/add"
        actionLabel="Add a recipe"
      />
    )
  }

  return (
    <div className="page">
      <div className="page__header">
        <h1>Browse Recipes</h1>
        <p className="page__sub">{filtered.length} of {recipes.length} recipes</p>
      </div>

      <div className="filters">
        <div className="filters__group">
          <label className="filters__label">Meal type</label>
          <div className="chip-row">
            <button
              className={'chip' + (mealType === 'all' ? ' chip--active' : '')}
              onClick={() => setMealType('all')}
            >
              All
            </button>
            {MEAL_TYPES.map((m) => (
              <button
                key={m}
                className={'chip' + (mealType === m ? ' chip--active' : '')}
                onClick={() => setMealType(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {allIngredients.length > 0 && (
          <div className="filters__group">
            <label className="filters__label">
              Ingredients{' '}
              {selectedIngredients.length > 0 && (
                <button
                  className="filters__clear"
                  onClick={() => setSelectedIngredients([])}
                >
                  clear
                </button>
              )}
            </label>
            <div className="chip-row chip-row--wrap">
              {allIngredients.map((name) => (
                <button
                  key={name}
                  className={
                    'chip chip--sm' +
                    (selectedIngredients.includes(name) ? ' chip--active' : '')
                  }
                  onClick={() => toggleIngredient(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        <label className="toggle">
          <input
            type="checkbox"
            checked={onlyMakeable}
            onChange={(e) => setOnlyMakeable(e.target.checked)}
          />
          <span>Show only recipes I can make</span>
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No recipes match"
          message="Try clearing some filters or stocking your pantry."
        />
      ) : (
        <div className="grid">
          {filtered.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              canMake={makeableMap[r.id]}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
