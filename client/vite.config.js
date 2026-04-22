import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    css: true,
    setupFiles: './src/test/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
})
