# Portfolio プロジェクト概要

## 概要
情報学部学生向けのポートフォリオサイト。現在はプレースホルダーコンテンツ（TODO）が多数あり、カスタマイズ待ちの状態。

## 使用技術
| カテゴリ | 技術 |
|---|---|
| フレームワーク | React 19 + Vite 8 |
| スタイリング | CSS Modules + グローバルCSS変数 |
| フォント | DM Serif Display / DM Sans / Space Mono (Google Fonts) |
| デプロイ | gh-pages (`npm run deploy`) |

## ファイル構成
```
src/
├── App.jsx              # ルートコンポーネント（全セクション組み立て）
├── index.css            # グローバルCSS変数・アニメーション・ユーティリティ
├── main.jsx             # エントリーポイント
├── assets/              # 画像（hero.png 等）
├── components/          # 各セクションコンポーネント（JSX + CSS Modules）
│   ├── Nav              # ナビゲーション
│   ├── Hero             # ファーストビュー（アニメーション背景）
│   ├── About            # 自己紹介・プロフィール
│   ├── Skills           # スキルカード（Frontend/Backend/AI/Tools）
│   ├── Projects         # 制作物カード
│   ├── Blog             # ブログ
│   ├── Contact          # 問い合わせ
│   └── Footer           # フッター
└── hooks/
    └── useScrollReveal.js  # スクロール連動フェードイン
```

## デザインシステム
- カラー: `--sage`(緑) / `--clay`(テラコッタ) / `--sand`(ベージュ背景)
- アニメーション: `morph`・`float`・`fadeSlideUp` + `fade-in` クラス

## カスタマイズ済みTODO一覧
- [ ] Hero: 名前・キャッチコピー・写真
- [ ] About: 大学名・学部・学年・居住地・自己紹介文・写真
- [ ] Skills: 実際の使用技術に変更
- [ ] Projects: 実際のプロジェクト情報・GitHub/デモリンク
- [ ] package.json: `homepage` URL

---
*最終更新: 2026-05-08*
