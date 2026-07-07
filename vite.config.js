import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ command }) => ({
  plugins: [react(), cloudflare()],
  // dev はルートで提供、本番ビルドだけ GitHub Pages 用のベースパスを使う
  base: command === 'build' ? '/portFolio/' : '/',
}))