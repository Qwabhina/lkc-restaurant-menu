import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/qr-menu/', // Replace '/menu/' with your actual subfolder name if different
  plugins: [vue()],
})
