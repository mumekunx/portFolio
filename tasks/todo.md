# todo.md

## 2026-07-05 スマホ版 Projects を PC と同じカルーセルに変更
- [x] update.md に立案エントリ追記
- [x] Projects.desktop.jsx / .module.css のカルーセル実装を確認
- [x] src/hooks/useInfiniteCarousel.js に共通ロジックを抽出
- [x] Projects.desktop.jsx を useInfiniteCarousel 利用にリファクタ(挙動は変えない)
- [x] Projects.mobile.jsx を同方式のカルーセルに書き換え(3セット複製・aria-hidden・useInfiniteCarousel 利用)
- [x] Projects.mobile.module.css: カード幅 85vw(max-width あり)、track は overflow-x:hidden + touch-action:pan-y でスワイプ無効化、← →ボタン(48px)を配置
- [x] update.md に完了追記
- [x] detail.md を更新(Projects セクション・useInfiniteCarousel.js)
- [x] tasks/todo.md にタスク追加+チェック
- [x] npx eslint src/components/Projects src/hooks エラー0件を確認
- [x] npm run build 成功を確認
- [x] Playwright は node_modules 未インストールのため省略

## 2026-07-05 スマホ版をPC版と同じ1ページスクロール構成に統一
- [x] update.md に立案エントリ追記
- [x] App.jsx の isMobile 分岐を削除、共通で Nav+main(BlogPost or 全セクション)+Footer を描画
- [x] BlogPost.jsx の戻るボタン表示条件を variant === 'desktop' から onBack の有無に変更
- [x] MobileRouter ディレクトリ(MobileRouter.jsx/index.jsx/MobileRouter.module.css)を削除、App.jsx の import 削除
- [x] index.css の body.home-locked 関連ルールを削除
- [x] useHashRoute.js の reset 関数を削除(他に使用箇所が無いことを確認)
- [x] Hero.mobile / Nav.mobile の整合確認(メニュー閉じる処理など)
- [x] モバイル各セクション背景を PC 版のグラデーション進行に統一(About/Skills/Projects/Blog/Contact)
- [x] Projects/Blog の見出し・本文文字色を深海レイヤー配色に合わせて調整
- [x] Nav.mobile にスクロール連動背景色同期(Nav.desktop の sectionColors 相当)を移植
- [x] update.md に完了追記
- [x] detail.md を更新(MobileRouter 削除・App.jsx/useHashRoute 変更等)
- [x] npm run lint / npm run build が成功することを確認
- [x] (実機確認で発見) Footer.mobile の死んだ isHome 分岐が有効化される不具合を修正、Footer.mobile の背景色を #0d1c2e に統一
- [x] (実機確認で発見) BlogPost.module.css の .article.mobile padding-top 上書きにより戻るボタンが固定Navに隠れる不具合を修正

## 2026-07-05 セクション間の余白を詰める
- [x] update.md に立案エントリ追記
- [x] About.desktop.module.css から min-height: 100svh を削除
- [x] Skills.desktop.module.css から min-height: 100svh を削除
- [x] Projects.desktop.module.css から min-height: 100svh を削除
- [x] Blog.desktop.module.css から min-height: 100svh を削除
- [x] 削除に伴う内部要素の崩れがないか確認(height:100%依存・垂直センタリング等)
- [x] update.md に完了追記、detail.md 整合確認
- [x] npm run build で成功確認

## 2026-07-05 About セクションに本人写真を追加
- [x] src/assets/about-photo.jpg に写真を配置
- [x] About.desktop.jsx / About.mobile.jsx のプレースホルダーを <img> に差し替え
- [x] About.desktop.module.css / About.mobile.module.css に .photo 追加、不要な .photoText を削除
- [x] update.md / detail.md を更新
- [x] npx eslint src/components/About エラー0件を確認

## 2026-07-05 サイト全体改善(SEO/パフォーマンス/a11y/データ一元化)

作業ブランチ: `feature/20260705-0014-site-improvements`

### エージェント1: SEO/meta
- [x] index.html に title 追加
- [x] index.html に meta description 追加
- [x] index.html に OGP タグ追加(og:image は TODO のまま)
- [x] index.html に Twitter カードタグ追加
- [x] BlogPost で document.title を記事タイトルに変更

### エージェント2: パフォーマンス/ルーティング
- [x] BlogPost を React.lazy で遅延ロード化
- [x] blogSlug 解析ロジックを useHashRoute.js に一元化
- [x] Hero の rAF アニメーションを CSS keyframes に置き換え

### エージェント3: データ一元化+a11y
- [x] projects データを src/data/ に切り出し、desktop/mobile 両方から import
- [x] socials データを src/data/ に切り出し、desktop/mobile 両方から import
- [x] skills データを src/data/ に切り出し、desktop/mobile 両方から import
- [x] about データを src/data/ に切り出し、desktop/mobile 両方から import
- [x] カルーセル複製セットに aria-hidden 付与
- [x] 絵文字アイコンに aria-hidden 付与

### エージェント4: グローバルCSS/Nav
- [x] prefers-reduced-motion 対応を追加
- [x] ハンバーガーメニューに aria-expanded 属性追加
- [x] gh-pages パッケージを devDependencies へ移動

### 追加修正
- [x] useMediaQuery.js の lint エラー(react-hooks/set-state-in-effect)を useSyncExternalStore ベースに修正

### 検証
- [x] npm run build 成功
- [x] eslint 0 件見込み(useMediaQuery 修正後)
