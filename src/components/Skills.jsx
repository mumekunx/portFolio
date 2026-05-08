import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './Skills.module.css'

const categories = [
  {
    icon: '🖥',
    title: 'Frontend',
    color: 'sage',
    items: [
      // TODO: 使用技術に変更
      'React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vite',
    ],
  },
  {
    icon: '⚙️',
    title: 'Backend',
    color: 'clay',
    items: [
      // TODO: 使用技術に変更
      'Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Docker',
    ],
  },
  {
    icon: '🤖',
    title: 'AI / ML',
    color: 'sage',
    items: [
      // TODO: 使用技術に変更
      'PyTorch', 'scikit-learn', 'OpenAI API', 'LangChain', 'Hugging Face',
    ],
  },
  {
    icon: '🛠',
    title: 'Tools',
    color: 'clay',
    items: [
      // TODO: 使用ツールに変更
      'Git / GitHub', 'Figma', 'VS Code', 'Notion', 'Vercel',
    ],
  },
]

export default function Skills() {
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
