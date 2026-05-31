import { useStore } from '../store/useStore'
import { useToast } from './Toast'

export default function Footer() {
  const { resetStore } = useStore()
  const { addToast } = useToast()

  const handleReset = () => {
    if (
      window.confirm(
        'Reset to sample data? This replaces your current recipes, pantry, and meal plan.'
      )
    ) {
      resetStore()
      addToast('Sample data restored')
    }
  }

  return (
    <footer className="footer">
      <span>Pantry Chef — local demo</span>
      <button className="btn btn--ghost btn--sm" onClick={handleReset}>
        Reset sample data
      </button>
    </footer>
  )
}
