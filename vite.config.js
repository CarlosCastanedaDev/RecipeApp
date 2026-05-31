import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Served from https://<user>.github.io/RecipeApp/ on GitHub Pages.
  base: '/RecipeApp/',
  plugins: [react()],
})
