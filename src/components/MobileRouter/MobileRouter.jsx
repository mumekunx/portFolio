import { useEffect } from 'react'
import { useHashRoute } from '../../hooks/useHashRoute'
import Hero from '../Hero'
import About from '../About'
import Skills from '../Skills'
import Projects from '../Projects'
import Blog from '../Blog'
import Contact from '../Contact'
import styles from './MobileRouter.module.css'

const routes = {
  about: About,
  skills: Skills,
  projects: Projects,
  blog: Blog,
  contact: Contact,
}

const labels = {
  about: 'About',
  skills: 'Skills',
  projects: 'Projects',
  blog: 'Blog',
  contact: 'Contact',
}

export default function MobileRouter() {
  const { hash, reset } = useHashRoute()

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [hash])

  // Empty hash or "hero" → home
  if (!hash || hash === 'hero') {
    return <Hero />
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
