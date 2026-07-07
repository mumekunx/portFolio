# Portfolio プロジェクト概要
## 2026-07-07 09:55 — Skills セクションを Experience(参加イベント縦タイムライン)に置き換え

**立案:**
- 依頼: Skills(What I Work With)セクションを廃止し、参加イベントの履歴を縦タイムラインで表示する「Experience」セクションに置き換える。使える技術スタックは About にコンパクトなバッジ列として小さく残す(ユーザー選択済み)。
- 計画(2エージェント並列):
  - A: `src/components/Experience/`(新規、desktop/mobile/index/CSS)と `src/data/experience.js`(新規、参加イベントの縦タイムライン)を作成。`App.jsx` で Skills→Experience に差し替え。Nav の links/sectionColors/sectionOrder/sectionTitles を skills→experience にリネーム(ラベル「Experience」、大見出し「Milestones」)。`src/components/Skills/` を削除。既存のグラデーション(skills スロット #b9d2d3→#7ba7b5)とロゴ同期は維持。
  - B: About(desktop/mobile)に技術スタックのコンパクトなバッジ列を追加(`src/data/skills.jsx` から)。重複する About の実績リスト(自治会委員長・CYPR・生駒祭)はタイムラインへ集約するため About から削除。
- タイムライン初期データは既知イベントの下書き(日付暫定): 2026.04 自治会委員長就任, CYPR立ち上げ(進行中), 2026.02 KC3HACK, 2025.11 生駒祭, 2025.03 NVIDIA GTC。
- 影響範囲: `src/components/Experience`(新)/`src/components/Skills`(削除)/`src/components/Nav`/`src/components/About`、`src/App.jsx`、`src/data/experience.js`(新)。
- ブランチ: `feature/20260707-0955-experience-timeline`

**完了** ✅
- `src/components/Experience/`(新規): `Experience.desktop.jsx` / `Experience.mobile.jsx` / `index.jsx`(`useIsMobile` 振り分け) / 各 `.module.css`。`src/data/experience.js` の `experience` 配列(`date`/`title`/`description`/`tag`(任意)/`inProgress`(任意)、新しい順)を `<ul className={styles.timeline}>` で縦タイムライン表示。各項目は左に接続ライン+ドット(`.rail`/`.dot`)、右にカード(`.card`、日付・タグ・In Progress バッジ・タイトル・説明)。`fade-in fade-in-delay-{1〜4}` でスクロール連動フェードイン(`useScrollReveal`)。背景は旧 Skills と同じグラデーション(`#b9d2d3 → #7ba7b5`)を流用。
- `src/data/experience.js`(新規): 参加イベント5件(自治会委員長就任・CYPR立ち上げ・KC3HACK・生駒祭・NVIDIA GTC)。日付はコメントで「暫定、ユーザーが確定・追加する」と明記。
- `src/components/Skills/`(5ファイル)を削除。
- `src/App.jsx`: `Skills` の import・JSX を `Experience` に差し替え(セクション順は About→Experience→Projects→Blog→Contact のまま維持)。
- `Nav.desktop.jsx` / `Nav.mobile.jsx`: `links` の `#skills`→`#experience`(ラベル "Experience")、`sectionColors`/`sectionOrder` の `skills`→`experience`(色は従来の skills スロットをそのまま流用)、`sectionTitles.skills`("What I Work With")→`sectionTitles.experience`("Milestones"、Experience の大見出しと一致)。
- `About.desktop.jsx` / `About.mobile.jsx`: `src/data/about.jsx` の `achievements` import・表示リストを削除し、`src/data/skills.jsx` の `categories` をフラット化した `techStack`(`[...new Set(categories.flatMap(({ items }) => items))]`、15項目・重複除去)を facts の下に "Tech Stack" ラベル付きバッジ列(`.skillBadge`)として追加。CSS も `.achievements`/`.achievement`/`.achieveIcon`/`.achieveBody`/`.achieveTitle`/`.achieveBadge`/`.achieveSub` を `.skills`/`.skillsLabel`/`.skillList`/`.skillBadge` に置換(desktop/mobile 両方)。
- **既知の未整理**(今回は放置、ユーザー承認済み): `src/data/about.jsx` の `achievements` export が参照元なしに(未使用)。`src/data/skills.jsx` の SVG アイコン(`categories[].icon`)は Skills 削除後も About から `categories` は import されているが `icon` フィールド自体は About 側で使っていないため実質未使用。
- 検証: `npm run lint` 0件、`npm run build` 成功。ヘッドレスブラウザで desktop/mobile 双方、Experience セクションの表示・Nav リンク/ロゴ同期・About の Tech Stack バッジを目視確認済み。

## 2026-07-06 14:58 — ナビロゴをスクロール位置の見出しに同期
**立案:**
- 依頼: 左上ナビのロゴを、スクロール位置に応じて現在表示中セクションの大見出しに切り替える(常に固定テキストではなく、hero→"About me"、about→"About Me"、skills→"What I Work With"、projects→"Selected Works"、blog→"Recent Posts"、contact→"Let's Connect" のように動的表示)。
- 実装方針: 既存の `computeColor`(背景色同期用・`requestAnimationFrame` スロットル済み)がセクション判定のために求めている `activeId` を state 化して再利用し、色計算ロジック自体は変更しない。ロゴ切り替え時は軽いフェードで違和感を減らす。ロゴ文字数が見出しごとに変わるため、レイアウト崩れ対策(省略・最大幅)も合わせて行う。
- 影響範囲: `src/components/Nav/Nav.desktop.jsx`, `src/components/Nav/Nav.mobile.jsx`, `src/components/Nav/Nav.desktop.module.css`, `src/components/Nav/Nav.mobile.module.css`, `update.md`, `detail.md`, `tasks/todo.md`
- ブランチ: `feature/20260706-1458-nav-logo-sync`

**完了** ✅
- `Nav.desktop.jsx` / `Nav.mobile.jsx` に `sectionTitles` マップ(hero/about/skills/projects/blog/contact → 各セクションの実見出しテキスト)を追加。実際の各コンポーネントの大見出しと一致することを確認済み。
- 既存の `computeColor` 内で求めていた `activeId` を `setActiveSection` で state (`activeSection`) に保存。色計算(`sectionColors`/`lerpColor`/`isDarkColor`)のロジックは変更なし。
- ロゴ表示は `sectionTitles[activeSection] ?? 'About me'`。`<span key={activeSection}>` で要素を差し替え、CSS の `logoFade` キーフレーム(opacity 200ms)で切り替え時にフェードする(`prefers-reduced-motion` はグローバル対応により自動的に無効化される)。
- CSS: `.logo` に `white-space: nowrap` / `overflow: hidden` / `text-overflow: ellipsis` / `max-width`(desktop 40vw, mobile 54vw)を追加して長い見出しでもレイアウトが崩れないようにした。モバイルの `.logo` font-size を 1.5rem → 1.15rem に縮小(長い見出しの収まり対策)。
- 検証: `npm run lint` 0件、`npm run build` 成功。ヘッドレスブラウザで desktop/mobile 双方、全6セクションのロゴ表示を目視確認(モバイルでも長い見出しが崩れず収まることを確認)。

## 2026-07-05 03:11 — UI/UXレビュー指摘の一括修正
**立案:**
- 依頼: ui-ux-pro-max スキルによるサイト全体レビューで判明した問題の修正(ユーザー承認済み)
- 主な指摘:
  1. 色コントラスト不足(セクションラベルのクレイ色 1.93、Projects見出し 2.29、Blog本文 2.83 など WCAG AA 未達多数)
  2. Suspense fallback が null で記事ロード中無反応
  3. 12px未満の極小フォント
  4. 絵文字アイコン
  5. touch-action未設定
  6. App.css が未importの死にファイル
  7. カルーセルに位置インジケータなし
  8. スキップリンクなし
  9. Navスクロールハンドラ未スロットル
- 計画: 4エージェント並列(A: グローバルCSS/App シェル、B: Projects カルーセル、C: Blog/Contact/About/Skills のコントラストと SVG アイコン化、D: Nav スロットルと画像最適化)
- ブランチ: feature/20260705-0311-uiux-review-fixes

**進捗/完了** ✅
- **コントラスト修正(WCAG AA 達成)**: `--clay-dark`(#7a4327)を新設し `.section-label` に適用(skills 背景 #b9d2d3 上で比 4.97)。`--text-light` を #6b6b6b に変更(比 4.82)。Projects の見出し・ラベル・タグ・バッジ・サムネラベル・ナビ矢印は、背景 #7ba7b5 上で白系では物理的に 4.5 を満たせないため濃色系に変更。Blog の日付/抜粋は白 95%(比 4.52)、`.postTitle` は #f6f9fb、`.readMore`/hover は #fffae1(比 4.59)。Contact のサブ文は白 70%(比 6.19)。
- `src/App.css`(未 import の死にファイル)を削除。`src/index.css` に `:focus-visible` スタイル、`touch-action: manipulation`、スキップリンク(`.skip-link`)、ルートローディング(`.routeLoading`)を追加。`App.jsx` に本文へのスキップリンクと `Suspense` フォールバック(`<div className="routeLoading">Loading…</div>`)、`<main>` に `id="main"` を付与。
- 極小フォント引き上げ: Footer 0.7/0.72rem → 0.75rem、Projects の tag/badge/techBadge/thumbLabel → 0.75rem、Nav の `.caret` → 0.75rem。
- 絵文字→SVGアイコン: `src/data/skills.js` → `skills.jsx`、`about.js` → `about.jsx` にリネームし、Lucide 由来のインライン SVG(monitor/smartphone/code/wrench、landmark/rocket/party-popper 相当)に置換。Skills/About 側は `<span aria-hidden="true">{icon}</span>` でラップし、CSS 側でアイコンサイズ・色を調整。
- カルーセルのドットインジケータ: `useInfiniteCarousel` が `activeIndex`(現在中央の論理インデックス)も返すよう拡張。Projects desktop/mobile に `aria-hidden` なドット表示(サイズ+色でアクティブ区別)+ `sr-only` の `aria-live="polite"`「プロジェクト n / 4」を追加。
- Nav の `computeColor` を `requestAnimationFrame` でスロットル化(desktop/mobile 両方)。
- `about-photo.jpg` を品質50で再圧縮(448KB → 235KB、解像度は 1600×1200 のまま不変)。
- 検証: `npm run lint` / `npm run build` 成功。
- **追記(スマホ実機確認後の追加修正)**: ① モバイルのナビボタンを下部 `.navRow` から desktop 同様の左右絶対配置(縦中央・48px 維持)に変更し、`.card` を 92vw/480px → 80vw/420px に縮小してボタンの居場所を確保。② 「フォトブース落書き App」カード(github/demo とも null でリンク行が無く本文が短い)の下部に背景が透けていた問題を、mobile の `.body { flex: 1 }` で白背景を下端まで伸ばして修正(desktop は既に flex:1 で問題なし)。ヘッドレス Chromium のスクリーンショットで両修正を目視確認、eslint / build 成功。

## 2026-07-05 02:50 — スマホ版 Projects を PC と同じカルーセルに変更
**立案:**
- 依頼内容: スマホ版 Projects セクション(現状はただの縦積みグリッド)を、PC 版(`Projects.desktop.jsx`)と同じ「3セット複製の無限ループカルーセル・中央1枚が主役+左右チラ見え・← →ボタンで送る」表示に変更する。ただし操作は**ボタンのみ**にし、横スワイプでは動かないようにする(iOS Safari の端スワイプ「戻る」ジェスチャーと衝突し誤操作になるため)。
- 実装方針:
  1. PC 版のカルーセルロジック(3セット複製、中央セットへの初期位置合わせ、セット外に出たら同位置へワープ、`scroll(dir)` によるボタン送り)を `src/hooks/useInfiniteCarousel.js` に共通フックとして抽出し、`Projects.desktop.jsx` はこのフックを使うようリファクタ(挙動は変えない)。
  2. `Projects.mobile.jsx` を同じ 3 セット複製カルーセル構造(`aria-hidden`/`tabIndex=-1` の複製マーキングも同様)に書き換え、上記フックを利用する。データは既存どおり `src/data/projects.js` から import。
  3. `Projects.mobile.module.css`: カード幅を `85vw`(`max-width` あり)にして中央主役+左右チラ見えを表現。トラックは `overflow-x: hidden` + `touch-action: pan-y` にして指の横スワイプでは動かないようにし、← →ボタン(48px、タップしやすいサイズ)をカルーセル下に配置してボタン操作のみ有効にする。
- 影響範囲: `src/hooks/useInfiniteCarousel.js`(新規), `src/components/Projects/Projects.desktop.jsx`, `src/components/Projects/Projects.mobile.jsx`, `src/components/Projects/Projects.mobile.module.css`, `update.md`, `detail.md`, `tasks/todo.md`

**完了** ✅
- `src/hooks/useInfiniteCarousel.js` を新規作成: 3セット複製カルーセルの共通ロジック(`itemCount`/`gap` を受け取り `{ trackRef, scroll }` を返す)。中身は元の `Projects.desktop.jsx` の実装をそのまま移設(初期位置合わせ・スクロール外れ時のワープ・resize 対応・`scroll(dir)`)。
- `Projects.desktop.jsx` を上記フック利用にリファクタ。JSX・CSS・挙動は変更なし(既存の無限ループ・aria-hidden 仕様を維持していることを確認)。
- `Projects.mobile.jsx` を PC 版と同じ 3 セット複製(`loopedProjects`)・`isDuplicate` 判定(`aria-hidden`/リンク `tabIndex=-1`)を持つカルーセルに書き換え。`useInfiniteCarousel(projects.length, 20)` を使用。← →ボタンはカルーセル下の `.navRow` にまとめて配置(PC 版はカルーセル左右端に絶対配置だが、モバイルは指の届く位置を優先しレイアウトを変えた)。
- `Projects.mobile.module.css`: `.grid` を `.carousel`/`.track`/`.navRow`/`.navBtn` に置き換え。`.card` は `flex: 0 0 85vw; max-width: 340px; scroll-snap-align: center;` に変更。`.track` は `overflow-x: hidden; touch-action: pan-y; scroll-snap-type: x mandatory;`(スワイプでは動かず、ボタンからの `scrollTo`/`scrollBy` はプログラム的にスクロールできるため機能する)。左右チラ見え強調のため PC 版と同様の `mask-image` フェードも追加。`.navBtn` は 48×48px(タップ target 44px 以上を満たす)。`.body`/`.thumbnail` 等の見た目スタイルは既存のまま変更なし。
- 検証: `npx eslint src/components/Projects src/hooks` エラー0件。`npm run build` 成功(527 modules transformed)。Playwright は `node_modules` に未インストールのためヘッドレスブラウザでの実機確認は省略(指示どおり)。
- **追記(実機確認後)**: スマホ実機で「横幅が足りず本文が窮屈で使い物にならない」との報告を受け、`Projects.mobile.module.css` を1画面1カード表示に修正 — `.card` を `flex: 0 0 85vw; max-width: 340px` → `flex: 0 0 92vw; max-width: 480px` に拡大、左右チラ見え用の端フェード(`mask-image`/`-webkit-mask-image`)を削除、`.body` の padding を 28px → 20px に縮小して本文の実効幅を確保、`.track` の `padding-inline` を `calc(50% - min(46vw, 240px))` に更新。gap 20px は変更なしのため `Projects.mobile.jsx` 側の `useInfiniteCarousel(projects.length, 20)` もそのまま(一致を確認)。`overflow-x: hidden` + `touch-action: pan-y` のスワイプ無効は維持。eslint / `npm run build` とも成功を再確認。

## 2026-07-05 01:46 — スマホ版をPC版と同じ1ページスクロール構成に統一
**立案:**
- 依頼内容: スマホ版の表示構成を PC 版と同じ「1ページ縦スクロール」に統一する。現状はスマホのみ `App.jsx` が `MobileRouter` を描画し、Hero をランディング(`body.home-locked` でスクロール固定・Footer 非表示)、`#about` 等のハッシュで各セクションを「別ページ」として表示(戻るボタン付き)する構成になっている。各コンポーネントの mobile バリアント(縦積みレイアウト等)自体は維持し、ルーティング構造だけを PC 同様の1ページスクロールに統一する。
- 実装方針:
  1. `src/App.jsx`: `isMobile` による分岐を削除し、PC/スマホ共通で `Nav + main(blogSlug ? BlogPost : Hero〜Contact 全セクション) + Footer` を描画する。`BlogPost` には `variant={isMobile ? 'mobile' : 'desktop'}` と `onBack` を渡す(`useIsMobile` は variant 判定用にのみ残す)。
  2. `src/components/BlogPost/BlogPost.jsx`: 戻るボタンが `variant === 'desktop'` のときだけ表示される条件を、`onBack` が渡されていれば表示する形に変更(mobile でも表示されるように)。
  3. `src/components/MobileRouter/` ディレクトリ(`MobileRouter.jsx` / `index.jsx` / `MobileRouter.module.css`)を削除し、`App.jsx` からの import も削除。
  4. `src/index.css`: `body.home-locked` 関連ルール一式(モバイルのホーム画面固定・Footer 非表示)を削除。
  5. `src/hooks/useHashRoute.js`: `MobileRouter` の「ホームに戻る」ボタンだけが使っていた `reset` 関数を削除(他に使用箇所がないことを確認済み)。
  6. Hero.mobile / Nav.mobile を確認し、1ページスクロールの先頭セクション/共通ナビとして自然に振る舞うか調整(Nav.mobile のリンククリック時にメニューを閉じる処理は既存で対応済みを確認)。
  7. モバイル各セクションの背景色を確認し、PC 版と同じグラデーション進行(`#f7f3ee → #dfe9e6 → #b9d2d3 → #7ba7b5 → #4a7795 → #243f5e → #0d1c2e`)に揃える。従来モバイルは「単独ページ表示」前提で各セクション背景が `var(--white)` / `var(--dark)` 単色だったため、縦に並べると繋がりが不自然になる。Projects/Blog は暗色化するため、見出し(`section-title`/`section-label`)や Blog のリスト文字色も PC の深海レイヤー配色に合わせて明るい色へ変更する。Nav.mobile にスクロール連動の背景色同期(Nav.desktop の `sectionColors` 相当の仕組み)が無ければ、同じロジックをコピーして移植する。
- 影響範囲: `src/App.jsx`, `src/components/BlogPost/BlogPost.jsx`, `src/components/MobileRouter/`(削除), `src/index.css`, `src/hooks/useHashRoute.js`, `src/components/Nav/Nav.mobile.jsx` / `Nav.mobile.module.css`, `src/components/{About,Skills,Projects,Blog,Contact}/*.mobile.module.css`, `update.md`, `detail.md`, `tasks/todo.md`

**進捗/完了** ✅
- `src/App.jsx`: `isMobile` 分岐を削除。PC/モバイル共通で `Nav + main(blogSlug ? BlogPost : Hero〜Contact) + Footer` を描画。`BlogPost` に `variant={isMobile ? 'mobile' : 'desktop'}` と `onBack={() => navigate('blog')}` を渡す(`useIsMobile` は variant 判定にのみ残存)。
- `src/components/BlogPost/BlogPost.jsx`: 戻るボタンの表示条件を `variant === 'desktop'` → `onBack`(truthy かどうか)に変更(記事なし/記事ありの両分岐とも修正)。
- `src/components/MobileRouter/`(`MobileRouter.jsx` / `index.jsx` / `MobileRouter.module.css`)を削除。`App.jsx` の import も削除。他に参照箇所が無いことを確認済み。
- `src/index.css`: `@media (max-width: 768px)` 内の `body.home-locked` 関連ルール一式(ホーム画面固定・Footer 非表示)を削除。`grep` で他に `home-locked` 参照が残っていないことを確認。
- `src/hooks/useHashRoute.js`: `reset()` 関数を削除(`MobileRouter.jsx` 以外に使用箇所が無いことを確認済み)。戻り値は `{ hash, navigate, blogSlug }` に変更。
- `Hero.mobile.jsx` / `Nav.mobile.jsx` を確認: Hero.mobile のアンカーリンク・Nav.mobile のメニュー閉じる処理(`onClick={() => setOpen(false)}`)はいずれも既存のまま問題なく機能。
- **背景グラデーションの統一**: About/Skills/Projects/Blog/Contact の `*.mobile.module.css` の背景を、PC 版と同じグラデーション進行(`#f7f3ee → #dfe9e6 → #b9d2d3 → #7ba7b5 → #4a7795 → #243f5e → #0d1c2e`)に統一。従来モバイルは各セクション単独ページ前提で `var(--white)` / `var(--dark)` 単色だった。Projects/Blog は暗色化する範囲のため、PC 版と同じ「深海レイヤー」上書き(`.section-title` / `.section-label` を明色に、Blog の記事一覧文字色・区切り線も明色に)を追加。Hero.mobile にも desktop と同じ起点グラデ(`#f7f3ee → #dfe9e6`)を追加(元は背景指定なし)。
- **Nav.mobile の背景色同期を移植**: `Nav.desktop.jsx` の `sectionColors` / `computeColor`(スクロール位置から現在セクションの背景色を補間し `--nav-bg` に反映、暗い背景では `dark` クラスで文字色反転)をそのまま `Nav.mobile.jsx` にコピーして移植。`Nav.mobile.module.css` に `.dark.scrolled` / `.dark .logo` / `.dark .burger span` / `.dark .langBtn` を追加。
- **実機確認で見つけた副次的な不具合を修正**:
  - `Footer.mobile.jsx` に、旧 `home-locked` 構成下では `body.home-locked` により footer 自体が `display:none` になるため実質一度も描画されなかった「isHome 時にメール+SNS を複製表示する」死んだコードが存在。footer が常時表示になったことでこの分岐が有効化され、hash が空のとき Contact と内容が重複表示される不具合になるため、`Footer.desktop.jsx` と同じシンプルな著作権表記のみに変更し、`useHashRoute` 依存・未使用の `socials` 定数・関連 CSS クラス(`.contact`/`.contactLabel`/`.mail`/`.socials`/`.social`)を削除。
  - `Footer.mobile.module.css` の背景が `var(--dark)`(#2a2a2a、グレー寄り)で、Contact の終端色 `#0d1c2e`(紺)と食い違い継ぎ目が生じていたため `#0d1c2e` に統一(`Footer.desktop.module.css` は元から `#0d1c2e`)。
  - `BlogPost.module.css` の `.article.mobile { padding-top: 24px; }`(旧 `MobileRouter` の `.page` ラッパーが確保していた Nav ぶんの余白を前提にした上書き)を削除し忘れていたため、記事詳細ページの戻るボタン・ヘッダが固定 Nav の下に隠れる不具合があった → ルールごと削除して修正。
- **検証**: `npm run lint` / `npm run build` いずれも成功。加えて `npx playwright screenshot` で 390×844 のモバイルビューポートを headless Chromium で実機的に確認(Hero→About→Skills→Projects→Blog→Contact→Footer の背景グラデ連続性、Nav の色同期、ハンバーガーメニューの開閉とリンク遷移、BlogPost mobile の戻るボタン表示)。上記2件の不具合はこの確認で発見・修正した。
- **追記(実機確認後)**: Nav のハンバーガーメニューと内容が重複するため、Hero.mobile 内に残っていた旧ランディングページ由来の About/Skills/Projects/Blog セクションリンク一覧(`<nav>`)を削除。中央の破線アバター枠は維持。`Hero.mobile.module.css` の `.nav`/`.navItem`/`@keyframes navItemIn`(他で未使用)も削除。`.hero` は `min-height: 100svh` + `justify-content: center` で中央揃えのため、要素削減後もレイアウトが間延びすることはなく追加のCSS調整は不要と確認。`npx eslint src/components/Hero` / `npm run build` いずれも成功。

## 2026-07-05 01:26 — セクション間の余白を詰める
**立案:**
- 依頼内容: セクションの合間の余白が大きすぎるので詰めてほしい(Skills と Projects の間に画面の半分以上の空白がある、とのスクリーンショット付き報告)。
- 原因: 各セクションの CSS モジュールにある `min-height: 100svh` により、コンテンツ量が少ないセクション(特に Skills)が画面の高さいっぱいに引き伸ばされ、下側に空白ができている。共通の `.section { padding: 100px 0; }`(`src/index.css`)による上下 100px の余白はそのまま維持する。
- 実装方針: デスクトップ用モジュールのうち、ファーストビューの Hero と最終セクションの Contact を除く About / Skills / Projects / Blog の4ファイルから `min-height: 100svh` を削除する。各ファイルの `display: flex; flex-direction: column; justify-content: center;` は高さを引き伸ばさない限り無害なため残し、削除に伴う内部要素(height: 100% 依存や垂直センタリング崩れ)の有無を確認してから実施する。mobile 用 module.css はページ遷移型で画面を満たす設計のため対象外。
- 影響範囲: `src/components/About/About.desktop.module.css`, `src/components/Skills/Skills.desktop.module.css`, `src/components/Projects/Projects.desktop.module.css`, `src/components/Blog/Blog.desktop.module.css`, `update.md`, `tasks/todo.md`(必要なら `detail.md`)

**完了** ✅
- About / Skills / Projects / Blog の各 `*.desktop.module.css` から `min-height: 100svh;` を削除(いずれもルートの `.about` / `.skills` / `.projects` / `.blog` セレクタ)。Hero・Contact は対象外のため未変更。mobile 用 module.css も未変更。
- 削除に伴う崩れがないか確認: 各ファイルに残る `display: flex; flex-direction: column; justify-content: center;` は、高さが内容に合わせて自然に決まる(引き伸ばされない)状態では無害なためそのまま維持。内部要素に親の高さへ依存する `height: 100%` 等は無し(About の `.photo` は `.photoInner` の `aspect-ratio: 4/3` に依存しており `.about` の高さとは無関係)。Blog の `.comingSoon { min-height: 220px; }` はセクション自体ではなく内部の「準備中」表示用の別指定なのでそのまま残した。Nav.desktop.jsx の背景色同期は各セクションの `getBoundingClientRect()` を都度参照する実装のため、高さ変更後も追加対応不要。
- 検証: `npm run build` 成功(529 modules transformed、警告・エラーなし)。
- detail.md: `min-height`/`100svh` の記載は mobile 専用の `body.home-locked` の説明のみで、今回変更した About/Skills/Projects/Blog の高さ仕様には言及していなかったため更新不要と判断。

## 2026-07-05 01:22 — Wagamama Gourmet の Live Demo URL 変更
**立案:** `src/data/projects.js` の Wagamama Gourmet(id: 1)の `demo` を YouTube URL から Vercel のデプロイ先 `https://frontend-pi-rosy-20.vercel.app/` に変更。影響範囲はデータファイル1件のみ。

**完了** ✅ — `demo` フィールドを差し替え。ESLint エラー0件を確認。

## 2026-07-05 01:19 — About セクションに本人写真を追加
**立案:**
- 依頼内容: About セクションのプレースホルダー写真（`.photoText` の "Photo" テキスト）を、NVIDIA GTC カンファレンス会場前で撮影した本人写真に差し替える。
- 実装方針: 最適化済み写真（1600×1200, 4:3, JPEG）を `src/assets/about-photo.jpg` に配置し、Vite のアセットパイプラインを通す import 形式で `<img>` タグに差し替える。`.photoInner` の枠は aspect-ratio 4/3 のまま維持（写真も 4:3 のためトリミングはほぼ発生しない）。不要になった `.photoText` スタイルは削除。
- 影響範囲: `src/assets/about-photo.jpg`（新規）, `src/components/About/About.desktop.jsx`, `src/components/About/About.mobile.jsx`, `src/components/About/About.desktop.module.css`, `src/components/About/About.mobile.module.css`, `detail.md`, `tasks/todo.md`

**完了** ✅
- `src/assets/about-photo.jpg` に写真を配置。`About.desktop.jsx` / `About.mobile.jsx` の両方でプレースホルダー（`.photoText` の "Photo" テキスト＋TODOコメント）を `<img src={aboutPhoto} alt="NVIDIA GTC 会場前で撮影した岩井柊人" className={styles.photo} loading="lazy" />` に差し替え。
- `About.desktop.module.css` / `About.mobile.module.css` の `.photoText` を `.photo`（`width/height: 100%; object-fit: cover; display: block;`）に置き換え。`.photoText` は他コンポーネントから未参照であることを確認済み。
- 検証: `npx eslint src/components/About` エラー0件。

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
