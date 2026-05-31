import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useToast } from '../components/Toast'
import { detectPlatform, thumbnailFor, PLATFORM_LABELS } from '../utils/video'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert']
const emptyIngredient = () => ({ name: '', quantity: '', unit: '' })

export default function AddRecipe() {
  const { addRecipe } = useStore()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [videoUrl, setVideoUrl] = useState('')
  const [title, setTitle] = useState('')
  const [mealType, setMealType] = useState('dinner')
  const [prepTime, setPrepTime] = useState('')
  const [servings, setServings] = useState('')
  const [tags, setTags] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [ingredients, setIngredients] = useState([emptyIngredient()])

  const platform = detectPlatform(videoUrl)
  const needsManualThumb =
    videoUrl.trim() && platform !== 'youtube'
  const previewThumb = thumbnailFor({ videoUrl, platform, thumbnailUrl })

  const setIngredient = (i, field, value) =>
    setIngredients((list) =>
      list.map((ing, idx) => (idx === i ? { ...ing, [field]: value } : ing))
    )
  const addIngredientRow = () =>
    setIngredients((list) => [...list, emptyIngredient()])
  const removeIngredientRow = (i) =>
    setIngredients((list) =>
      list.length === 1 ? list : list.filter((_, idx) => idx !== i)
    )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      addToast('Please give the recipe a title', 'error')
      return
    }
    const cleanIngredients = ingredients
      .filter((i) => i.name.trim())
      .map((i) => ({
        name: i.name.trim(),
        quantity: i.quantity.trim(),
        unit: i.unit.trim(),
      }))

    addRecipe({
      title: title.trim(),
      videoUrl: videoUrl.trim(),
      platform,
      thumbnailUrl: thumbnailUrl.trim(),
      mealType,
      prepTime: prepTime ? Number(prepTime) : null,
      servings: servings ? Number(servings) : null,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      ingredients: cleanIngredients,
    })
    addToast('Recipe saved!')
    navigate('/')
  }

  return (
    <div className="page page--narrow">
      <div className="page__header">
        <h1>Add a Recipe</h1>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Video URL</span>
          <input
            type="url"
            placeholder="https://youtube.com/watch?v=…  or TikTok/Instagram link"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          {videoUrl.trim() && (
            <small className="field__hint">
              Detected platform: <strong>{PLATFORM_LABELS[platform]}</strong>
            </small>
          )}
        </label>

        {needsManualThumb && (
          <label className="field">
            <span className="field__label">
              Thumbnail image URL{' '}
              <span className="field__optional">
                ({PLATFORM_LABELS[platform]} thumbnails can't be auto-fetched)
              </span>
            </span>
            <input
              type="url"
              placeholder="https://…/image.jpg"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
            />
          </label>
        )}

        {previewThumb && (
          <img className="thumb-preview" src={previewThumb} alt="preview" />
        )}

        <label className="field">
          <span className="field__label">Title *</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Creamy Tuscan Chicken"
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field__label">Meal type</span>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
            >
              {MEAL_TYPES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field__label">Prep time (min)</span>
            <input
              type="number"
              min="0"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
            />
          </label>
          <label className="field">
            <span className="field__label">Servings</span>
            <input
              type="number"
              min="0"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </label>
        </div>

        <label className="field">
          <span className="field__label">
            Tags <span className="field__optional">(comma separated)</span>
          </span>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="quick, vegetarian, meal-prep"
          />
        </label>

        <div className="field">
          <span className="field__label">Ingredients</span>
          <div className="ingredient-list">
            {ingredients.map((ing, i) => (
              <div className="ingredient-row" key={i}>
                <input
                  className="ingredient-row__name"
                  placeholder="Ingredient"
                  value={ing.name}
                  onChange={(e) => setIngredient(i, 'name', e.target.value)}
                />
                <input
                  className="ingredient-row__qty"
                  placeholder="Qty"
                  value={ing.quantity}
                  onChange={(e) => setIngredient(i, 'quantity', e.target.value)}
                />
                <input
                  className="ingredient-row__unit"
                  placeholder="Unit"
                  value={ing.unit}
                  onChange={(e) => setIngredient(i, 'unit', e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => removeIngredientRow(i)}
                  aria-label="Remove ingredient"
                  disabled={ingredients.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={addIngredientRow}
          >
            + Add ingredient
          </button>
        </div>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary">
            Save recipe
          </button>
        </div>
      </form>
    </div>
  )
}
