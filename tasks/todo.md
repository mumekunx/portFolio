# todo.md

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
