# 引き継ぎ用 baton

別端末で作業を再開するときに、Claude Code に **このファイルを最初に読ませてください**。

---

## プロジェクト概要

近畿大学 情報学部 2回生 **岩井柊都 (Iwai Shuto)** の個人ポートフォリオサイト。

- React 19 + Vite 8 + CSS Modules
- 言語: 日本語（英語切替UIあり、中身は未翻訳）
- デプロイ: gh-pages（`npm run deploy`）
- リポジトリ: https://github.com/mumekunx/portFolio

---

## ブランチ運用ルール（重要）

PC 版とスマホ版を **別ブランチで並行開発** している。コンフリクトを避けるため担当ファイルが分かれている。

| ブランチ | 担当ファイル |
|---------|-------------|
| `main` | 統合用。直接編集しない |
| `feature/desktop` | 各コンポーネントの `*.desktop.jsx` / `*.desktop.module.css` のみ編集 |
| `feature/mobile` | 各コンポーネントの `*.mobile.jsx` / `*.mobile.module.css` のみ編集 |

別端末で作業するときは、**まず `git pull origin <ブランチ名>` してから始める**。

---

## アーキテクチャ

### コンポーネント分割パターン

各セクションは PC/モバイル別ファイルに分かれており、`index.jsx` で振り分け。

```
src/components/Hero/
├── index.jsx                ← useIsMobile で振り分け（基本触らない）
├── Hero.desktop.jsx         ← PC用
├── Hero.desktop.module.css
├── Hero.mobile.jsx          ← スマホ用
└── Hero.mobile.module.css
```

同様の構成: `Nav / About / Skills / Projects / Blog / Contact / Footer`

### スマホ版の挙動（feature/mobile）

スマホでは Hero がランディングになり、ボタンタップでセクション単位の「ページ切替」をする SPA 風挙動。

- ルート判定: `src/hooks/useHashRoute.js`（ハッシュベース）
- 切替ロジック: `src/components/MobileRouter/MobileRouter.jsx`
- Hero に下線リンク（About / Skills / Projects / Blog）→ クリックで `#about` などに切替
- 各ページ上部に「← Back」ボタンで Hero に戻る
- Contact は Hero フッター内（メール + SNS アイコン）にだけ表示

PC では従来通り全セクション縦並びスクロール。`App.jsx` で `useIsMobile()` で出し分け。

---

## カスタマイズ済みコンテンツ

- **Hero**: 名前 "Iwai Shuto"、キャッチ「好奇心が原動力 — AI × アプリ開発で、面白いものをかたちにしていく。」
- **About**: 自己紹介2段落、facts（近畿大学/情報学部 情報学科/2回生/GPA 3.51/大阪）、実績4件（NVIDIA学生アンバサダー / 自治会委員長 / CYPR / 生駒祭1000人運用）
- **Skills**: Frontend / Mobile / Language / Tools の4カテゴリ
- **Projects**: 4件
  1. Wagamama Gourmet (KC3Hack 2026, チーム4人)
  2. フォトブース落書き App (生駒祭2025, ソロ, 1000人利用)
  3. BoardGames on iPhone (In Progress, ソロ)
  4. RealTimeNoting (In Progress, ソロ)
- **Contact**: mumekun.syuto0614@gmail.com / GitHub @mumekunx / X @s_06yt / Instagram @s_06yt / Zenn @mumekunx
- **Nav**: ロゴ "About me"、言語ドロップダウン (JP/EN, 見た目のみ・翻訳未実装)、バーガーメニュー（モバイルでドロップダウン式）

---

## 未着手・TODO

- [ ] About の写真（現在 "Photo" プレースホルダー、`src/components/About/About.*.jsx` で `<img>` に差し替える想定）
- [ ] 言語切替の実機能（i18n 導入。現在は UI のみ）
- [ ] Blog の中身（現在ダミー記事）
- [ ] `package.json` の `homepage` を本番URLに更新
- [ ] PC 版のレイアウト改善（feature/desktop で作業）

---

## 開発コマンド

```bash
# ブランチ切替
git checkout feature/mobile   # or feature/desktop

# 依存インストール（初回のみ）
npm install

# 開発サーバー
npm run dev   # http://localhost:5173

# ビルド
npm run build

# GitHub Pages デプロイ
npm run deploy
```

---

## 別端末で再開するときの手順

1. `git clone https://github.com/mumekunx/portFolio.git` または `git pull`
2. 作業したいブランチに切り替え (`git checkout feature/mobile` など)
3. `npm install` → `npm run dev`
4. Claude Code を起動して **このファイル (`baton.md`) を最初に読ませる**
5. やりたいことを伝えて作業開始

---

## 重要ファイルのありか

| 役割 | パス |
|------|------|
| エントリ振り分け | `src/App.jsx` |
| メディアクエリ | `src/hooks/useMediaQuery.js` |
| ハッシュルーター | `src/hooks/useHashRoute.js` |
| モバイルページ切替 | `src/components/MobileRouter/` |
| グローバル CSS | `src/index.css`（カラー変数 / アニメーション） |
| ナビ | `src/components/Nav/` |
| 各セクション | `src/components/{Hero,About,Skills,Projects,Blog,Contact,Footer}/` |
