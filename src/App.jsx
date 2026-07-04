import { useEffect, lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
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
      <Nav />
      <main>
        {blogSlug ? (
          <Suspense fallback={null}>
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
            <Skills />
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
