# ブログ記事 テンプレート

ポートフォリオサイトのブログ記事は **[src/posts/](../src/posts/) フォルダに `.md` を追加するだけ**で反映される。
このファイルは記事を書くときのコピペ用テンプレ。

## ファイル命名規則

```
src/posts/YYYY-MM-DD-<slug>.md
```

- 例: `src/posts/2026-04-15-react-hooks-tips.md`
- `<slug>` 部分が記事URLの末尾になる（`#blog/react-hooks-tips`）
- 日付プレフィックスはエディタ上で並び順を見やすくするためのもの。実際の公開日順序は frontmatter の `date` で決まる

## テンプレ（コピペ用）

````markdown
---
title: 記事タイトル
date: 2026-MM-DD
tag: Frontend
excerpt: 記事の概要を1〜2文で。一覧カードに表示される。
external_url: https://zenn.dev/mumekunx/articles/xxxxxxxx
---

# 記事タイトル（本文の見出し）

導入文。何の話か・誰向けかを最初の段落で明示する。

## 第1セクション

本文を Markdown で書く。

```js
// コードブロックは言語名を書くとシンタックスハイライトされる
function hello() {
  console.log('hello')
}
```

## まとめ

学んだことや次やることを書く。
````

## frontmatter フィールド

| フィールド | 必須 | 説明 |
|---|---|---|
| `title` | ✅ | 記事タイトル |
| `date` | ✅ | 公開日 `YYYY-MM-DD` 形式 |
| `tag` | ✅ | 1つだけ（下の例から選ぶ or 新規） |
| `excerpt` | ✅ | 一覧表示用の概要。60〜120字目安 |
| `external_url` | 任意 | Zenn等の元記事URL。設定すると詳細ページに「元記事を見る ↗」リンクが出る |

### tag 例（増やしてOK）

| タグ | 想定内容 |
|---|---|
| `Frontend` | React / CSS / TypeScript / ブラウザAPI |
| `AI / ML` | LLM / Claude / 機械学習 |
| `Backend` | API / DB / インフラ |
| `Tool` | エディタ / CLI / 開発環境 |
| `Life` | 雑記・振り返り |

## 本文で使える Markdown 記法

- 見出し (`#` 〜 `####`)
- 強調 (`**bold**` / `*italic*`)
- リンク (`[text](url)`)
- リスト・番号付きリスト
- コードブロック（言語名指定でハイライト）
- インラインコード (`` `code` ``)
- 引用 (`> ...`)
- テーブル（GFM）
- タスクリスト (`- [x] done`)
- 画像 (`![](public/posts/image.png)`)
- 水平線 (`---`)

## 画像の置き場所

画像は [public/posts/](../public/posts/) 配下に置き、本文では `![](posts/image.png)` のように相対パスで参照。
（GitHub Pages のベースパス `/portFolio/` は Vite が自動で解決してくれる）

## チェックリスト（記事追加時）

- [ ] ファイル名が `YYYY-MM-DD-<slug>.md` 形式になっている
- [ ] frontmatter の `title` / `date` / `tag` / `excerpt` が入っている
- [ ] `date` は `YYYY-MM-DD` 形式
- [ ] `excerpt` は60〜120字程度
- [ ] `npm run dev` でローカル確認した
- [ ] PC/モバイル両方で表示が崩れない
- [ ] コードブロックに言語名を書いた
- [ ] `update.md` に追加記録を残した（任意）

## 反映フロー

```bash
# 1. src/posts/YYYY-MM-DD-<slug>.md を作成して本文を書く
# 2. ローカル確認
npm run dev

# 3. コミット & デプロイ
git add src/posts/<new-file>.md
git commit -m "blog: <記事タイトル>"
git push
npm run deploy
```

ビルド時に Vite の `import.meta.glob` が `src/posts/*.md` を全件読み込むので、追加・削除・編集のたびに `npm run deploy` で反映される。コードを書き換える必要はない。

## 仕組み（参考）

実装の中心は [src/lib/posts.js](../src/lib/posts.js):

```js
const modules = import.meta.glob('../posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})
```

ビルド時に md を文字列として全件取得 → frontmatter をパース → 日付降順でソート → Blog 一覧と詳細ページに渡している。
