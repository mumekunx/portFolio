import { useEffect } from 'react'
import { useHashRoute } from '../../hooks/useHashRoute'
import Hero from '../Hero'
import About from '../About'
import Skills from '../Skills'
import Projects from '../Projects'
import Blog from '../Blog'
import BlogPost from '../BlogPost'
import Contact from '../Contact'
import styles from './MobileRouter.module.css'

const routes = {
  about: About,
  skills: Skills,
  projects: Projects,
  blog: Blog,
  contact: Contact,
}

export default function MobileRouter() {
  const { hash, reset, navigate } = useHashRoute()
  const isHome = !hash || hash === 'hero'

  // #blog/<slug> なら記事詳細
  const blogSlug = hash.startsWith('blog/') ? hash.slice('blog/'.length) : null

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [hash])

  // ホーム（ランディング）だけ画面ぴったりに固定（スクロール無効）
  useEffect(() => {
    document.body.classList.toggle('home-locked', isHome)
    return () => document.body.classList.remove('home-locked')
  }, [isHome])

  // Empty hash or "hero" → home
  if (isHome) {
    return <Hero />
  }

  if (blogSlug) {
    return (
      <div className={styles.page}>
        <div className={styles.backBar}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate('blog')}
            aria-label="Blog 一覧に戻る"
          >
            <span className={styles.backArrow}>←</span>
            <span>Blog</span>
          </button>
        </div>
        <BlogPost slug={blogSlug} variant="mobile" />
      </div>
    )
  }

  const PageComponent = routes[hash]

  if (!PageComponent) {
    // Unknown hash → fallback to home
    return <Hero />
  }

  return (
    <div className={styles.page}>
      <div className={styles.backBar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={reset}
          aria-label="ホームに戻る"
        >
          <span className={styles.backArrow}>←</span>
          <span>Back</span>
        </button>
      </div>
      <PageComponent />
    </div>
  )
}
