# Portfolio プロジェクト概要

## 2026-05-31 — PC版 Nav の背景を「表示中セクション」と完全同期
**立案:**
- 前回はスクロール率全体で色補間したが、実セクションの背景色グラデと一致せず境目が見えていた。
- 各セクションの上端色・下端色を Nav.desktop.jsx 内に定義（hero/about/skills/projects/blog/contact）。
- スクロールごとに「Nav 直下にあるセクション」を `getBoundingClientRect` で検出、そのセクション内の進捗率で上端色↔下端色を補間し Nav 背景に適用。
- 背景色の知覚輝度から自動で文字色（白系/黒系）を切り替え（`.dark` クラス、旧 `.overHero` を置換）。
- 影響範囲: `Nav.desktop.jsx` / `Nav.desktop.module.css`。

## 2026-05-30 21:44 — PC版 Nav の背景を深海テーマと同期
**立案:**
- スクロール位置に応じてNavの背景色を深海グラデの上部色(#4a7795)→下部色(#243f5e)へ線形補間する。
- Hero最上部（scrollY=0）では透明、40pxスクロールから不透明化開始。
- 文字・ロゴ・言語切替ボタンの色も背景に合わせて白系に変更。
- 実装方針: `Nav.desktop.jsx` でscrollYの比率を計算 → CSSカスタムプロパティ `--nav-bg` を上書き → cssは `background: var(--nav-bg)` を参照。
- 影響範囲: `Nav.desktop.jsx` / `Nav.desktop.module.css`。

## 2026-05-28 14:45 — Blog を md ファイルベース管理に
**立案:**
- `src/posts/` に md を追加するだけでブログに反映される仕組みを構築。記事本文もサイト内で表示する。
- 方針:
  - Vite `import.meta.glob('../posts/*.md', { eager: true, query: '?raw', import: 'default' })` で md を全件取得
  - `gray-matter` で frontmatter（title/date/tag/excerpt/external_url 任意）をパース
  - ファイル名から slug を生成（例: `2026-04-15-react-hooks.md` → `react-hooks`）
  - 一覧は date 降順でソート、Blog セクションに記事カードとして表示
  - `#blog/<slug>` の hash で記事詳細ページに遷移、PC/モバイル両対応
  - 本文は `react-markdown` + `remark-gfm` + `rehype-highlight` でレンダリング
  - 「All posts ↗」と Zenn リンクは削除
- 追加ライブラリ: `gray-matter` / `react-markdown` / `remark-gfm` / `rehype-highlight` / `highlight.js`
- 影響範囲: package.json、新規 `src/posts/`・`src/lib/posts.js`・`src/components/BlogPost/`、`src/App.jsx`、`src/components/MobileRouter/`、`src/components/Blog/*`、`docs/blog-post-template.md`、`detail.md`、`index.css`

## 2026-05-28 14:25 — Blog セクションを Coming soon... 表示に
**立案:**
- 現状のダミー記事3件を一旦削除し、`Coming soon...` の単独表示に置き換え。
- 今後の記事追加のため、`docs/blog-post-template.md` を新規作成（メタデータ貼り付け用テンプレ: title / date / tag / url / excerpt）。
- 修正方針:
  - `Blog.desktop.jsx` / `Blog.mobile.jsx` の `posts` 配列・リスト描画・All posts リンクを削除し、中央に `Coming soon...` を表示する `.comingSoon` ブロックに置換。
  - `Blog.desktop.module.css` / `Blog.mobile.module.css` に `.comingSoon` スタイル追加（既存トークン `--font-mono` / `--text-light` を使用）。
  - 不要になった `.list` / `.postLink` 等のスタイル削除（テンプレ復活時の参考にコメントで残さず、git履歴から戻せる前提でクリーンに）。
- 影響範囲: `src/components/Blog/*` の4ファイル、`detail.md`、新規 `docs/blog-post-template.md`。

**完了** ✅
- Blog.desktop.jsx / Blog.mobile.jsx: `Coming soon...` 表示に置換、`posts` 配列とリスト描画削除
- Blog.desktop.module.css / Blog.mobile.module.css: 未使用クラス削除し `.comingSoon` / `.comingSoonText` のみに
- docs/blog-post-template.md: 新規作成（メタデータ貼り付け用テンプレ + 復活手順）
- detail.md: Blog セクションと新規テンプレファイルを反映
- `npm run build` 成功（CSS 32.86KB→30.42KB、JS 234.32KB→231.01KB）。デプロイ前提でローカル確認は未実施。

## 2026-05-28 13:56 — GitHub Pages 公開用パスの確定
**立案:**
- 初回デプロイ前の残TODOだった `vite.config.js` の `base` と `package.json` の `homepage` をリポジトリ実体に合わせて確定する。
- 修正方針: `base` を `/portFolio/`、`homepage` を `https://mumekunx.github.io/portFolio/` に置換。
- 影響範囲: `vite.config.js` / `package.json` / `detail.md`。

**完了** ✅ デプロイ準備完了。`npm run deploy` で公開可能。

## 2026-05-27 — モバイルナビ（About me）をスクロール時も不透明に
**立案:**
- スクロール時のナビ背景が `rgba(247,243,238,0.85)` ＋ blur で半透明になり、裏の内容が透けて見える。不透明にしたい。
- 修正方針: `Nav.mobile.module.css` の `.scrolled` 背景を不透明（`var(--sand)`）に変更。
- 影響範囲: `src/components/Nav/Nav.mobile.module.css` のみ。

**完了** ✅

## 2026-05-27 — モバイルでフッターより下へのオーバースクロールを抑止
**立案:**
- スマホのサブページでスクロール時、iOS のラバーバンドでフッターより下に背景がはみ出して見える。フッターを最下端としてそれ以上スクロールできないようにしたい。
- 修正方針: `index.css` の `html, body` に `overscroll-behavior-y: none` を付与し、ドキュメントのオーバースクロール（バウンス）を無効化。
- 影響範囲: `src/index.css` のみ。

**完了** ✅

## 2026-05-27 — スマホHeroに「Hi, I'm」上のアイコン枠を確保
**立案:**
- 画面固定後、Hero がやや詰まり気味。将来アイコン（アバター）を「Hi, I'm」の上に置くため、その分のスペースを今のうちに確保したい。
- 修正方針: `Hero.mobile.jsx` の `.content` 先頭にアイコン用プレースホルダー要素（円形）を追加。`Hero.mobile.module.css` で円枠を定義しつつ、ナビ（4リンク）のフォント/余白を少し詰めて 100svh 内に収める。
- 影響範囲: `src/components/Hero/Hero.mobile.jsx`, `src/components/Hero/Hero.mobile.module.css`。PC 版・サブページは不変。

**完了** ✅

## 2026-05-27 — スマホ版ホームを画面ぴったり（スクロールなし）に
**立案:**
- スマホのランディング（Hero）で `min-height: 100svh` の Hero の下に Footer が積まれ、合計が画面高を超えてスクロールが発生していた。
- 修正方針: ホーム表示時のみ `document.body` に `home-locked` クラスを付与（`MobileRouter`）。`index.css` のモバイルメディアクエリで `#root`/`main`/`#hero` を flex 化して `100svh` ぴったりに収め `overflow: hidden`。サブページ（about/skills 等）はクラスを外して従来通りスクロール可能のまま。
- 影響範囲: `src/components/MobileRouter/MobileRouter.jsx`, `src/index.css`。PC 版は不変。

**完了** ✅

## 2026-05-27 — detail.md（ファイル構成リファレンス）を新規作成
**立案:**
- CLAUDE.md ルールで必須の `detail.md` が未作成だったため、全ファイルのパス/役割/主要型・メソッド/依存/参照元をまとめたリファレンスを作成する。
- 影響範囲: `detail.md`（新規）のみ。コードには触れない。

**完了** ✅
- src 配下を全走査し、共通構成（index.jsx 振り分け + desktop/mobile + CSS Modules）と hooks / MobileRouter / 各セクションを文書化。

## 2026-05-26 04:37 — vite.config.js の base を dev/build で条件分岐
**立案:**
- 現状 `base: '/your-repo-name/'` が常時適用されているため、`http://localhost:5173/` にアクセスすると空ページになり、IDE内蔵プレビューが真っ黒に見える。
- 修正方針: `defineConfig(({ command }) => ...)` 形式に変更し、`command === 'build'` のときだけ `/your-repo-name/` を base にする。dev では `/`。
- 影響範囲: `vite.config.js` のみ。production ビルドの挙動は据え置き。

**進捗:**
- `vite.config.js` を `defineConfig(({ command }) => ...)` 形式に変更し、dev は `/`、build 時のみ `/your-repo-name/` を base に設定。
- Vite 自動再起動後、`http://localhost:5173/` で正常表示を確認（ヒーロー "Iwai Shuto" 表示OK）。

**完了** ✅

**残課題（別件）:** デプロイ前に `/your-repo-name/` を実リポジトリ名へ置換するTODOは残置。

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
