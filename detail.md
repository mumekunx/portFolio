# detail.md — ファイル構成リファレンス

このプロジェクトの全ファイルについて「何があるか」を記載するリファレンス。
「なぜ・どう動くか」は teach.md、進捗ログは update.md、引き継ぎは baton.md を参照。

> 各セクションコンポーネントは **PC/モバイルの 2 ファイル + 振り分け index.jsx + 各 CSS Modules** という共通構成。
> 該当: `Nav / Hero / About / Skills / Projects / Blog / Contact / Footer`

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
  - PC → `<Nav>` + 全セクション縦並び + `<Footer>`
- **主要**: `App()`（default export）
- **依存**: 全セクションコンポーネント, `MobileRouter`, `useMediaQuery` (`useIsMobile`), `./index.css`
- **参照元**: `main.jsx`

### `src/index.css`
- **役割**: グローバル CSS。カラー変数（`--sage` 緑 / `--clay` テラコッタ / `--sand` ベージュ背景）、アニメーション（`morph` / `float` / `fadeSlideUp`）、`.fade-in` / `.visible` / `.container` ユーティリティ、フォント設定。モバイル時の `body.home-locked`（ホームを `100svh` ぴったりに固定しスクロール無効化）も定義。
- **依存**: Google Fonts (DM Serif Display / DM Sans / Space Mono)
- **参照元**: `main.jsx`, `App.jsx`

### `src/App.css`
- **役割**: Vite テンプレート由来の残骸 CSS（現状ほぼ未使用）。

---

## フック (`src/hooks/`)

### `useMediaQuery.js`
- **役割**: メディアクエリの一致状態を購読するフック。
- **主要**:
  - `useMediaQuery(query)` — `matchMedia` の結果を state で返す
  - `useIsMobile()` — `useMediaQuery('(max-width: 768px)')` のショートカット
- **参照元**: `App.jsx`, 全 `index.jsx`（PC/モバイル振り分け）

### `useHashRoute.js`
- **役割**: `window.location.hash` をルートとして購読・操作するフック（モバイルのページ切替に使用）。
- **主要**: `useHashRoute()` → `{ hash, navigate(h), reset() }`
  - `hashchange` を購読、`reset()` は履歴を消してホームへ戻す
- **参照元**: `MobileRouter.jsx`

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
  - hash 変更時に scroll-to-top
  - ホーム表示中は `document.body` に `home-locked` クラスを付与（画面ぴったり固定用、index.css 側で制御）
- **主要**: `MobileRouter()`、内部定数 `routes` / `labels`、`isHome` 判定
- **依存**: `useHashRoute`, 各セクション, `MobileRouter.module.css`
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
- **依存**: `Nav.mobile.module.css`

### `Nav.desktop.jsx`
- **役割**: PC 用ナビ（ロゴ・リンク・言語切替）。
### `Nav.{mobile,desktop}.module.css`
- **役割**: 各バージョンのスタイル。

---

## Hero (`src/components/Hero/`)

### `index.jsx`
- **役割**: `useIsMobile()` で `HeroDesktop` / `HeroMobile` を振り分け。

### `Hero.mobile.jsx`
- **役割**: モバイルのランディング。名前 "Iwai Shuto"・キャッチコピー、`requestAnimationFrame` で動く背景シェイプ、About/Skills/Projects/Blog への `#hash` リンク。
- **主要**: `HeroMobile()`、内部定数 `navItems`、`shapeRef`（アニメ用）
- **依存**: `Hero.mobile.module.css`

### `Hero.desktop.jsx`
- **役割**: PC のファーストビュー（アニメーション背景）。
### `Hero.{mobile,desktop}.module.css`
- **役割**: 各バージョンのスタイル。

---

## コンテンツ各セクション

いずれも `index.jsx`（`useIsMobile` 振り分け）+ `*.desktop.jsx` + `*.mobile.jsx` + 各 `.module.css`。
中身はハードコードされた表示専用コンポーネント。

### `src/components/About/`
- **役割**: 自己紹介・プロフィール（大学/学部/学年/GPA/居住地、実績、写真プレースホルダー）。

### `src/components/Skills/`
- **役割**: スキルカード（Frontend / Mobile / Language / Tools）。

### `src/components/Projects/`
- **役割**: 制作物カード 4 件（Wagamama Gourmet / フォトブース落書き App / BoardGames on iPhone / RealTimeNoting）。

### `src/components/Blog/`
- **役割**: ブログ記事一覧（現状ダミー記事）。

### `src/components/Contact/`
- **役割**: 連絡先（メール + SNS）。モバイルでは Hero フッター側にのみ表示する運用。

### `src/components/Footer/`
- **役割**: フッター。`App.jsx` で常時表示（PC/モバイル共通配置）。

---

## 静的アセット・設定

### `public/`
- `favicon.svg` / `icons.svg`（SNS アイコン等の SVG スプライト）

### `src/assets/`
- `hero.png`（Hero 用画像）, `react.svg` / `vite.svg`（テンプレート残骸）

### `index.html`
- **役割**: HTML テンプレート。`#root` と `main.jsx` の読み込み。

### `vite.config.js`
- **役割**: Vite 設定。`base` を dev は `/`、build 時のみ `/your-repo-name/`（GitHub Pages 用、要リポジトリ名置換）に条件分岐。

### `package.json`
- **役割**: 依存・スクリプト。`dev` / `build` / `lint` / `preview` / `deploy`(gh-pages)。`homepage` は要本番 URL 更新。

### `eslint.config.js`
- **役割**: ESLint 設定（react-hooks / react-refresh プラグイン）。
