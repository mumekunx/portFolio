# detail.md — ファイル構成リファレンス

このプロジェクトの全ファイルについて「何があるか」を記載するリファレンス。
「なぜ・どう動くか」は teach.md、進捗ログは update.md、引き継ぎは baton.md を参照。

> 各セクションコンポーネントは **PC/モバイルの 2 ファイル + 振り分け index.jsx + 各 CSS Modules** という共通構成。
> 該当: `Nav / Hero / About / Skills / Projects / Blog / Contact / Footer`

---

## CI/CD

### `.github/workflows/deploy.yml`
- **役割**: main ブランチへの push 時に自動ビルド→GitHub Pages デプロイを実行するワークフロー。
- **主要**: `npm ci` → `npm run build` → `npm run deploy`（gh-pages パッケージ）
- **依存**: `package.json` の `deploy` / `predeploy` スクリプト、`GITHUB_TOKEN`（自動提供）
- **参照元**: GitHub Actions ランナー

---

## エントリ・ルート

### `src/main.jsx`
- **役割**: アプリのエントリーポイント。`#root` に `<App>` を `StrictMode` でマウント。
- **主要**: `createRoot(...).render(...)`
- **依存**: `react-dom/client`, `./App.jsx`, `./index.css`
- **参照元**: `index.html`

### `src/App.jsx`
- **役割**: ルートコンポーネント。`useIsMobile()` で表示を出し分け。
  - モバイル → `<Nav>` + `<MobileRouter>` + `<Footer>`
  - PC → `<Nav>` + 全セクション縦並び + `<Footer>`、`#blog/<slug>` のときだけ `<BlogPost>` を表示
  - `BlogPost` は `lazy(() => import('./components/BlogPost'))` で遅延ロードし、`<Suspense fallback={null}>` でラップ（記事詳細を開いたときだけ該当チャンクを取得。初期バンドル削減のため）
- **主要**: `App()`（default export）
- **依存**: 全セクションコンポーネント, `MobileRouter`, `BlogPost`(lazy), `useMediaQuery` (`useIsMobile`), `useHashRoute`（`blogSlug` / `navigate` を取得）, `./index.css`
- **参照元**: `main.jsx`

### `src/index.css`
- **役割**: グローバル CSS。カラー変数（`--sage` 緑 / `--clay` テラコッタ / `--sand` ベージュ背景）、アニメーション（`morph` / `float` / `fadeSlideUp`）、`.fade-in` / `.visible` / `.container` ユーティリティ、フォント設定。モバイル時の `body.home-locked`（ホームを `100svh` ぴったりに固定しスクロール無効化）も定義。`@media (prefers-reduced-motion: reduce)` ブロックで、OS 側の設定に応じて全アニメーション/トランジションを実質無効化（`animation-duration`/`transition-duration` を `0.01ms` に、`.fade-in` は即表示）。
- **依存**: Google Fonts (DM Serif Display / DM Sans / Space Mono)
- **参照元**: `main.jsx`, `App.jsx`

### `src/App.css`
- **役割**: Vite テンプレート由来の残骸 CSS（現状ほぼ未使用）。

---

## フック (`src/hooks/`)

### `useMediaQuery.js`
- **役割**: メディアクエリの一致状態を購読するフック。`useSyncExternalStore` ベースに実装（`useState` + `useEffect` での手動購読だと `react-hooks/set-state-in-effect` の lint エラーになるため書き換え）。
- **主要**:
  - `useMediaQuery(query)` — `useSyncExternalStore(subscribe, getSnapshot)` で `matchMedia(query).matches` を返す。`subscribe` は `mql.addEventListener('change', ...)` を購読/解除
  - `useIsMobile()` — `useMediaQuery('(max-width: 768px)')` のショートカット
- **参照元**: `App.jsx`, 全 `index.jsx`（PC/モバイル振り分け）

### `useHashRoute.js`
- **役割**: `window.location.hash` をルートとして購読・操作するフック（モバイルのページ切替、および `#blog/<slug>` 記事詳細ルーティングに使用）。`blogSlug` の解析をここに一元化（以前は各コンポーネント側に散在）。
- **主要**: `useHashRoute()` → `{ hash, navigate(h), reset(), blogSlug }`
  - `hashchange` を購読、`reset()` は履歴を消してホームへ戻す
  - `blogSlug`: `hash` が `blog/` で始まる場合はその後続文字列、それ以外は `null`
- **参照元**: `MobileRouter.jsx`, `App.jsx`

### `useScrollReveal.js`
- **役割**: `.fade-in` 要素を `IntersectionObserver` で監視し、可視になったら `.visible` を付与（スクロール連動フェードイン）。
- **主要**: `useScrollReveal(selector = '.fade-in')`
- **参照元**: 各セクションコンポーネント（フェードイン演出を使うもの）

---

## モバイルルーター (`src/components/MobileRouter/`)

### `MobileRouter.jsx`
- **役割**: モバイル時のページ切替の中核。hash に応じてセクションを 1 ページ表示。
  - 空 / `hero` / 未知の hash → `<Hero>`（ランディング）
  - `about|skills|projects|blog|contact` → 該当セクション + 上部「← Back」ボタン
  - `blogSlug` があるとき → `<BlogPost variant="mobile">` を `<Suspense fallback={null}>` でラップして表示（記事一覧へ戻る「← Blog」バー付き）
  - hash 変更時に scroll-to-top
  - ホーム表示中は `document.body` に `home-locked` クラスを付与（画面ぴったり固定用、index.css 側で制御）
- **主要**: `MobileRouter()`、内部定数 `routes`、`isHome` 判定、`BlogPost = lazy(() => import('../BlogPost'))`
- **依存**: `useHashRoute`（`hash` / `reset` / `navigate` / `blogSlug`）, 各セクション, `BlogPost`(lazy), `MobileRouter.module.css`
- **参照元**: `App.jsx`（モバイル時のみ）

### `index.jsx`
- **役割**: `MobileRouter` の re-export。
### `MobileRouter.module.css`
- **役割**: ページコンテナ・Back バーのスタイル。

---

## ナビゲーション (`src/components/Nav/`)

### `index.jsx`
- **役割**: `useIsMobile()` で `NavDesktop` / `NavMobile` を振り分け。

### `Nav.mobile.jsx`
- **役割**: モバイル用ナビ。スクロールで `scrolled` 状態、バーガーメニュー（フルスクリーンオーバーレイ）、言語ドロップダウン（JP/EN・見た目のみ）、ロゴ "About me"。
- **主要 state**: `scrolled` / `open` / `lang` / `langOpen`、内部定数 `links` / `languages`
- **a11y**: バーガーボタン・言語ドロップダウントリガーに `aria-expanded={open}` / `aria-expanded={langOpen}`。言語ドロップダウンは `Escape` キー押下で `setLangOpen(false)`。
- **依存**: `Nav.mobile.module.css`

### `Nav.desktop.jsx`
- **役割**: PC 用ナビ（ロゴ・リンク・言語切替）。
- **a11y**: `Nav.mobile.jsx` と同様に `aria-expanded`（バーガー/言語トリガー）と `Escape` での言語ドロップダウン閉じ処理あり。`isDarkColor` 判定のコメント誤りを修正済み。
### `Nav.{mobile,desktop}.module.css`
- **役割**: 各バージョンのスタイル。

---

## Hero (`src/components/Hero/`)

### `index.jsx`
- **役割**: `useIsMobile()` で `HeroDesktop` / `HeroMobile` を振り分け。

### `Hero.mobile.jsx`
- **役割**: モバイルのランディング。名前 "Iwai Shuto"・キャッチコピー、背景シェイプ2枚（CSS アニメーションのみ、JS 側の駆動なし）、About/Skills/Projects/Blog への `#hash` リンク。
- **主要**: `HeroMobile()`、内部定数 `navItems`
- **依存**: `Hero.mobile.module.css`

### `Hero.desktop.jsx`
- **役割**: PC のファーストビュー（背景シェイプ2枚、CSS アニメーションのみ）。
### `Hero.{mobile,desktop}.module.css`
- **役割**: 各バージョンのスタイル。背景シェイプに `morph`（形状変化）と `drift`（±15px/±12px・20秒ループの浮遊移動）を併用。以前は `requestAnimationFrame` で JS 側から動かしていたが、CSS `@keyframes drift` に置き換えて JS 常時実行をなくした（`prefers-reduced-motion` にも自動追従）。

---

## コンテンツ各セクション

いずれも `index.jsx`（`useIsMobile` 振り分け）+ `*.desktop.jsx` + `*.mobile.jsx` + 各 `.module.css`。
中身はハードコードされた表示専用コンポーネント。

### `src/components/About/`
- **役割**: 自己紹介・プロフィール（大学/学部/学年/GPA/居住地、実績、写真プレースホルダー）。表示データは `src/data/about.js` の `facts` / `achievements` を desktop/mobile 両方から import（ハードコード撤廃）。
- **a11y**: 実績アイコン（`achieveIcon` の絵文字）に `aria-hidden="true"`。

### `src/components/Skills/`
- **役割**: スキルカード（Frontend / Mobile / Language / Tools）。表示データは `src/data/skills.js` の `categories` を desktop/mobile 両方から import。
- **a11y**: カテゴリアイコン（絵文字）に `aria-hidden="true"`。

### `src/components/Projects/`
- **役割**: 制作物カード 4 件（Wagamama Gourmet / フォトブース落書き App / BoardGames on iPhone / RealTimeNoting）。表示データは `src/data/projects.js` の `projects` を desktop/mobile 両方から import。
- **主要（`Projects.desktop.jsx`）**: 3セット（`[...projects, ...projects, ...projects]` = `loopedProjects`）を並べ、中央セットを基準にスクロール位置をワープさせる無限ループカルーセル。前後の複製セット（`isDuplicate = i < projects.length || i >= projects.length * 2`）のカードには `aria-hidden="true"`、内部リンクには `tabIndex={-1}` を付与し、スクリーンリーダー/キーボード操作が複製カードに触れないようにしている。

### `src/components/Blog/`
- **役割**: ブログ記事一覧セクション。`src/lib/posts.js` から取得した記事メタデータをカード表示。記事が0件のときは `Coming soon...` を表示。記事カードのリンクは `#blog/<slug>` で詳細ページへ遷移。
- **主要ファイル**:
  - `Blog.desktop.jsx` / `Blog.mobile.jsx`: posts 配列を map してカード描画。0件時は `.comingSoon` 表示
  - `Blog.desktop.module.css` / `Blog.mobile.module.css`: `.blog` / `.header` / `.list` / `.postLink` / `.postMeta` / `.date` / `.postTag` / `.postTitle` / `.postExcerpt` / `.readMore` / `.comingSoon`
- **依存**: `lib/posts.js`, `hooks/useScrollReveal`

### `src/components/BlogPost/`
- **役割**: ブログ記事の詳細ページ。`#blog/<slug>` で表示される。`react-markdown` で本文をHTMLレンダリング、コードブロックは `rehype-highlight`（github-dark テーマ）でハイライト。
- **主要ファイル**:
  - `BlogPost.jsx`: `getPost(slug)` で記事取得、`<ReactMarkdown>` で本文描画。`variant="desktop"|"mobile"` で見た目調整、`onBack` で一覧に戻る。マウント中は `document.title` を記事タイトルに書き換え、アンマウント時（`useEffect` のクリーンアップ）に元のタイトルへ復元
  - `BlogPost.module.css`: 記事ヘッダ、本文（h1-h4, p, ul/ol, code, pre, blockquote, table, img）の全タイポグラフィ
  - `index.js`: default export 再エクスポート
- **依存**: `react-markdown`, `remark-gfm`, `rehype-highlight`, `highlight.js/styles/github-dark.css`, `lib/posts.js`
- **参照元**: `App.jsx`（PC、`React.lazy` で遅延ロード）, `MobileRouter.jsx`（モバイル、同じく `React.lazy` で遅延ロード）

### `src/components/Contact/`
- **役割**: 連絡先（メール + SNS）。モバイルでは Hero フッター側にのみ表示する運用。SNS リンク・アイコンは `src/data/socials.jsx` の `socials` を desktop/mobile 両方から import。

### `src/components/Footer/`
- **役割**: フッター。`App.jsx` で常時表示（PC/モバイル共通配置）。

---

## データ (`src/data/`)

各セクションの desktop/mobile 両コンポーネントが共通で import する表示データ。従来は各コンポーネントにハードコードされていたが（食い違いは無かったことを確認のうえ）ここに一元化した。

### `projects.js`
- **役割**: Projects セクションのカードデータ。
- **主要**: `projects`: `{ id, tag, title, description, tech[], github, demo, accent, inProgress }[]`
- **参照元**: `Projects.desktop.jsx`, `Projects.mobile.jsx`

### `socials.jsx`
- **役割**: Contact セクションの SNS リンク・アイコン（`.jsx` 拡張子は JSX の SVG アイコンを含むため）。
- **主要**: `socials`: `{ name, url, icon(JSX) }[]`（GitHub / Twitter・X / Instagram / Zenn）。SNS URL は TODO コメントあり（実際のリンクへの差し替え待ち）
- **参照元**: `Contact.desktop.jsx`, `Contact.mobile.jsx`

### `skills.js`
- **役割**: Skills セクションのカテゴリ別スキル一覧。
- **主要**: `categories`: `{ icon, title, color, items[] }[]`（Frontend/Web, Mobile/App, Language, Tools）
- **参照元**: `Skills.desktop.jsx`, `Skills.mobile.jsx`

### `about.js`
- **役割**: About セクションのプロフィール事実・実績。
- **主要**:
  - `facts`: `{ label, value }[]`（University/Faculty/Year/GPA/Location）
  - `achievements`: `{ icon, title, sub, inProgress? }[]`
- **参照元**: `About.desktop.jsx`, `About.mobile.jsx`

---

## 静的アセット・設定

### `public/`
- `favicon.svg` / `icons.svg`（SNS アイコン等の SVG スプライト）

### `src/assets/`
- `hero.png`（Hero 用画像）, `react.svg` / `vite.svg`（テンプレート残骸）

### `index.html`
- **役割**: HTML テンプレート。`#root` と `main.jsx` の読み込み。`<title>Iwai Shuto | Portfolio</title>`、meta description、OGP（`og:title`/`og:description`/`og:type` 等、`og:image` は画像未確定のため TODO）、`twitter:card` を設定済み。

### `vite.config.js`
- **役割**: Vite 設定。`base` を dev は `/`、build 時のみ `/portFolio/`（GitHub Pages 用）に条件分岐。

### `package.json`
- **役割**: 依存・スクリプト。`dev` / `build` / `lint` / `preview` / `deploy`(gh-pages)。`homepage` は `https://mumekunx.github.io/portFolio/`。`gh-pages` はビルド成果物には含まれないため `dependencies` から `devDependencies` へ移動済み。

### `eslint.config.js`
- **役割**: ESLint 設定（react-hooks / react-refresh プラグイン）。

### `docs/blog-post-template.md`
- **役割**: ブログ記事を書くときのテンプレ。ファイル命名規則、frontmatter フィールド、tag例、Markdown記法、反映フロー、仕組みの解説を含む。
- **依存**: 参照のみ。`src/posts/` に md を追加する際に開く。

### `src/lib/posts.js`
- **役割**: `src/posts/*.md` を Vite の `import.meta.glob` で一括取得し、frontmatter をパース、slug 生成、日付降順ソートして export する。`_` で始まるファイル（_README.md 等）は除外。
- **主要**:
  - `posts`: `{ slug, title, date, tag, excerpt, externalUrl, content }[]`（日付降順）
  - `getPost(slug)`: slug から1件取得
  - `formatDate(dateStr)`: `2026-04-15` → `2026年4月15日`
- **依存**: `../posts/*.md`（glob）
- **参照元**: `Blog.desktop.jsx`, `Blog.mobile.jsx`, `BlogPost.jsx`

### `src/posts/`
- **役割**: ブログ記事の置き場。`YYYY-MM-DD-<slug>.md` 形式のmdファイルを追加するだけでBlogに反映される。
- **ファイル**:
  - `_README.md`: フォルダ自体の説明（`_` プレフィックスで glob から除外される）
  - `YYYY-MM-DD-<slug>.md`: 各記事。frontmatter (title/date/tag/excerpt/external_url) + 本文
- **参照元**: `lib/posts.js`（glob で全件取得）
