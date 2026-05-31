import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { SEED_RECIPES, SEED_PANTRY } from './seed'

const STORAGE_KEY = 'pantry-chef-store-v1'

const StoreContext = createContext(null)

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        recipes: parsed.recipes ?? [],
        pantry: parsed.pantry ?? [],
        mealPlan: parsed.mealPlan ?? {},
      }
    }
  } catch (err) {
    console.error('Failed to load store, reseeding:', err)
  }
  return {
    recipes: SEED_RECIPES,
    pantry: SEED_PANTRY,
    mealPlan: {},
  }
}

const uid = (prefix = 'id') =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

export function StoreProvider({ children }) {
  const [state, setState] = useState(loadInitial)

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (err) {
      console.error('Failed to persist store:', err)
    }
  }, [state])

  // ---- Recipe CRUD ----
  const addRecipe = (recipe) => {
    const id = recipe.id || uid('recipe')
    setState((s) => ({ ...s, recipes: [...s.recipes, { ...recipe, id }] }))
    return id
  }
  const updateRecipe = (id, patch) =>
    setState((s) => ({
      ...s,
      recipes: s.recipes.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }))
  const deleteRecipe = (id) =>
    setState((s) => {
      // also strip the recipe from any meal-plan days
      const mealPlan = {}
      for (const [date, ids] of Object.entries(s.mealPlan)) {
        const kept = ids.filter((rid) => rid !== id)
        if (kept.length) mealPlan[date] = kept
      }
      return { ...s, recipes: s.recipes.filter((r) => r.id !== id), mealPlan }
    })
  const getRecipe = (id) => state.recipes.find((r) => r.id === id)

  // ---- Pantry CRUD ----
  const addPantryItem = (item) =>
    setState((s) => ({
      ...s,
      pantry: [...s.pantry, { ...item, id: item.id || uid('pantry') }],
    }))
  const updatePantryItem = (id, patch) =>
    setState((s) => ({
      ...s,
      pantry: s.pantry.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }))
  const deletePantryItem = (id) =>
    setState((s) => ({ ...s, pantry: s.pantry.filter((p) => p.id !== id) }))

  // Add an ingredient to the pantry, merging by normalized name when possible.
  const stockIngredient = ({ ingredientName, quantity, unit, category }) =>
    setState((s) => {
      const existing = s.pantry.find(
        (p) =>
          p.ingredientName.toLowerCase().trim() ===
          ingredientName.toLowerCase().trim()
      )
      if (existing) {
        const have = parseFloat(existing.quantity)
        const add = parseFloat(quantity)
        const merged =
          !isNaN(have) && !isNaN(add) ? String(have + add) : existing.quantity
        return {
          ...s,
          pantry: s.pantry.map((p) =>
            p.id === existing.id ? { ...p, quantity: merged } : p
          ),
        }
      }
      return {
        ...s,
        pantry: [
          ...s.pantry,
          { id: uid('pantry'), ingredientName, quantity, unit, category },
        ],
      }
    })

  // ---- Meal plan CRUD (date "YYYY-MM-DD" -> recipeId[]) ----
  const assignToDay = (date, recipeId) =>
    setState((s) => {
      const day = s.mealPlan[date] || []
      if (day.includes(recipeId)) return s
      return { ...s, mealPlan: { ...s.mealPlan, [date]: [...day, recipeId] } }
    })
  const removeFromDay = (date, recipeId) =>
    setState((s) => {
      const day = (s.mealPlan[date] || []).filter((id) => id !== recipeId)
      const mealPlan = { ...s.mealPlan }
      if (day.length) mealPlan[date] = day
      else delete mealPlan[date]
      return { ...s, mealPlan }
    })

  const resetStore = () =>
    setState({ recipes: SEED_RECIPES, pantry: SEED_PANTRY, mealPlan: {} })

  const value = {
    ...state,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipe,
    addPantryItem,
    updatePantryItem,
    deletePantryItem,
    stockIngredient,
    assignToDay,
    removeFromDay,
    resetStore,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within a StoreProvider')
  return ctx
}
