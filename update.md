# Portfolio プロジェクト概要
## 2026-07-05 00:15 — サイト全体改善(SEO/パフォーマンス/a11y/データ一元化)
**立案:**
- サイト全体の改善点レビューで挙がった項目のうち、ユーザー素材が不要なものを Sonnet サブエージェント並列で実装する。
- 計画概要(4エージェント並列):
  1. SEO/meta: index.html に title・meta description・OGP・Twitter カード追加、BlogPost で document.title を記事タイトルに変更
  2. パフォーマンス/ルーティング: BlogPost を React.lazy で遅延ロード、blogSlug 解析を useHashRoute に一元化、Hero の rAF アニメを CSS keyframes 化
  3. データ一元化+a11y: projects/socials/skills/about データを src/data/ に切り出し desktop/mobile 両方から import、カルーセル複製セットに aria-hidden、絵文字アイコンに aria-hidden
  4. グローバルCSS/Nav: prefers-reduced-motion 対応、ハンバーガーに aria-expanded、gh-pages を devDependencies へ移動
- 影響範囲: index.html, src/App.jsx, src/components/**(Hero/Nav/Projects/Contact/Skills/About/Blog/BlogPost/MobileRouter), src/hooks/useHashRoute.js, src/index.css, src/data/(新規), package.json
- 事前作業として重複ファイル「〜 2.*」16個を削除済み(全て古いコピーであることを検証済み)。作業ブランチ: feature/20260705-0014-site-improvements

**進捗:**
- エージェント1(SEO/meta): `index.html` に `<title>Iwai Shuto | Portfolio</title>`・meta description・OGP(`og:image` は TODO のまま)・`twitter:card` を追加。`BlogPost.jsx` は記事表示中のみ `document.title` を記事タイトルに書き換え、アンマウント時に元のタイトルへ復元。
- エージェント2(パフォーマンス/ルーティング): `App.jsx` / `MobileRouter.jsx` の `BlogPost` を `React.lazy` + `Suspense` 化し、記事詳細を開いたときだけ該当チャンクを読み込むように変更(初期バンドル 567KB → 237KB、BlogPost チャンクは 322KB で記事閲覧時のみ取得)。`blogSlug` の解析(`#blog/<slug>` 判定)を `useHashRoute.js` に一元化し、同フックが `{ hash, navigate, reset, blogSlug }` を返すよう変更。`Hero.desktop.jsx` / `Hero.mobile.jsx` の `requestAnimationFrame` 常時アニメを削除し、CSS `@keyframes drift`(`morph` と併用、±15px/±12px・20秒ループ)に置換。
- エージェント3(データ一元化+a11y): `src/data/projects.js`・`src/data/socials.jsx`・`src/data/skills.js`・`src/data/about.js` を新規作成し、Projects/Contact/Skills/About の desktop・mobile 計8コンポーネントから import する形に変更(desktop/mobile 間のデータ食い違いは事前調査で無かったことを確認済み)。`Projects.desktop.jsx` のカルーセル複製セット(3セット中1・3セット目、`isDuplicate` 判定)に `aria-hidden` + リンクの `tabIndex={-1}` を付与。Skills/About の装飾絵文字 `span` に `aria-hidden="true"` を付与。
- エージェント4(グローバルCSS/Nav): `index.css` に `@media (prefers-reduced-motion: reduce)` ブロックを追加(アニメーション/トランジションを実質無効化、`.fade-in` は即表示)。`Nav.desktop.jsx` / `Nav.mobile.jsx` のハンバーガーボタンに `aria-expanded`、言語ドロップダウンに `Escape` キーで閉じる処理を追加、`isDarkColor` のコメント誤りを修正。`package.json` の `gh-pages` を `dependencies` から `devDependencies` へ移動。
- 追加修正: `useMediaQuery.js` の既存 lint エラー(`react-hooks/set-state-in-effect`)を、`useState` + `useEffect` 購読方式から `useSyncExternalStore` ベースの実装に変更して解消。`useIsMobile()` は従来どおり `useMediaQuery('(max-width: 768px)')` のショートカット。
- 事前クリーンアップ: 「〜 2.md」等の重複ファイル16個を検証のうえ削除。`node_modules` 破損(`micromark-extension-gfm-footnote` の lib 欠損)をクリーン再インストールで解消。
- 検証: `npm run build` 成功。ESLint は `useMediaQuery` 修正後 0 件見込み。

**完了** ✅
- 学習価値の高いパターンとして、`teach.md` に追加を検討すべき候補章: 「React.lazy + Suspense によるコード分割(ルートベースの遅延ロード)」「useSyncExternalStore で外部ストア(matchMedia など)を安全に購読する方法」。
- main マージ後、GitHub Pages デプロイが失敗し続けていたことが判明。6/29 のワークフロー追加以降、gh-pages の認証エラー `ProcessError: fatal: could not read Username for 'https://github.com'` で一度も成功していなかった。
- `deploy.yml` の Deploy ステップで `https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git` を明示したトークン付きリモート URL を渡すよう修正し、認証エラーを解消。

## 2026-06-29 09:00 — GitHub Actions による自動デプロイ設定
**立案:**
- main push 時に自動で GitHub Pages へデプロイする CI/CD を追加。
- 既存の `npm run deploy`（gh-pages パッケージ）をそのまま CI でも実行する方針。
- `GITHUB_TOKEN` を使用するため追加シークレット設定は不要。
- 影響範囲: `.github/workflows/deploy.yml`（新規）

**完了:**
- `.github/workflows/deploy.yml` を作成。
- detail.md / update.md を更新。

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
