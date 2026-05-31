import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore'
import { useToast } from '../components/Toast'
import EmptyState from '../components/EmptyState'
import {
  CATEGORIES,
  CATEGORY_LABELS,
  guessCategory,
} from '../utils/ingredients'

function PantryRow({ item, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(item)

  const save = () => {
    onSave(item.id, {
      ingredientName: draft.ingredientName.trim() || item.ingredientName,
      quantity: draft.quantity,
      unit: draft.unit,
      category: draft.category,
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="pantry-row pantry-row--editing">
        <input
          value={draft.ingredientName}
          onChange={(e) =>
            setDraft({ ...draft, ingredientName: e.target.value })
          }
        />
        <input
          className="pantry-row__qty"
          value={draft.quantity}
          onChange={(e) => setDraft({ ...draft, quantity: e.target.value })}
        />
        <input
          className="pantry-row__unit"
          value={draft.unit}
          onChange={(e) => setDraft({ ...draft, unit: e.target.value })}
        />
        <select
          value={draft.category}
          onChange={(e) => setDraft({ ...draft, category: e.target.value })}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <button className="btn btn--primary btn--sm" onClick={save}>
          Save
        </button>
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => {
            setDraft(item)
            setEditing(false)
          }}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="pantry-row">
      <span className="pantry-row__name">{item.ingredientName}</span>
      <span className="pantry-row__amount">
        {[item.quantity, item.unit].filter(Boolean).join(' ') || '—'}
      </span>
      <div className="pantry-row__actions">
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => {
            setDraft(item)
            setEditing(true)
          }}
        >
          Edit
        </button>
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => onDelete(item.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default function Pantry() {
  const { pantry, addPantryItem, updatePantryItem, deletePantryItem } =
    useStore()
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    ingredientName: '',
    quantity: '',
    unit: '',
    category: 'other',
  })
  const [categoryTouched, setCategoryTouched] = useState(false)

  const handleNameChange = (value) => {
    setForm((f) => ({
      ...f,
      ingredientName: value,
      category: categoryTouched ? f.category : guessCategory(value),
    }))
  }

  const quickAdd = (e) => {
    e.preventDefault()
    if (!form.ingredientName.trim()) {
      addToast('Enter an ingredient name', 'error')
      return
    }
    addPantryItem({
      ingredientName: form.ingredientName.trim(),
      quantity: form.quantity.trim(),
      unit: form.unit.trim(),
      category: form.category,
    })
    addToast(`Added ${form.ingredientName.trim()} to pantry`)
    setForm({ ingredientName: '', quantity: '', unit: '', category: 'other' })
    setCategoryTouched(false)
  }

  const handleDelete = (id) => {
    deletePantryItem(id)
    addToast('Removed from pantry')
  }

  const filtered = useMemo(
    () =>
      pantry.filter((p) =>
        p.ingredientName.toLowerCase().includes(search.toLowerCase().trim())
      ),
    [pantry, search]
  )

  const grouped = useMemo(() => {
    const groups = {}
    CATEGORIES.forEach((c) => (groups[c] = []))
    filtered.forEach((item) => {
      const cat = CATEGORIES.includes(item.category) ? item.category : 'other'
      groups[cat].push(item)
    })
    return groups
  }, [filtered])

  return (
    <div className="page page--narrow">
      <div className="page__header">
        <h1>Pantry</h1>
        <p className="page__sub">{pantry.length} items on hand</p>
      </div>

      <form className="quick-add" onSubmit={quickAdd}>
        <input
          placeholder="Add an ingredient…"
          value={form.ingredientName}
          onChange={(e) => handleNameChange(e.target.value)}
        />
        <input
          className="quick-add__qty"
          placeholder="Qty"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
        <input
          className="quick-add__unit"
          placeholder="Unit"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
        />
        <select
          value={form.category}
          onChange={(e) => {
            setCategoryTouched(true)
            setForm({ ...form, category: e.target.value })
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn--primary">
          Add
        </button>
      </form>

      {pantry.length === 0 ? (
        <EmptyState
          icon="🧺"
          title="Your pantry is empty"
          message="Add ingredients you have on hand to unlock “recipes I can make”."
        />
      ) : (
        <>
          <input
            className="search"
            placeholder="Search pantry…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filtered.length === 0 ? (
            <p className="muted">No ingredients match “{search}”.</p>
          ) : (
            CATEGORIES.map((cat) =>
              grouped[cat].length ? (
                <section key={cat} className="pantry-group">
                  <h2 className="pantry-group__title">
                    {CATEGORY_LABELS[cat]}{' '}
                    <span className="pantry-group__count">
                      {grouped[cat].length}
                    </span>
                  </h2>
                  <div className="pantry-list">
                    {grouped[cat].map((item) => (
                      <PantryRow
                        key={item.id}
                        item={item}
                        onSave={updatePantryItem}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </section>
              ) : null
            )
          )}
        </>
      )}
    </div>
  )
}
