// Example data used to seed an empty store.

export const SEED_RECIPES = [
  {
    id: 'seed-overnight-oats',
    title: 'Peanut Butter Overnight Oats',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    platform: 'youtube',
    thumbnailUrl: '',
    mealType: 'breakfast',
    tags: ['no-cook', 'meal-prep', 'high-protein'],
    servings: 1,
    prepTime: 5,
    ingredients: [
      { name: 'rolled oats', quantity: '0.5', unit: 'cup' },
      { name: 'milk', quantity: '0.5', unit: 'cup' },
      { name: 'peanut butter', quantity: '1', unit: 'tbsp' },
      { name: 'banana', quantity: '1', unit: '' },
    ],
  },
  {
    id: 'seed-garlic-chicken',
    title: 'One-Pan Garlic Butter Chicken',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    platform: 'youtube',
    thumbnailUrl: '',
    mealType: 'dinner',
    tags: ['one-pan', '30-min', 'gluten-free'],
    servings: 4,
    prepTime: 30,
    ingredients: [
      { name: 'chicken breast', quantity: '4', unit: '' },
      { name: 'garlic', quantity: '4', unit: 'clove' },
      { name: 'butter', quantity: '3', unit: 'tbsp' },
      { name: 'spinach', quantity: '2', unit: 'cup' },
      { name: 'salt', quantity: '1', unit: 'tsp' },
    ],
  },
  {
    id: 'seed-veggie-tacos',
    title: 'Crispy Black Bean Tacos',
    videoUrl: 'https://www.tiktok.com/@food/video/123456789',
    platform: 'tiktok',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
    mealType: 'lunch',
    tags: ['vegetarian', 'budget', 'quick'],
    servings: 2,
    prepTime: 20,
    ingredients: [
      { name: 'black beans', quantity: '1', unit: 'can' },
      { name: 'tortilla', quantity: '6', unit: '' },
      { name: 'cheddar', quantity: '1', unit: 'cup' },
      { name: 'onion', quantity: '1', unit: '' },
      { name: 'cumin', quantity: '1', unit: 'tsp' },
    ],
  },
]

export const SEED_PANTRY = [
  { id: 'p-oats', ingredientName: 'rolled oats', quantity: '2', unit: 'cup', category: 'pantry' },
  { id: 'p-milk', ingredientName: 'milk', quantity: '1', unit: 'cup', category: 'dairy' },
  { id: 'p-pb', ingredientName: 'peanut butter', quantity: '1', unit: 'jar', category: 'pantry' },
  { id: 'p-banana', ingredientName: 'banana', quantity: '3', unit: '', category: 'produce' },
  { id: 'p-garlic', ingredientName: 'garlic', quantity: '1', unit: 'head', category: 'produce' },
  { id: 'p-salt', ingredientName: 'salt', quantity: '1', unit: 'box', category: 'pantry' },
]
