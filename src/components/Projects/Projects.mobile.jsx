import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useInfiniteCarousel } from '../../hooks/useInfiniteCarousel'
import { projects } from '../../data/projects'
import styles from './Projects.mobile.module.css'

// 3セット並べて中央セットを基準に無限ループを表現する(PC 版と同じ方式)
const loopedProjects = [...projects, ...projects, ...projects]

export default function ProjectsMobile() {
  useScrollReveal()
  const { trackRef, scroll, activeIndex } = useInfiniteCarousel(projects.length, 20)

  return (
    <section className={`section ${styles.projects}`} id="projects">
      <div className="container">
        <p className="section-label">Projects</p>
        <h2 className="section-title">Selected Works</h2>

        <div className={styles.carousel}>
          <div className={styles.track} ref={trackRef}>
          {loopedProjects.map((p, i) => {
            const isDuplicate = i < projects.length || i >= projects.length * 2
            const hasLinks = Boolean(p.github || p.demo)
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

              <div className={`${styles.body} ${!hasLinks ? styles.bodyNoLinks : ''}`}>
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

                {hasLinks && (
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
                )}
              </div>
            </article>
            )
          })}
          </div>

          <div className={styles.navRow}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => scroll(-1)}
              aria-label="前のプロジェクト"
            >
              ←
            </button>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => scroll(1)}
              aria-label="次のプロジェクト"
            >
              →
            </button>
          </div>

          <div className={styles.dots} aria-hidden="true">
            {projects.map((p, i) => (
              <span
                key={p.id}
                className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
              />
            ))}
          </div>
          <p className={styles.srOnly} aria-live="polite">
            {`プロジェクト ${activeIndex + 1} / ${projects.length}`}
          </p>
        </div>
      </div>
    </section>
  )
}
