import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import RecipeBrowser from './pages/RecipeBrowser'
import AddRecipe from './pages/AddRecipe'
import Pantry from './pages/Pantry'
import MealPlan from './pages/MealPlan'
import ShoppingList from './pages/ShoppingList'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<RecipeBrowser />} />
          <Route path="/add" element={<AddRecipe />} />
          <Route path="/pantry" element={<Pantry />} />
          <Route path="/meal-plan" element={<MealPlan />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="*" element={<RecipeBrowser />} />
        </Routes>
      </main>
    </div>
  )
}
