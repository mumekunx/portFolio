import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Blog.mobile.module.css'

// TODO: 実際のブログ記事情報に変更（Zenn・はてなブログなど）
const posts = [
  {
    id: 1,
    date: '2026-04-15',
    tag: 'Frontend',
    title: 'TODO: ブログ記事タイトル 1',
    excerpt: 'TODO: 記事の概要。どんな内容を書いたか、何を学んだかを 1〜2 文で。',
    url: 'https://zenn.dev/your-username/articles/your-article-1', // TODO: 記事URL
  },
  {
    id: 2,
    date: '2026-03-02',
    tag: 'AI / ML',
    title: 'TODO: ブログ記事タイトル 2',
    excerpt: 'TODO: 記事の概要。どんな内容を書いたか、何を学んだかを 1〜2 文で。',
    url: 'https://zenn.dev/your-username/articles/your-article-2', // TODO: 記事URL
  },
  {
    id: 3,
    date: '2026-01-20',
    tag: 'Life',
    title: 'TODO: ブログ記事タイトル 3',
    excerpt: 'TODO: 記事の概要。どんな内容を書いたか、何を学んだかを 1〜2 文で。',
    url: 'https://zenn.dev/your-username/articles/your-article-3', // TODO: 記事URL
  },
]

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogMobile() {
  useScrollReveal()

  return (
    <section className={`section ${styles.blog}`} id="blog">
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className="section-label">Blog</p>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Recent Posts</h2>
          </div>
          {/* TODO: ブログ全記事ページのURLに変更 */}
          <a
            href="https://zenn.dev/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.allLink}
          >
            All posts ↗
          </a>
        </div>

        <ul className={styles.list}>
          {posts.map((post, i) => (
            <li key={post.id} className={`fade-in fade-in-delay-${i + 1}`}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.postLink}
              >
                <div className={styles.postMeta}>
                  <time
                    dateTime={post.date}
                    className={styles.date}
                  >
                    {formatDate(post.date)}
                  </time>
                  <span className={styles.postTag}>{post.tag}</span>
                </div>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
                <span className={styles.readMore}>Read more →</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
