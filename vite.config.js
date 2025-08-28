import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 5173,      // 指定端口
    strictPort: false, // 如果端口被占用，自动尝试下一个可用端口
    open: false,     // 不自动打开浏览器
  },
  preview: {
    host: '0.0.0.0', // 预览模式也允许外部访问
    port: 4173,
    strictPort: false,
  }
})
