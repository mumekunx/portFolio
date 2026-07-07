# detail.md — ファイル構成リファレンス

このプロジェクトの全ファイルについて「何があるか」を記載するリファレンス。
「なぜ・どう動くか」は teach.md、進捗ログは update.md、引き継ぎは baton.md を参照。

> 各セクションコンポーネントは **PC/モバイルの 2 ファイル + 振り分け index.jsx + 各 CSS Modules** という共通構成。
> 該当: `Nav / Hero / About / Experience / Projects / Blog / Contact / Footer`

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
- **役割**: ルートコンポーネント。PC/モバイル共通で `<Nav>` + `<main>` + `<Footer>` を描画する 1 ページ縦スクロール構成（以前はモバイルのみ `MobileRouter` による別ページ遷移だったが、PC と同じ構成に統一した）。
  - `<main>` の中身: `blogSlug` があれば `<BlogPost>`（`variant={isMobile ? 'mobile' : 'desktop'}`、`onBack` で一覧へ戻す）、無ければ `Hero → About → Experience → Projects → Blog → Contact` の順で全セクションを縦に並べる（旧 `Skills` セクションを廃止し `Experience` に差し替え済み）
  - 各セクションコンポーネント自身が内部で `useIsMobile()` によって desktop/mobile バリアントを出し分けるため、`App.jsx` 側は分岐不要
  - `BlogPost` は `lazy(() => import('./components/BlogPost'))` で遅延ロードし、`<Suspense fallback={<div className="routeLoading">Loading…</div>}>` でラップ（記事詳細を開いたときだけ該当チャンクを取得。初期バンドル削減のため。以前は `fallback={null}` で無反応だったが、UI/UX レビューでロード中の無反応が指摘され修正）
  - `<a href="#main" className="skip-link">本文へスキップ</a>` を `<Nav>` の直前に配置し、`<main>` に `id="main"` を付与（キーボード/スクリーンリーダー利用者向けのスキップリンク）
- **主要**: `App()`（default export）
- **依存**: 全セクションコンポーネント, `BlogPost`(lazy), `useMediaQuery` (`useIsMobile`、`BlogPost` の `variant` 判定用), `useHashRoute`（`blogSlug` / `navigate` を取得）, `./index.css`
- **参照元**: `main.jsx`

### `src/index.css`
- **役割**: グローバル CSS。カラー変数（`--sage` 緑 / `--clay` テラコッタ / `--sand` ベージュ背景 / `--clay-dark`(#7a4327、コントラスト用の濃色クレイ) / `--text-light`(#6b6b6b、コントラスト用に調整)）、アニメーション（`morph` / `float` / `fadeSlideUp`）、`.fade-in` / `.visible` / `.container` ユーティリティ、フォント設定。`@media (max-width: 768px)` で `.section` の上下パディングを詰める（旧・モバイル用の `body.home-locked`（ホームを `100svh` に固定しスクロール無効化）ルールは、モバイルを PC と同じ 1 ページスクロール構成に統一したのに伴い削除済み）。`@media (prefers-reduced-motion: reduce)` ブロックで、OS 側の設定に応じて全アニメーション/トランジションを実質無効化（`animation-duration`/`transition-duration` を `0.01ms` に、`.fade-in` は即表示）。UI/UX レビュー対応で追加: `a, button` に `touch-action: manipulation`（タップ時の遅延・ダブルタップズーム抑止）、`a:focus-visible, button:focus-visible` のフォーカスリング、`.skip-link`（通常は画面外、フォーカス時のみ表示されるスキップリンク）、`.routeLoading`（`BlogPost` の `Suspense fallback` 用のローディング表示）。
- **依存**: Google Fonts (DM Serif Display / DM Sans / Space Mono)
- **参照元**: `main.jsx`, `App.jsx`

---

## フック (`src/hooks/`)

### `useMediaQuery.js`
- **役割**: メディアクエリの一致状態を購読するフック。`useSyncExternalStore` ベースに実装（`useState` + `useEffect` での手動購読だと `react-hooks/set-state-in-effect` の lint エラーになるため書き換え）。
- **主要**:
  - `useMediaQuery(query)` — `useSyncExternalStore(subscribe, getSnapshot)` で `matchMedia(query).matches` を返す。`subscribe` は `mql.addEventListener('change', ...)` を購読/解除
  - `useIsMobile()` — `useMediaQuery('(max-width: 768px)')` のショートカット
- **参照元**: `App.jsx`, 全 `index.jsx`（PC/モバイル振り分け）

### `useHashRoute.js`
- **役割**: `window.location.hash` をルートとして購読・操作するフック（`#blog/<slug>` 記事詳細ルーティング、および Nav 等のアンカーリンク遷移に使用）。`blogSlug` の解析をここに一元化。
- **主要**: `useHashRoute()` → `{ hash, navigate(h), blogSlug }`
  - `hashchange` を購読
  - `blogSlug`: `hash` が `blog/` で始まる場合はその後続文字列、それ以外は `null`
  - `reset()` は旧 `MobileRouter` の「ホームに戻る」ボタンのみが使っていた関数で、モバイルを 1 ページスクロール構成に統一し `MobileRouter` を削除したのに伴い削除済み（他に使用箇所なし）
- **参照元**: `App.jsx`

### `useScrollReveal.js`
- **役割**: `.fade-in` 要素を `IntersectionObserver` で監視し、可視になったら `.visible` を付与（スクロール連動フェードイン）。
- **主要**: `useScrollReveal(selector = '.fade-in')`
- **参照元**: 各セクションコンポーネント（フェードイン演出を使うもの）

### `useInfiniteCarousel.js`
- **役割**: 「アイテムを3セット複製して並べ、中央セットを基準にスクロール位置をワープさせる無限ループカルーセル」の共通ロジック。元は `Projects.desktop.jsx` 専用の実装だったが、`Projects.mobile.jsx` でも同じ方式を使うことになったため抽出。
- **主要**: `useInfiniteCarousel(itemCount, gap = 32)` → `{ trackRef, scroll, activeIndex }`
  - `itemCount`: 複製前(1セットぶん)の件数。呼び出し側は `[...items, ...items, ...items]` を自前で作り `trackRef` を付けた要素の子として並べる
  - 初回マウント時・resize 時に中央セットの先頭カードへ `scrollTo({ behavior: 'instant' })` で位置合わせ
  - `scroll` イベント監視(`requestAnimationFrame` でスロットル)で中央セット範囲外に出たら同じ相対位置へ `scrollTo({ behavior: 'instant' })` でワープ
  - `scroll(dir)`: `dir` 方向(-1/1)へ1カードぶん `scrollBy({ behavior: 'smooth' })`(ナビボタンの `onClick` から呼ぶ)
  - `activeIndex`（UI/UX レビュー対応で追加）: 現在中央にあるカードの論理インデックス(0〜`itemCount`-1、中央セット基準の剰余)を `state` として保持。`scroll` イベントの同じ `requestAnimationFrame` コールバック内で `track.scrollLeft` から算出し直近値と異なる場合のみ更新。呼び出し側のドットインジケータ・`aria-live` 表示に使用
- **参照元**: `Projects.desktop.jsx`(`gap: 32`), `Projects.mobile.jsx`(`gap: 20`)

---

## ナビゲーション (`src/components/Nav/`)

### `index.jsx`
- **役割**: `useIsMobile()` で `NavDesktop` / `NavMobile` を振り分け。

### `Nav.mobile.jsx`
- **役割**: モバイル用ナビ。スクロールで `scrolled` 状態、バーガーメニュー（フルスクリーンオーバーレイ）、言語ドロップダウン（JP/EN・見た目のみ）、ロゴ。1 ページスクロール統一に伴い、`Nav.desktop.jsx` と同じ「スクロール位置に応じた背景色同期」を移植済み（各セクションの `getBoundingClientRect()` から現在位置の背景グラデ色を補間し、暗い背景では `dark` クラスでロゴ/リンク/バーガー/言語ボタンの文字色を明るく反転）。`computeColor`（背景色計算本体）は `scroll` イベントごとに毎回実行すると高頻度になるため、`requestAnimationFrame` でスロットル化済み（UI/UX レビュー対応。`Nav.desktop.jsx` と同様）。
- **ロゴのセクション見出し同期**: `sectionTitles`（hero→"About me"、about→"About Me"、experience→"Milestones"、projects→"Selected Works"、blog→"Recent Posts"、contact→"Let's Connect"）マップを追加。`computeColor` が背景色補間のために判定している現在セクション `activeId` を `setActiveSection` で state 化し、ロゴは `sectionTitles[activeSection] ?? 'About me'` を表示。`<span key={activeSection}>` で要素を差し替え、`Nav.mobile.module.css` の `logoFade`（opacity 200ms）でフェード切り替えする。色計算ロジック自体（`sectionColors`/`lerpColor`/`isDarkColor`）は不変。
- **主要 state**: `scrolled` / `navColor` / `activeSection` / `open` / `lang` / `langOpen`、内部定数 `links`（`#about` / `#experience` / `#projects` / `#blog` / `#contact`。旧 `#skills` は `Experience` セクション新設に伴い `#experience` にリネーム）/ `languages` / `sectionColors`（`Nav.desktop.jsx` と同じ値。旧 `skills` キーは `experience` にリネームしたのみで色自体は流用）/ `sectionOrder` / `sectionTitles`、関数 `lerp` / `lerpColor` / `isDarkColor`
- **a11y**: バーガーボタン・言語ドロップダウントリガーに `aria-expanded={open}` / `aria-expanded={langOpen}`。言語ドロップダウンは `Escape` キー押下で `setLangOpen(false)`。メニューリンクはクリックで `setOpen(false)`（メニューを閉じてから遷移）。
- **依存**: `Nav.mobile.module.css`

### `Nav.desktop.jsx`
- **役割**: PC 用ナビ（ロゴ・リンク・言語切替）。スクロール位置から現在セクションの背景グラデ色を補間して Nav 背景に反映する `sectionColors` / `computeColor` の仕組みを持つ（`Nav.mobile.jsx` に同ロジックを移植済み）。`scroll`/`resize` イベントは `scheduleComputeColor` 経由で `requestAnimationFrame` にまとめ、`computeColor` 本体は1フレームにつき最大1回だけ実行するようスロットル化済み（UI/UX レビュー対応）。`links` / `sectionColors` / `sectionOrder` / `sectionTitles` の `skills` エントリは、`Skills` セクション廃止・`Experience` セクション新設に伴い `experience` にリネーム済み（`Nav.mobile.jsx` と同様）。
- **ロゴのセクション見出し同期**: `Nav.mobile.jsx` と同じ `sectionTitles` マップと `activeSection` state による仕組みを持つ（実装内容は上記 `Nav.mobile.jsx` の項を参照）。
- **主要 state**: `scrolled` / `navColor` / `activeSection` / `open` / `lang` / `langOpen`、内部定数 `links` / `languages` / `sectionColors` / `sectionOrder` / `sectionTitles`、関数 `lerp` / `lerpColor` / `isDarkColor`
- **a11y**: `Nav.mobile.jsx` と同様に `aria-expanded`（バーガー/言語トリガー）と `Escape` での言語ドロップダウン閉じ処理あり。`isDarkColor` 判定のコメント誤りを修正済み。
- **リンク位置のロゴ幅非依存化(2026-07-07)**: DOM 構造(`.logo` → `.menuOverlay`(`display:contents`)配下の `.links` → `.langWrap` → `.burger`)自体は変更していない。JSX は無変更、CSS のみで対応(詳細は下記 `.module.css` の項)。
### `Nav.{mobile,desktop}.module.css`
- **役割**: 各バージョンのスタイル。`.scrolled` は `var(--nav-bg)`（JS から設定）を背景に使用し、`.dark` クラスでロゴ/リンク/バーガー/言語ボタンの文字色を明るい色に切り替える（両バージョン共通の仕組み）。`.logo` はセクション見出し同期でテキスト長が変化するため `white-space: nowrap` / `overflow: hidden` / `text-overflow: ellipsis` / `max-width`（desktop: 40vw, mobile: 54vw）を設定してレイアウト崩れを防止。モバイルは長い見出しが収まるよう `.logo` の `font-size` を 1.5rem → 1.15rem に縮小。`.logoText` に `logoFade`（opacity 0→1, 200ms ease）の `@keyframes` を適用し、`key={activeSection}` による要素差し替え時に軽くフェードする。
- **`Nav.desktop.module.css` の `.inner` レイアウト(2026-07-07 変更)**: 従来は `display:flex; justify-content:space-between` + `.logo{margin-right:48px}` + `.langWrap{margin-left:auto}` で、ロゴのテキスト幅(`.logoText` がセクション見出しに同期して変わる)がそのままリンク群の開始位置をずらす原因になっていた(「About Me」の短いロゴと「Selected Works」の長いロゴでリンクの x 座標が変わる不具合)。`.inner` を `display:grid; grid-template-columns:1fr auto 1fr; column-gap:24px` の3ゾーン構成に変更し、`.logo{grid-column:1; justify-self:start}` / `.links{grid-column:2; justify-self:center}` / `.langWrap{grid-column:3; justify-self:end}` を明示指定。中央カラムは `auto`(リンク群の内容幅のみ)なので、左右の `1fr` が余白を均等吸収し、ロゴ幅に関わらずリンク群は常にナビ中央に固定される。`.menuOverlay{display:contents}` はそのままのため `.links`(ul)が実際の grid item になる点に注意。`.burger` は desktop では常に `display:none`(モバイル判定は `Nav/index.jsx` の `useIsMobile()` によるコンポーネント切替で、CSS メディアクエリではない)ため grid には参加せず影響なし。`Nav.mobile.module.css` は今回変更なし(モバイルは flex レイアウトのまま現状維持)。

---

## Hero (`src/components/Hero/`)

### `index.jsx`
- **役割**: `useIsMobile()` で `HeroDesktop` / `HeroMobile` を振り分け。

### `Hero.mobile.jsx`
- **役割**: 1 ページスクロールの先頭セクション。名前 "Iwai Shuto"・キャッチコピー、背景シェイプ2枚（CSS アニメーションのみ、JS 側の駆動なし）、中央の破線アバター枠。旧ランディングページ由来の About/Skills/Projects/Blog への `#hash` リンク一覧はナビのハンバーガーメニューと重複するため削除済み（Nav.mobile 側に同等の導線あり）。
- **主要**: `HeroMobile()`
- **依存**: `Hero.mobile.module.css`

### `Hero.desktop.jsx`
- **役割**: PC のファーストビュー（背景シェイプ2枚、CSS アニメーションのみ）。
### `Hero.{mobile,desktop}.module.css`
- **役割**: 各バージョンのスタイル。背景シェイプに `morph`（形状変化）と `drift`（±15px/±12px・20秒ループの浮遊移動）を併用。以前は `requestAnimationFrame` で JS 側から動かしていたが、CSS `@keyframes drift` に置き換えて JS 常時実行をなくした（`prefers-reduced-motion` にも自動追従）。`.hero` の背景は両バージョンとも `linear-gradient(to bottom, #f7f3ee 0%, #dfe9e6 100%)`（以降 About〜Contact へと続くグラデ進行の起点。`Hero.mobile` は元々背景指定なしだったが、1 ページスクロール化に伴い desktop と同じグラデを追加）。

---

## コンテンツ各セクション

いずれも `index.jsx`（`useIsMobile` 振り分け）+ `*.desktop.jsx` + `*.mobile.jsx` + 各 `.module.css`。
中身はハードコードされた表示専用コンポーネント。

### `src/components/About/`
- **役割**: 自己紹介・プロフィール（大学/学部/学年/GPA/居住地、Tech Stack バッジ、本人写真）。表示データは `src/data/about.jsx` の `facts` を desktop/mobile 両方から import（ハードコード撤廃）。
- **写真**: `About.desktop.jsx` / `About.mobile.jsx` で `src/assets/about-photo.jpg` を `import aboutPhoto from '../../assets/about-photo.jpg'` として読み込み、`.photoInner` 内に `<img src={aboutPhoto} className={styles.photo} loading="lazy" />` で表示（NVIDIA GTC 会場前で撮影）。`.photo` は `width/height: 100%; object-fit: cover;` で `.photoInner`（aspect-ratio 4/3）にフィットさせる。旧プレースホルダーの `.photoText` スタイルは削除済み。写真ファイルは品質50で再圧縮済み（448KB → 235KB、解像度 1600×1200 は不変）。
- **Tech Stack バッジ**（`Skills` セクション廃止・`Experience`（縦タイムライン）新設に伴い追加。旧・実績カードリスト（自治会委員長/CYPR/生駒祭）はタイムラインへ集約したため About から削除）: `src/data/skills.jsx` の `categories` を import し、`const techStack = [...new Set(categories.flatMap(({ items }) => items))]` で全カテゴリの技術名をフラット化・重複除去（15項目）。facts リストの下に `.skillsLabel`（"Tech Stack"）+ `.skillList`（`<ul>`）→ 各 `.skillBadge`（`<li>`、コンパクトな角丸バッジ）として表示。`categories[].icon`（SVG）はここでは使用しない（テキストのみ）。
- **旧実装との差分**: 旧 `achievements`（`src/data/about.jsx` の `achievements` export・`.achievement`/`.achieveIcon`/`.achieveBody`/`.achieveTitle`/`.achieveBadge`/`.achieveSub` 一式）は削除・置換済みだが、`src/data/about.jsx` 側の `achievements` export 自体は残っており、参照元が無くなったため未使用（未整理として残置）。
- **背景**: `.about` は desktop/mobile 共通で `linear-gradient(to bottom, #dfe9e6 0%, #b9d2d3 100%)`（Hero の終端色から連続。mobile は元々単色 `var(--white)` だったが 1 ページスクロール化に伴い desktop と揃えた）。

### `src/components/Experience/`
- **役割**: 参加イベント・実績を新しい順の縦タイムラインで表示するセクション（`id="experience"`、大見出し "Milestones"）。旧 `Skills`（What I Work With、スキルカード）セクションを廃止して新設・置き換え。表示データは `src/data/experience.js` の `experience` を desktop/mobile 両方から import。年フィルターチップ + 固定高さのスクロール枠を備える。
- **主要**（`Experience.desktop.jsx` / `Experience.mobile.jsx` はほぼ同一構造、`.module.css` のみサイズ差）:
  - **年フィルター**: `years`（`[...new Set(experience.map(e => e.date.slice(0,4)))].sort((a,b) => b.localeCompare(a))`、降順）を `useMemo` で算出。`selectedYear`（`useState('all')`）で選択年を保持し、`filtered`（`useMemo`、`selectedYear==='all'` なら `experience` そのまま、それ以外は年一致でフィルタ）を描画対象にする。見出しとタイムラインの間に `role="group" aria-label="Filter by year"` のチップ行（"All" + 各年、実 `<button type="button" aria-pressed={...}>`）を配置。活性/非活性のスタイルは `aria-pressed` 属性セレクタ（`.chip[aria-pressed="true"]`）で切り替え、冗長な data 属性は使わない。
  - **スクロール枠**: `<ul className={styles.timeline}>` を `.scrollArea` 付き `<div ref={scrollRef} tabIndex={0} role="group" aria-label="Milestones timeline">` でラップ。`selectedYear` が変わるたび `useEffect` で `scrollRef.current.scrollTop = 0` にリセットしフィルタ切替時に古いスクロール位置が残らないようにする。`filtered.length === 0` のときは `<ul>` の代わりに `.empty`（"該当なし"）を表示するガードあり。
  - **各項目**: `<li className={styles.item}>`（`fade-in`/`fade-in-delay-*` は撤去済み — 固定高さのオーバーフロー容器内では IntersectionObserver ベースの reveal が機能しないため、常時表示に変更）。左に `.rail`（`aria-hidden="true"`）+ `.dot`（`.timeline::before` の縦の接続ラインに重なるドット）、右に `.card`（`.meta` 内に `<time dateTime={item.date}>` の日付・`item.tag` があれば `.tag` ピル・`item.inProgress` があれば "In Progress" の `.badge`、続けて `.title` / `.description`）。
  - `useScrollReveal()` の呼び出し自体は残置（`.fade-in` 要素が無いため実質何もしないが、他コンポーネントとの一貫性のため撤去しない）。
  - `<ul>` には `key={selectedYear}` + `.timelineFade`（200ms opacity 0→1 の `@keyframes`）を付与し、フィルタ切替のたびに再マウントされて軽いフェード演出が入る（任意の演出、必須ではない）。
- **CSS**（`.scrollArea`）: `overflow-y: auto` / `touch-action: pan-y`（ページ縦スクロールと共存） / `overscroll-behavior: contain`。`max-height` は desktop `min(58vh, 520px)` / mobile `62vh`。上下フェードは `mask-image`/`-webkit-mask-image` の線形グラデーションで実現（desktop 24px・mobile 20px でフェード）。`::-webkit-scrollbar` は幅6px・track透明・thumb `var(--sage)` 角丸3px（サイト共通のスクロールバー見た目を踏襲、track は sand ではなく透明 — 背景が色付きグラデーションのため）。
- **チップスタイル**: font-mono、pill型（`border-radius: 99px`）。非活性は半透明白地に `color: var(--dark)`（同ファイルの `.tag` と同じコントラスト設計を流用、AA達成済み）。活性（`aria-pressed="true"`）は `background: var(--dark)` / `color: var(--sand)`（高コントラスト）。hover でわずかに背景を変化、`transition: var(--transition)`。フォーカスリングはグローバルの `:focus-visible`（`index.css`）に委譲、独自の outline は追加しない。
- **背景**: `.experience` は desktop/mobile 共通で `linear-gradient(to bottom, #b9d2d3 0%, #7ba7b5 100%)`（旧 `Skills` の背景グラデーションをそのまま流用。About の終端色から連続、Nav の `sectionColors.experience` も同じ値）。
- **依存**: `src/data/experience.js`, `hooks/useScrollReveal`
- `index.jsx`: `useIsMobile()` で `ExperienceDesktop` / `ExperienceMobile` を振り分け（他セクションと同じ共通パターン）。

### `src/components/Projects/`
- **役割**: 制作物カード 4 件（Wagamama Gourmet / フォトブース落書き App / BoardGames on iPhone / RealTimeNoting）。表示データは `src/data/projects.js` の `projects` を desktop/mobile 両方から import。
- **主要（`Projects.desktop.jsx` / `Projects.mobile.jsx` 共通）**: どちらも 3セット（`[...projects, ...projects, ...projects]` = `loopedProjects`）を並べ、中央セットを基準にスクロール位置をワープさせる無限ループカルーセル(共通ロジックは `src/hooks/useInfiniteCarousel.js` に抽出、後述)。前後の複製セット（`isDuplicate = i < projects.length || i >= projects.length * 2`）のカードには `aria-hidden="true"`、内部リンクには `tabIndex={-1}` を付与し、スクリーンリーダー/キーボード操作が複製カードに触れないようにしている。
  - **desktop**: カード幅固定 480px、← →ボタンはカルーセル左右端に絶対配置、`.track` は `overflow-x: auto`(指/トラックパッドでのドラッグスクロール可)。
  - **mobile**: カード幅 `92vw`(`max-width: 480px`)の1画面1カード表示(当初は 85vw + 左右チラ見え + 端フェードマスクだったが、実機で本文が窮屈だったため拡大しマスクも削除)。`.body` の padding は 20px(desktop の 28px より詰めて本文の実効幅を確保)。`.track` は `overflow-x: hidden` + `touch-action: pan-y` にして**指の横スワイプでは動かない**ようにし(iOS Safari の端スワイプ「戻る」ジェスチャーとの衝突回避)、← →ボタン(48×48px)のみで送る。ボタンからの `scrollTo`/`scrollBy` は `overflow: hidden` でもプログラム的に機能するため操作は可能。
  - **ドットインジケータ**(UI/UX レビュー対応で追加): `useInfiniteCarousel` が返す `activeIndex` を使い、カルーセル下に `aria-hidden="true"` のドット表示(`.dot`/`.dotActive` でサイズ・色を区別)と、スクリーンリーダー向けに `sr-only` の `<p aria-live="polite">{`プロジェクト ${activeIndex + 1} / ${projects.length}`}</p>` を追加。
  - **コントラスト修正**(UI/UX レビュー対応): 背景 `#7ba7b5` 上では白系の文字色が物理的にコントラスト比 4.5 を満たせないため、見出し・`.section-label`・タグ・バッジ・サムネラベル・カルーセルのナビ矢印ボタンを濃色系の文字色に変更。tag/badge/techBadge/thumbLabel の極小フォントも `0.75rem` に引き上げ。
- **背景**: `.projects` は desktop/mobile 共通で `linear-gradient(to bottom, #7ba7b5 0%, #4a7795 100%)`（暗色化していくため「深海レイヤー」として `.projects :global(.section-title)` / `.projects :global(.section-label)` を上書き。カード本体は `.body` が不透明な白背景のため影響なし）。

### `src/components/Blog/`
- **役割**: ブログ記事一覧セクション。`src/lib/posts.js` から取得した記事メタデータをカード表示。記事が0件のときは `Coming soon...` を表示。記事カードのリンクは `#blog/<slug>` で詳細ページへ遷移。
- **主要ファイル**:
  - `Blog.desktop.jsx` / `Blog.mobile.jsx`: posts 配列を map してカード描画。0件時は `.comingSoon` 表示
  - `Blog.desktop.module.css` / `Blog.mobile.module.css`: `.blog` / `.header` / `.list` / `.postLink` / `.postMeta` / `.date` / `.postTag` / `.postTitle` / `.postExcerpt` / `.readMore` / `.comingSoon`
- **依存**: `lib/posts.js`, `hooks/useScrollReveal`
- **背景**: `.blog` は desktop/mobile 共通で `linear-gradient(to bottom, #4a7795 0%, #243f5e 100%)`（暗色寄りのため「深海レイヤー」として見出しと記事一覧の文字色（`.postTitle` / `.postExcerpt` / `.date` / `.comingSoonText`、`.postLink` / `.comingSoon` の境界線）を明るい色に上書き。`.postTag` は不透明な白ピルのため対象外）。コントラスト修正（UI/UX レビュー対応）: `.date`/`.postExcerpt` は `rgba(255,255,255,0.95)`（比 4.52）、`.postTitle` は `#f6f9fb`、`.readMore`（hover 時の `.postTitle` も含む）は `#fffae1`（比 4.59）。

### `src/components/BlogPost/`
- **役割**: ブログ記事の詳細ページ。`#blog/<slug>` で表示される。`react-markdown` で本文をHTMLレンダリング、コードブロックは `rehype-highlight`（github-dark テーマ）でハイライト。
- **主要ファイル**:
  - `BlogPost.jsx`: `getPost(slug)` で記事取得、`<ReactMarkdown>` で本文描画。`variant="desktop"|"mobile"` で見た目調整、戻るボタン「← Blog 一覧へ」は `onBack` が渡されていれば表示（以前は `variant === 'desktop'` のときだけ表示していたが、mobile も 1 ページスクロール構成の `App.jsx` から `onBack` を受け取るようになったため条件を変更）。マウント中は `document.title` を記事タイトルに書き換え、アンマウント時（`useEffect` のクリーンアップ）に元のタイトルへ復元
  - `BlogPost.module.css`: 記事ヘッダ、本文（h1-h4, p, ul/ol, code, pre, blockquote, table, img）の全タイポグラフィ。`.article.mobile { padding-top: 24px; }`（旧 `MobileRouter` の `.page` ラッパーが確保していた Nav ぶんの余白を前提にした上書き）は、`MobileRouter` 削除に伴い削除済み — 削除しないと固定 Nav の下に戻るボタンが隠れてしまうため
  - `index.js`: default export 再エクスポート
- **依存**: `react-markdown`, `remark-gfm`, `rehype-highlight`, `highlight.js/styles/github-dark.css`, `lib/posts.js`
- **参照元**: `App.jsx`（PC/モバイル共通、`React.lazy` で遅延ロード）

### `src/components/Contact/`
- **役割**: 連絡先（メール + SNS）。1 ページスクロールの最終セクションとして常に表示（以前はモバイルのみ Hero フッター側にも同内容が重複表示される想定のコードがあったが、実際には旧 `body.home-locked` によりフッター自体が非表示になっていたため到達しない死んだ分岐だった。後述の `Footer.mobile.jsx` 参照）。SNS リンク・アイコンは `src/data/socials.jsx` の `socials` を desktop/mobile 両方から import。
- **背景**: `.contact` は desktop/mobile 共通で `linear-gradient(to bottom, #243f5e 0%, #0d1c2e 100%)`（Blog の終端色から連続。mobile は元々 `var(--dark)`（#2a2a2a、グレー寄り）だったため desktop の紺色グラデに揃えた）。`.sub`（サブ文）は `rgba(255,255,255,0.7)`（比 6.19、UI/UX レビュー対応で確認済み）。

### `src/components/Footer/`
- **役割**: フッター。`App.jsx` で常時表示（PC/モバイル共通配置）。
- **`Footer.mobile.jsx` の修正**: 旧実装は `useHashRoute` の `hash` を見て `isHome`（hash が空 or `hero`）のときだけ、メール + SNS リンクの複製ブロックを表示する分岐を持っていた。しかし旧 `MobileRouter` 構成では `isHome` の間 `body.home-locked` により `footer` 自体が `display: none` になっていたため、この分岐は実質一度も描画されない死んだコードだった。`MobileRouter`/`home-locked` を削除して常時表示のフッターに統一したことでこの分岐が実際に有効化されてしまい、初回ロード時など hash が空のときに Contact セクションと内容が重複表示される不具合になり得たため、`Footer.desktop.jsx` と同様のシンプルな著作権表記のみに変更（`isHome` 分岐・`useHashRoute` 依存・未使用になった `socials` 定数と関連 CSS クラスを削除）。
- **背景**: `.footer` は desktop/mobile 共通で `#0d1c2e`（Contact の終端色と一致。mobile は元々 `var(--dark)`（#2a2a2a）で desktop と色味が違い継ぎ目が生じていたため揃えた）。

---

## データ (`src/data/`)

各セクションの desktop/mobile 両コンポーネントが共通で import する表示データ。従来は各コンポーネントにハードコードされていたが（食い違いは無かったことを確認のうえ）ここに一元化した。

### `projects.js`
- **役割**: Projects セクションのカードデータ。
- **主要**: `projects`: `{ id, tag, title, description, tech[], github, demo, accent, inProgress }[]`
- **参照元**: `Projects.desktop.jsx`, `Projects.mobile.jsx`

### `experience.js`
- **役割**: Experience セクション（縦タイムライン）の参加イベント・実績データ。新しい順（先頭が最新）に並べる規約。日付はファイル先頭コメントで「暫定・ユーザーが確定/追加する」と明記。
- **主要**: `experience`: `{ date, title, description, tag?, inProgress? }[]`（`date` は `YYYY.MM` または `YYYY` 形式の文字列、そのまま `<time dateTime>` にも使用）
- **初期データ**: 2026.04 自治会委員長就任(進行中) / 2026 CYPR立ち上げ(進行中) / 2026.02 KC3HACKハッカソン参加 / 2025.11 生駒祭でアプリ実運用 / 2025.03 NVIDIA GTC参加
- **参照元**: `Experience.desktop.jsx`, `Experience.mobile.jsx`

### `socials.jsx`
- **役割**: Contact セクションの SNS リンク・アイコン（`.jsx` 拡張子は JSX の SVG アイコンを含むため）。
- **主要**: `socials`: `{ name, url, icon(JSX) }[]`（GitHub / Twitter・X / Instagram / Zenn）。SNS URL は TODO コメントあり（実際のリンクへの差し替え待ち）
- **参照元**: `Contact.desktop.jsx`, `Contact.mobile.jsx`

### `skills.jsx`
- **役割**: 技術スタックのカテゴリ別一覧。元々は `Skills` セクション専用データだったが、`Skills` セクション廃止（`Experience` タイムラインへ置換）に伴い、現在は `About` の Tech Stack バッジ列（`categories` を `items` だけフラット化して使用、`icon` は不使用）から参照される唯一のデータ元。`.jsx` 拡張子は `icon` に Lucide 由来のインライン SVG(JSX)を含むため（旧 `skills.js` の絵文字アイコンから置換した際にリネーム。UI/UX レビュー対応）。
- **主要**: `categories`: `{ icon(JSX), title, color, items[] }[]`（Frontend/Web, Mobile/App, Language, Tools）。`icon`/`title`/`color` は現状 About からは参照されず未使用（`items` のみ利用）。
- **参照元**: `About.desktop.jsx`, `About.mobile.jsx`（旧参照元だった `Skills.desktop.jsx` / `Skills.mobile.jsx` はセクション削除に伴い消滅）

### `about.jsx`
- **役割**: About セクションのプロフィール事実。`.jsx` 拡張子は元々 `achievements[].icon` に Lucide 由来のインライン SVG(JSX)を含んでいたため（旧 `about.js` の絵文字アイコンから置換した際にリネーム。UI/UX レビュー対応）だが、`achievements` は `Experience` タイムライン新設に伴い About から参照されなくなり、現在は未使用の export として残置（既知の未整理事項）。
- **主要**:
  - `facts`: `{ label, value }[]`（University/Faculty/Year/GPA/Location）— 唯一使用されているデータ
  - `achievements`: `{ icon(JSX), title, sub, inProgress? }[]` — **未使用**（旧 About の実績カードリスト用データ。現在は参照元なし）
- **参照元**: `About.desktop.jsx`, `About.mobile.jsx`（`facts` のみ import）

---

## 静的アセット・設定

### `public/`
- `favicon.svg` / `icons.svg`（SNS アイコン等の SVG スプライト）

### `src/assets/`
- `hero.png`（Hero 用画像）, `about-photo.jpg`（About セクションの本人写真、1600×1200・4:3・NVIDIA GTC 会場前で撮影）, `react.svg` / `vite.svg`（テンプレート残骸）

### `index.html`
- **役割**: HTML テンプレート。`#root` と `main.jsx` の読み込み。`<title>Iwai Shuto | Portfolio</title>`、meta description、OGP（`og:title`/`og:description`/`og:type`/`og:url`(独自ドメイン `https://shutoiwai.cypr.jp/`)等、`og:image` は画像未確定のため TODO）、`twitter:card` を設定済み。

### `vite.config.js`
- **役割**: Vite 設定。`base` は Cloudflare 独自ドメイン(ルート)配信のため常に `/`(GitHub Pages 用の `/portFolio/` 分岐は廃止)。

### `package.json`
- **役割**: 依存・スクリプト。`dev` / `build` / `lint` / `preview` / `deploy`(gh-pages)。`homepage` は独自ドメイン `https://shutoiwai.cypr.jp/`(旧 GitHub Pages URL から更新済み)。`gh-pages` はビルド成果物には含まれないため `dependencies` から `devDependencies` へ移動済み。

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
