import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // dev はルートで提供、本番ビルドだけ GitHub Pages 用のベースパスを使う
  base: command === 'build' ? '/portFolio/' : '/',
}))
