import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configure the base path for GitHub Pages to ensure resources are loaded correctly
  base: './',
  server: {
    host: '0.0.0.0', // Allow external access
    port: 5173,      // Specify the port
    strictPort: false, // Automatically try the next available port if the specified port is occupied
    open: false,     // Do not open the browser automatically
  },
  preview: {
    host: '0.0.0.0', // Also allow external access in preview mode
    port: 4173,
    strictPort: false,
  }
})
