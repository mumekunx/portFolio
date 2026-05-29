import { useEffect } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Blog from './components/Blog'
import BlogPost from './components/BlogPost'
import Contact from './components/Contact'
import Footer from './components/Footer'
import MobileRouter from './components/MobileRouter'
import { useIsMobile } from './hooks/useMediaQuery'
import { useHashRoute } from './hooks/useHashRoute'
import './index.css'

function App() {
  const isMobile = useIsMobile()
  const { hash, navigate } = useHashRoute()

  // #blog/<slug> なら記事詳細
  const blogSlug = hash.startsWith('blog/') ? hash.slice('blog/'.length) : null

  useEffect(() => {
    if (blogSlug) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [blogSlug])

  if (isMobile) {
    return (
      <>
        <Nav />
        <main>
          <MobileRouter />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Nav />
      <main>
        {blogSlug ? (
          <BlogPost slug={blogSlug} variant="desktop" onBack={() => navigate('blog')} />
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
