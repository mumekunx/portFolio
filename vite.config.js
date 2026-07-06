import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cloudflare Pages のサブドメインルート(portfolio.cypr.jp)で配信するため、
// dev・build ともに base は '/'(GitHub Pages 用のサブパス base は廃止)。
export default defineConfig({
  plugins: [react()],
  base: '/',
})
