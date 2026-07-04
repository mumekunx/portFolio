import { useState, useEffect, useRef } from 'react'
import styles from './Nav.mobile.module.css'

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#blog', label: 'Blog' },
  { href: '#contact', label: 'Contact' },
]

const languages = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
]

export default function NavMobile() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState('ja')
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    if (!langOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLangOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [langOpen])

  const currentLang = languages.find((l) => l.code === lang)

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* TODO: 自分の名前のイニシャルや略称に変更 */}
        <a href="#" className={styles.logo}>About me</a>

        <div className={`${styles.menuOverlay} ${open ? styles.open : ''}`}>
          <ul className={styles.links}>
            {links.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className={styles.link} onClick={() => setOpen(false)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.langWrap} ref={langRef}>
          <button
            className={styles.langBtn}
            onClick={() => setLangOpen(!langOpen)}
            aria-haspopup="listbox"
            aria-expanded={langOpen}
          >
            <span>{currentLang.label}</span>
            <span className={`${styles.caret} ${langOpen ? styles.caretOpen : ''}`}>▾</span>
          </button>
          {langOpen && (
            <ul className={styles.langMenu} role="listbox">
              {languages.map((l) => (
                <li key={l.code}>
                  <button
                    type="button"
                    className={`${styles.langItem} ${l.code === lang ? styles.langItemActive : ''}`}
                    onClick={() => { setLang(l.code); setLangOpen(false) }}
                    role="option"
                    aria-selected={l.code === lang}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className={styles.burger}
          onClick={() => setOpen(!open)}
          aria-label="メニュー"
          aria-expanded={open}
        >
          <span className={open ? styles.burgerLineTop : ''} />
          <span className={open ? styles.burgerLineMid : ''} />
          <span className={open ? styles.burgerLineBot : ''} />
        </button>
      </div>
    </nav>
  )
}
