import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import { getPost, formatDate } from '../../lib/posts'
import styles from './BlogPost.module.css'

export default function BlogPost({ slug, variant = 'desktop', onBack }) {
  const post = getPost(slug)

  useEffect(() => {
    if (!post) return

    document.title = `${post.title} | Iwai Shuto`

    return () => {
      document.title = 'Iwai Shuto | Portfolio'
    }
  }, [post])

  if (!post) {
    return (
      <section className={`section ${styles.notFound}`}>
        <div className="container">
          <p className={styles.notFoundText}>記事が見つかりませんでした。</p>
          {onBack && (
            <button type="button" className={styles.backBtn} onClick={onBack}>
              ← Blog 一覧へ
            </button>
          )}
        </div>
      </section>
    )
  }

  return (
    <article className={`section ${styles.article} ${styles[variant]}`}>
      <div className="container">
        {onBack && (
          <button type="button" className={styles.backBtn} onClick={onBack}>
            ← Blog 一覧へ
          </button>
        )}

        <header className={styles.header}>
          <div className={styles.meta}>
            <time dateTime={post.date} className={styles.date}>
              {formatDate(post.date)}
            </time>
            {post.tag && <span className={styles.tag}>{post.tag}</span>}
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          {post.externalUrl && (
            <a
              href={post.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.externalLink}
            >
              元記事を見る ↗
            </a>
          )}
        </header>

        <div className={styles.content}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  )
}
