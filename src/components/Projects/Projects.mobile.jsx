import { useScrollReveal } from '../../hooks/useScrollReveal'
import { projects } from '../../data/projects'
import styles from './Projects.mobile.module.css'

export default function ProjectsMobile() {
  useScrollReveal()

  return (
    <section className={`section ${styles.projects}`} id="projects">
      <div className="container">
        <p className="section-label">Projects</p>
        <h2 className="section-title">Selected Works</h2>

        <div className={styles.grid}>
          {projects.map((p, i) => (
            <article
              key={p.id}
              className={`${styles.card} ${styles[`card--${p.accent}`]} fade-in fade-in-delay-${(i % 2) + 1}`}
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
                    >
                      Live Demo ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
