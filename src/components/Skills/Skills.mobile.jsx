import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Skills.mobile.module.css'

const categories = [
  {
    icon: '🖥',
    title: 'Frontend / Web',
    color: 'sage',
    items: [
      'JavaScript', 'TypeScript', 'React', 'HTML / CSS', 'Vite',
    ],
  },
  {
    icon: '📱',
    title: 'Mobile / App',
    color: 'clay',
    items: [
      'Swift', 'Dart', 'Flutter',
    ],
  },
  {
    icon: '⚙️',
    title: 'Language',
    color: 'sage',
    items: [
      'Python', 'Java',
    ],
  },
  {
    icon: '🛠',
    title: 'Tools',
    color: 'clay',
    items: [
      'Git / GitHub', 'VS Code', 'Xcode', 'Claude', 'Cursor',
    ],
  },
]

export default function SkillsMobile() {
  useScrollReveal()

  return (
    <section className={`section ${styles.skills}`} id="skills">
      <div className="container">
        <p className="section-label">Skills</p>
        <h2 className="section-title">What I Work With</h2>

        <div className={styles.grid}>
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className={`${styles.card} ${styles[`card--${cat.color}`]} fade-in fade-in-delay-${i + 1}`}
            >
              <span className={styles.icon}>{cat.icon}</span>
              <h3 className={styles.cardTitle}>{cat.title}</h3>
              <ul className={styles.items}>
                {cat.items.map((item) => (
                  <li key={item} className={styles.item}>
                    <span className={styles.dot} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
