import { useEffect, lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { useIsMobile } from './hooks/useMediaQuery'
import { useHashRoute } from './hooks/useHashRoute'
import './index.css'

const BlogPost = lazy(() => import('./components/BlogPost'))

function App() {
  const isMobile = useIsMobile()
  const { blogSlug, navigate } = useHashRoute()

  useEffect(() => {
    if (blogSlug) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [blogSlug])

  return (
    <>
      <a href="#main" className="skip-link">本文へスキップ</a>
      <Nav />
      <main id="main">
        {blogSlug ? (
          <Suspense fallback={<div className="routeLoading">Loading…</div>}>
            <BlogPost
              slug={blogSlug}
              variant={isMobile ? 'mobile' : 'desktop'}
              onBack={() => navigate('blog')}
            />
          </Suspense>
        ) : (
          <>
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Blog />
            <Contact />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}

export default App
