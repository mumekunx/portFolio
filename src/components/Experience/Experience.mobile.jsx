import { useScrollReveal } from '../../hooks/useScrollReveal'
import { experience } from '../../data/experience'
import styles from './Experience.mobile.module.css'

export default function ExperienceMobile() {
  useScrollReveal()

  return (
    <section className={`section ${styles.experience}`} id="experience">
      <div className="container">
        <p className="section-label">Experience</p>
        <h2 className="section-title">Milestones</h2>

        <ul className={styles.timeline}>
          {experience.map((item, i) => (
            <li
              key={`${item.date}-${item.title}`}
              className={`${styles.item} fade-in fade-in-delay-${(i % 4) + 1}`}
            >
              <div className={styles.rail} aria-hidden="true">
                <span className={styles.dot} />
              </div>
              <div className={styles.card}>
                <div className={styles.meta}>
                  <time dateTime={item.date} className={styles.date}>{item.date}</time>
                  {item.tag && <span className={styles.tag}>{item.tag}</span>}
                  {item.inProgress && <span className={styles.badge}>In Progress</span>}
                </div>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.description}>{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
