# src/posts/

ブログ記事の置き場。**このフォルダに `.md` を追加するだけ**でサイトの Blog セクションに反映される。

## ファイル名のルール

```
YYYY-MM-DD-<slug>.md
```

- 例: `2026-04-15-react-hooks-tips.md`
- 日付プレフィックスは並び順を読みやすくするためだけで、実際の公開日は frontmatter の `date` が優先される
- `<slug>` 部分が記事URLになる（`#blog/react-hooks-tips`）

## frontmatter

各 md ファイルの先頭に以下を書く:

```markdown
---
title: 記事タイトル
date: 2026-04-15
tag: Frontend
excerpt: 記事の概要を1〜2文で。
external_url: https://zenn.dev/...
---

ここから本文を Markdown で書く。
```

| フィールド | 必須 | 説明 |
|---|---|---|
| `title` | ✅ | 記事タイトル |
| `date` | ✅ | 公開日 `YYYY-MM-DD` |
| `tag` | ✅ | カテゴリ（Frontend / AI / Backend / Tool / Life など） |
| `excerpt` | ✅ | 一覧カードに表示する概要（60〜120字目安） |
| `external_url` | 任意 | Zenn等の元記事URL。設定すると詳細ページに「Zennで見る ↗」リンクが出る |

## 反映の流れ

1. ここに `.md` を追加
2. `npm run dev` でローカル確認
3. `git push` → `npm run deploy`

ライブラリの再起動やDB更新は不要。ビルド時に Vite が自動で全 md を読み込む。

## 本文の書き方

- 通常の Markdown ＋ GFM（テーブル・タスクリスト・取り消し線）
- コードブロックには言語名を書く（`` ```js `` 等）と highlight.js でシンタックスハイライトされる
- 画像は `public/posts/` 以下に置いて `![](posts/image.png)` で参照（推奨）

詳細なテンプレ・タグ例は [../../docs/blog-post-template.md](../../docs/blog-post-template.md) を参照。
