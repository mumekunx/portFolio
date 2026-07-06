import { useState, useEffect, useRef } from 'react'
import styles from './Nav.desktop.module.css'

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

// 各セクションの背景グラデの [上端色, 下端色] (RGB)
// セクションの実CSSと一致させる必要あり
const sectionColors = {
  hero:     [[0xf7, 0xf3, 0xee], [0xdf, 0xe9, 0xe6]],
  about:    [[0xdf, 0xe9, 0xe6], [0xb9, 0xd2, 0xd3]],
  skills:   [[0xb9, 0xd2, 0xd3], [0x7b, 0xa7, 0xb5]],
  projects: [[0x7b, 0xa7, 0xb5], [0x4a, 0x77, 0x95]],
  blog:     [[0x4a, 0x77, 0x95], [0x24, 0x3f, 0x5e]],
  contact:  [[0x24, 0x3f, 0x5e], [0x0d, 0x1c, 0x2e]],
}

const sectionOrder = ['hero', 'about', 'skills', 'projects', 'blog', 'contact']

// 各セクションの大見出し。ロゴ表示テキストに使う(実際の見出しと一致させること)
const sectionTitles = {
  hero: 'About me',
  about: 'About Me',
  skills: 'What I Work With',
  projects: 'Selected Works',
  blog: 'Recent Posts',
  contact: "Let's Connect",
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t)
}

function lerpColor(c1, c2, t) {
  return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)]
}

// 知覚輝度（簡易）。0.6未満なら暗い背景＝白文字
function isDarkColor([r, g, b]) {
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luma < 0.6
}

export default function NavDesktop() {
  const [scrolled, setScrolled] = useState(false)
  const [navColor, setNavColor] = useState([0xf7, 0xf3, 0xee])
  const [activeSection, setActiveSection] = useState('hero')
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState('ja')
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)

  useEffect(() => {
    let rafId = null

    const computeColor = () => {
      rafId = null
      const navHeight = 60 // Nav の概ねの高さ
      const probeY = navHeight + 1 // Nav 直下のピクセル位置を判定基準にする
      const y = window.scrollY

      setScrolled(y > 40)

      // 各セクションの DOM 矩形を取得し、probeY を含むセクションを見つける
      let activeId = 'hero'
      let progress = 0
      for (const id of sectionOrder) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= probeY && rect.bottom > probeY) {
          activeId = id
          const h = rect.height || 1
          progress = Math.min(1, Math.max(0, (probeY - rect.top) / h))
          break
        }
      }

      const colors = sectionColors[activeId] || sectionColors.hero
      setNavColor(lerpColor(colors[0], colors[1], progress))
      setActiveSection(activeId)
    }

    // スクロール/リサイズ発火をフレームごとに1回へまとめる
    const scheduleComputeColor = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(computeColor)
    }

    computeColor()
    window.addEventListener('scroll', scheduleComputeColor, { passive: true })
    window.addEventListener('resize', scheduleComputeColor)
    return () => {
      window.removeEventListener('scroll', scheduleComputeColor)
      window.removeEventListener('resize', scheduleComputeColor)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
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

  const [r, g, b] = navColor
  const navBg = `rgba(${r}, ${g}, ${b}, 0.82)`
  const dark = isDarkColor(navColor)

  return (
    <nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${dark ? styles.dark : ''}`}
      style={{ '--nav-bg': navBg }}
    >
      <div className={`container ${styles.inner}`}>
        {/* TODO: 自分の名前のイニシャルや略称に変更 */}
        <a href="#" className={styles.logo}>
          <span key={activeSection} className={styles.logoText}>
            {sectionTitles[activeSection] ?? 'About me'}
          </span>
        </a>

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
