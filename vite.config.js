import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base path matches the GitHub Pages project URL in production builds;
// dev server stays at / so local preview works unchanged
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/ironman-portfolio/' : '/',
  plugins: [react(), tailwindcss()],
}))
