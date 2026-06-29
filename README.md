# Portfolio — Iwai Shuto

岩井柊斗のポートフォリオサイト。React + Vite で作った1ページ構成のSPA。

🔗 **公開URL**: https://mumekunx.github.io/portFolio/

---

## 構成セクション

| セクション | 内容 |
|---|---|
| **Hero** | 名前・キャッチコピー・モーフィングする背景シェイプ |
| **About** | 自己紹介 |
| **Skills** | スキルカード（Frontend / Mobile / Language / Tools） |
| **Projects** | 制作物4件（Wagamama Gourmet / フォトブース落書きApp / BoardGames on iPhone / RealTimeNoting）。PCでは横カルーセル |
| **Blog** | md ファイルベースのブログ。記事追加方法は [docs/blog-post-template.md](docs/blog-post-template.md) を参照 |
| **Contact** | メール + SNS リンク |

PC版は深海をテーマにしたグラデーション（ベージュ → 深海ブルー）で各セクションが全画面表示。

---

## 使用技術

### コア
- **React 19** — UIライブラリ
- **Vite 8** — 開発サーバー・ビルドツール（Rolldown ベース）
- **JavaScript (JSX)** — TypeScriptは不使用

### ブログ機能
- **react-markdown** — Markdown → React 要素
- **remark-gfm** — GFM対応（テーブル・タスクリスト・取り消し線）
- **rehype-highlight** + **highlight.js** — コードブロックのシンタックスハイライト（github-dark テーマ）

### スタイリング
- **CSS Modules** — コンポーネントスコープのCSS
- **CSS Variables** — テーマカラー（`--sage` / `--clay` / `--sand` など）を `index.css` で集中管理
- カスタムフォント（Google Fonts）: DM Serif Display / DM Sans / Space Mono

### Lint・開発
- **ESLint** + react-hooks / react-refresh プラグイン

### デプロイ
- **GitHub Pages** + **gh-pages** パッケージ
- `npm run deploy` で `dist/` を `gh-pages` ブランチに自動 push

---

## アーキテクチャ

### PC / モバイル分割

各セクションコンポーネントは **PC/モバイルの2ファイル構成** で実装。`useIsMobile()` フックで切り替え。

```
src/components/Blog/
├── Blog.desktop.jsx          # PC用
├── Blog.desktop.module.css
├── Blog.mobile.jsx           # モバイル用
├── Blog.mobile.module.css
└── index.jsx                 # useIsMobile() で振り分け
```

### ルーティング

**ハッシュベース**（react-router 不使用、GitHub Pages との相性◎）:

- PC版: 通常はランディング1ページ。`#blog/<slug>` のみ記事詳細ページに切り替え
- モバイル版: `#about` / `#skills` / `#projects` / `#blog` / `#contact` で1セクションずつ画面表示。`#blog/<slug>` で記事詳細

実装は [src/hooks/useHashRoute.js](src/hooks/useHashRoute.js) と [src/components/MobileRouter/](src/components/MobileRouter/) を参照。

### Blog の md 管理

[src/posts/](src/posts/) に `YYYY-MM-DD-<slug>.md` 形式のファイルを置くだけで反映される:

```js
// src/lib/posts.js
const modules = import.meta.glob('../posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})
```

Vite の `import.meta.glob` でビルド時に全 md を文字列として取得 → frontmatter（title/date/tag/excerpt）を自前パーサで処理 → 日付降順でソートして export。

詳細は [docs/blog-post-template.md](docs/blog-post-template.md)。

---

## 開発

### 必要環境
- Node.js 20+ 推奨

### セットアップ

```bash
git clone https://github.com/mumekunx/portFolio.git
cd portFolio
npm install
```

### スクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー起動（HMR有効） |
| `npm run build` | 本番ビルド（`dist/` に出力） |
| `npm run preview` | ビルド成果物のローカルプレビュー |
| `npm run lint` | ESLint 実行 |
| `npm run deploy` | ビルド → `gh-pages` ブランチに push して公開 |

---

## ディレクトリ構成

```
portFolio/
├── public/                 # 静的アセット（favicon, icons.svg）
├── src/
│   ├── components/         # 各セクションコンポーネント
│   │   ├── Nav/
│   │   ├── Hero/
│   │   ├── About/
│   │   ├── Skills/
│   │   ├── Projects/
│   │   ├── Blog/           # 記事一覧
│   │   ├── BlogPost/       # 記事詳細（md レンダリング）
│   │   ├── Contact/
│   │   ├── Footer/
│   │   └── MobileRouter/   # モバイルのハッシュルーティング
│   ├── hooks/
│   │   ├── useMediaQuery.js
│   │   ├── useHashRoute.js
│   │   └── useScrollReveal.js
│   ├── lib/
│   │   └── posts.js        # md 読み込み・frontmatter パース
│   ├── posts/              # ブログ記事 (*.md)
│   ├── assets/             # 画像
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css           # グローバルCSS・テーマ変数
├── docs/
│   └── blog-post-template.md  # 記事追加手順
├── detail.md               # ファイル構成リファレンス
├── update.md               # 進捗ログ
├── vite.config.js
├── package.json
└── README.md
```

---

## デプロイの仕組み

1. `npm run deploy` を実行
2. `predeploy` で `vite build` が走り `dist/` 生成
3. `gh-pages -d dist` が `dist/` の中身を `gh-pages` ブランチに push
4. GitHub Pages が `gh-pages` ブランチを公開元に設定されているので自動反映

`vite.config.js` の `base` はビルド時のみ `/portFolio/` を返す:

```js
base: command === 'build' ? '/portFolio/' : '/',
```

これにより dev サーバー（`/`）と本番（`/portFolio/`）でアセットパスが自動で切り替わる。

---

## ドキュメント

| ファイル | 内容 |
|---|---|
| [README.md](README.md) | このファイル（プロジェクト概要） |
| [detail.md](detail.md) | 全ファイルのリファレンス（何があるか） |
| [update.md](update.md) | 進捗ログ（いつ何をしたか） |
| [docs/blog-post-template.md](docs/blog-post-template.md) | ブログ記事の書き方 |

---

## License

Private — Iwai Shuto
