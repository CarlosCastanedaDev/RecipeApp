import { useMemo } from 'react'
import { useStore } from '../store/useStore'
import { useToast } from '../components/Toast'
import EmptyState from '../components/EmptyState'
import {
  CATEGORIES,
  CATEGORY_LABELS,
  guessCategory,
  normalizeName,
} from '../utils/ingredients'
import { upcomingDays, toKey } from '../utils/dates'

// Build the shopping list: aggregate planned-recipe ingredients over the next
// 14 days, subtract what's in the pantry, and return the shortfall grouped by
// category.
function buildList(mealPlan, getRecipe, pantry) {
  const horizon = new Set(upcomingDays(14).map(toKey))

  // Aggregate needs keyed by normalized name + unit.
  const needs = new Map()
  for (const [date, ids] of Object.entries(mealPlan)) {
    if (!horizon.has(date)) continue
    for (const id of ids) {
      const recipe = getRecipe(id)
      if (!recipe) continue
      for (const ing of recipe.ingredients || []) {
        const norm = normalizeName(ing.name)
        if (!norm) continue
        const unit = (ing.unit || '').toLowerCase().trim()
        const key = `${norm}__${unit}`
        const qty = parseFloat(ing.quantity)
        const entry = needs.get(key) || {
          name: ing.name.trim(),
          norm,
          unit: ing.unit?.trim() || '',
          quantity: 0,
          hasQty: false,
          recipes: new Set(),
        }
        if (!isNaN(qty)) {
          entry.quantity += qty
          entry.hasQty = true
        }
        entry.recipes.add(recipe.title)
        needs.set(key, entry)
      }
    }
  }

  // Subtract pantry stock and keep only shortfalls.
  const missing = []
  for (const entry of needs.values()) {
    const pantryItem = pantry.find(
      (p) => normalizeName(p.ingredientName) === entry.norm
    )
    const sameUnit =
      pantryItem &&
      (pantryItem.unit || '').toLowerCase().trim() ===
        entry.unit.toLowerCase().trim()

    let needQty = entry.hasQty ? entry.quantity : null
    let category = pantryItem?.category || guessCategory(entry.name)

    if (pantryItem) {
      const have = parseFloat(pantryItem.quantity)
      if (needQty != null && sameUnit && !isNaN(have)) {
        const shortfall = needQty - have
        if (shortfall <= 0) continue // fully covered
        needQty = shortfall
      } else {
        // Name is on hand but quantities aren't comparable → assume covered.
        continue
      }
    }

    missing.push({
      key: `${entry.norm}__${entry.unit}`,
      name: entry.name,
      unit: entry.unit,
      quantity: needQty,
      category,
      recipes: [...entry.recipes],
    })
  }

  // Group by category.
  const groups = {}
  CATEGORIES.forEach((c) => (groups[c] = []))
  missing.forEach((m) => {
    const cat = CATEGORIES.includes(m.category) ? m.category : 'other'
    groups[cat].push(m)
  })
  Object.values(groups).forEach((g) =>
    g.sort((a, b) => a.name.localeCompare(b.name))
  )
  return { groups, total: missing.length }
}

export default function ShoppingList() {
  const { mealPlan, getRecipe, pantry, stockIngredient } = useStore()
  const { addToast } = useToast()

  const { groups, total } = useMemo(
    () => buildList(mealPlan, getRecipe, pantry),
    [mealPlan, getRecipe, pantry]
  )

  const markBought = (item) => {
    stockIngredient({
      ingredientName: item.name,
      quantity: item.quantity != null ? String(item.quantity) : '',
      unit: item.unit,
      category: item.category,
    })
    addToast(`${item.name} added to pantry`)
  }

  const hasPlan = Object.keys(mealPlan).length > 0

  if (!hasPlan) {
    return (
      <EmptyState
        icon="🛒"
        title="Nothing planned yet"
        message="Schedule recipes in your meal plan and we'll build the shopping list automatically."
        actionTo="/meal-plan"
        actionLabel="Plan some meals"
      />
    )
  }

  return (
    <div className="page page--narrow">
      <div className="page__header">
        <h1>Shopping List</h1>
        <p className="page__sub">
          {total === 0
            ? 'You have everything you need 🎉'
            : `${total} item${total === 1 ? '' : 's'} to buy for the next 14 days`}
        </p>
      </div>

      {total === 0 ? (
        <EmptyState
          icon="✅"
          title="Pantry's got you covered"
          message="Every planned recipe's ingredients are already in your pantry."
        />
      ) : (
        CATEGORIES.map((cat) =>
          groups[cat].length ? (
            <section key={cat} className="shop-group">
              <h2 className="pantry-group__title">{CATEGORY_LABELS[cat]}</h2>
              <div className="shop-list">
                {groups[cat].map((item) => (
                  <label key={item.key} className="shop-item">
                    <input
                      type="checkbox"
                      onChange={() => markBought(item)}
                      title="Mark as bought (adds to pantry)"
                    />
                    <span className="shop-item__amount">
                      {[
                        item.quantity != null
                          ? +item.quantity.toFixed(2)
                          : '',
                        item.unit,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    </span>
                    <span className="shop-item__name">{item.name}</span>
                    <span className="shop-item__for">
                      for {item.recipes.join(', ')}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          ) : null
        )
      )}
    </div>
  )
}
