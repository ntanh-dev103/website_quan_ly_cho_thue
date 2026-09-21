import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide')) return 'vendor-icons';
            if (id.includes('@radix-ui')) return 'vendor-radix';
            if (id.includes('zustand')) return 'vendor-state';
            if (id.includes('react-router-dom') || id.includes('@remix-run')) return 'vendor-router';
            return 'vendor'; // Fallback for other node_modules
          }
        }
      }
    }
  }
})
