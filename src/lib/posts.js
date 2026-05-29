// src/posts/*.md を読み込んでメタデータ＋本文の配列にする
// frontmatter は YAML 風だが、依存を増やさないため最小パーサで処理する
// 対応形式: title, date, tag, excerpt, external_url（任意）

const modules = import.meta.glob('../posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const data = {}
  const lines = match[1].split(/\r?\n/)
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/)
    if (!m) continue
    let value = m[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    data[m[1]] = value
  }
  return { data, content: match[2] }
}

function slugFromPath(filePath) {
  const name = filePath.split('/').pop().replace(/\.md$/, '')
  // 2026-04-15-react-hooks.md → react-hooks
  return name.replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

export const posts = Object.entries(modules)
  // `_` で始まるファイルは記事ではなく README 等のメモ扱いで除外
  .filter(([path]) => !path.split('/').pop().startsWith('_'))
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    return {
      slug: slugFromPath(path),
      title: data.title || '(no title)',
      date: data.date || '',
      tag: data.tag || '',
      excerpt: data.excerpt || '',
      externalUrl: data.external_url || '',
      content,
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export function getPost(slug) {
  return posts.find((p) => p.slug === slug)
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}
