import { useRef, useEffect } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { projects } from '../../data/projects'
import styles from './Projects.desktop.module.css'

// 3セット並べて中央セットを基準に無限ループを表現する
const loopedProjects = [...projects, ...projects, ...projects]

export default function ProjectsDesktop() {
  useScrollReveal()
  const trackRef = useRef(null)
  const cardWidthRef = useRef(0)

  // 初期スクロール位置を中央セットの先頭に
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const positionToMiddle = () => {
      const card = track.children[projects.length] // 中央セットの先頭
      if (!card) return
      cardWidthRef.current = card.offsetWidth + 32 // gap 32px
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      track.scrollTo({ left: cardCenter - track.clientWidth / 2, behavior: 'instant' })
    }

    positionToMiddle()
    window.addEventListener('resize', positionToMiddle)
    return () => window.removeEventListener('resize', positionToMiddle)
  }, [])

  // スクロールが中央セットの外に出たら、中央セットの同じ相対位置へワープ
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const setLen = projects.length
    let raf = null

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const cardW = cardWidthRef.current
        if (!cardW) return
        const middleStart = setLen * cardW
        const middleEnd = setLen * 2 * cardW
        // 前セットに入ったら中央セットへ
        if (track.scrollLeft < middleStart - cardW / 2) {
          track.scrollTo({ left: track.scrollLeft + setLen * cardW, behavior: 'instant' })
        }
        // 後セットに入ったら中央セットへ
        else if (track.scrollLeft > middleEnd - cardW / 2) {
          track.scrollTo({ left: track.scrollLeft - setLen * cardW, behavior: 'instant' })
        }
      })
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const scroll = (dir) => {
    const track = trackRef.current
    if (!track) return
    const amount = cardWidthRef.current || track.clientWidth * 0.8
    track.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <section className={`section ${styles.projects}`} id="projects">
      <div className="container">
        <p className="section-label">Projects</p>
        <h2 className="section-title">Selected Works</h2>

        <div className={styles.carousel}>
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navPrev}`}
            onClick={() => scroll(-1)}
            aria-label="前のプロジェクト"
          >
            ←
          </button>

          <div className={styles.track} ref={trackRef}>
          {loopedProjects.map((p, i) => {
            const isDuplicate = i < projects.length || i >= projects.length * 2
            return (
            <article
              key={`${p.id}-${i}`}
              className={`${styles.card} ${styles[`card--${p.accent}`]}`}
              aria-hidden={isDuplicate ? 'true' : undefined}
            >
              <div className={`${styles.thumbnail} ${styles[`thumb--${p.accent}`]}`}>
                {/* TODO: スクリーンショットや OGP 画像を追加 */}
                <span className={styles.thumbLabel}>{p.tag}</span>
              </div>

              <div className={styles.body}>
                <div className={styles.tagRow}>
                  <span className={styles.tag}>{p.tag}</span>
                  {p.inProgress && <span className={styles.badge}>In Progress</span>}
                </div>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.desc}>{p.description}</p>

                <ul className={styles.tech}>
                  {p.tech.map((t) => (
                    <li key={t} className={styles.techBadge}>{t}</li>
                  ))}
                </ul>

                <div className={styles.links}>
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkBtn}
                      tabIndex={isDuplicate ? -1 : undefined}
                    >
                      GitHub
                    </a>
                  )}
                  {p.demo && (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.linkBtn} ${styles.linkBtnPrimary}`}
                      tabIndex={isDuplicate ? -1 : undefined}
                    >
                      Live Demo ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
            )
          })}
          </div>

          <button
            type="button"
            className={`${styles.navBtn} ${styles.navNext}`}
            onClick={() => scroll(1)}
            aria-label="次のプロジェクト"
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}
