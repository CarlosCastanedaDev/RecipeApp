// Ingredient normalization, category guessing, and pantry matching.

export const CATEGORIES = ['produce', 'protein', 'pantry', 'dairy', 'other']

export const CATEGORY_LABELS = {
  produce: 'Produce',
  protein: 'Protein',
  pantry: 'Pantry staples',
  dairy: 'Dairy',
  other: 'Other',
}

const CATEGORY_KEYWORDS = {
  produce: [
    'onion', 'garlic', 'tomato', 'lettuce', 'spinach', 'pepper', 'carrot',
    'potato', 'broccoli', 'cucumber', 'lemon', 'lime', 'apple', 'banana',
    'avocado', 'mushroom', 'celery', 'ginger', 'cilantro', 'basil', 'parsley',
    'lime', 'kale', 'zucchini', 'corn', 'scallion', 'green onion', 'herb',
  ],
  protein: [
    'chicken', 'beef', 'pork', 'turkey', 'fish', 'salmon', 'shrimp', 'tofu',
    'egg', 'bacon', 'sausage', 'lamb', 'tuna', 'bean', 'lentil', 'chickpea',
    'steak', 'ground', 'mince',
  ],
  dairy: [
    'milk', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt', 'parmesan',
    'mozzarella', 'cheddar', 'feta', 'sour cream',
  ],
  pantry: [
    'flour', 'sugar', 'salt', 'pepper', 'oil', 'rice', 'pasta', 'noodle',
    'vinegar', 'soy sauce', 'stock', 'broth', 'spice', 'cumin', 'paprika',
    'oregano', 'baking', 'honey', 'syrup', 'tortilla', 'bread', 'oat',
    'cornstarch', 'sauce', 'paste', 'can', 'beans', 'chili',
  ],
}

export function guessCategory(name = '') {
  const n = name.toLowerCase()
  for (const cat of ['protein', 'dairy', 'produce', 'pantry']) {
    if (CATEGORY_KEYWORDS[cat].some((kw) => n.includes(kw))) return cat
  }
  return 'other'
}

// Normalize an ingredient name for matching: lowercase, trim, drop a trailing
// plural "s" so "tomatoes" ~ "tomato".
export function normalizeName(name = '') {
  let n = name.toLowerCase().trim().replace(/\s+/g, ' ')
  n = n.replace(/(\w)s\b/g, '$1') // crude singularize
  return n
}

// Does the pantry satisfy a single recipe ingredient?
// Matches by normalized name. If both have a numeric quantity AND the same
// unit, also require pantry quantity >= needed quantity.
export function pantryHasIngredient(ing, pantry) {
  const target = normalizeName(ing.name)
  if (!target) return true
  const match = pantry.find((p) => normalizeName(p.ingredientName) === target)
  if (!match) return false
  const need = parseFloat(ing.quantity)
  const have = parseFloat(match.quantity)
  const sameUnit =
    (ing.unit || '').toLowerCase().trim() ===
    (match.unit || '').toLowerCase().trim()
  if (!isNaN(need) && !isNaN(have) && sameUnit) {
    return have >= need
  }
  return true // name present but quantities not comparable → assume on hand
}

// Can every ingredient of a recipe be satisfied by the pantry?
export function canMakeRecipe(recipe, pantry) {
  if (!recipe.ingredients || recipe.ingredients.length === 0) return false
  return recipe.ingredients.every((ing) => pantryHasIngredient(ing, pantry))
}
