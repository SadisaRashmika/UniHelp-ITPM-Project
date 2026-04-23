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
    exclude: ['tests/e2e/**', 'src/pages/**/test/**/*.spec.js', 'node_modules/**', 'dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})
