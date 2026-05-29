import { useScrollReveal } from '../../hooks/useScrollReveal'
import { posts, formatDate } from '../../lib/posts'
import styles from './Blog.desktop.module.css'

export default function BlogDesktop() {
  useScrollReveal()

  return (
    <section className={`section ${styles.blog}`} id="blog">
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className="section-label">Blog</p>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Recent Posts</h2>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className={`${styles.comingSoon} fade-in`}>
            <p className={styles.comingSoonText}>Coming soon...</p>
          </div>
        ) : (
          <ul className={styles.list}>
            {posts.map((post, i) => (
              <li key={post.slug} className={`fade-in fade-in-delay-${(i % 4) + 1}`}>
                <a href={`#blog/${post.slug}`} className={styles.postLink}>
                  <div className={styles.postMeta}>
                    <time dateTime={post.date} className={styles.date}>
                      {formatDate(post.date)}
                    </time>
                    {post.tag && <span className={styles.postTag}>{post.tag}</span>}
                  </div>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <span className={styles.readMore}>Read more →</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
