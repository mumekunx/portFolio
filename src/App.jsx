import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'
import MobileRouter from './components/MobileRouter'
import { useIsMobile } from './hooks/useMediaQuery'
import './index.css'

function App() {
  const isMobile = useIsMobile()

  return (
    <>
      <Nav />
      <main>
        {isMobile ? (
          <MobileRouter />
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
