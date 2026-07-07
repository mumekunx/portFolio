import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(() => ({
  plugins: [react(), cloudflare()],
  // Cloudflare 独自ドメイン(ルート)配信のため base は '/'
  base: '/',
}))