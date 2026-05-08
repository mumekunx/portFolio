import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './Projects.module.css'

// TODO: 実際のプロジェクト情報に変更
const projects = [
  {
    id: 1,
    tag: 'Web App',
    title: 'Project Alpha',
    description: 'TODO: プロジェクトの説明。何を作り、何が技術的な挑戦だったかを簡潔に。',
    tech: ['React', 'TypeScript', 'Firebase'],
    github: 'https://github.com/your-username/project-alpha', // TODO: GitHubリンク
    demo: 'https://your-demo-url.vercel.app', // TODO: デモリンク（なければ削除）
    accent: 'sage',
  },
  {
    id: 2,
    tag: 'AI / ML',
    title: 'Project Beta',
    description: 'TODO: プロジェクトの説明。何を作り、何が技術的な挑戦だったかを簡潔に。',
    tech: ['Python', 'PyTorch', 'FastAPI'],
    github: 'https://github.com/your-username/project-beta', // TODO: GitHubリンク
    demo: null,
    accent: 'clay',
  },
  {
    id: 3,
    tag: 'CLI Tool',
    title: 'Project Gamma',
    description: 'TODO: プロジェクトの説明。何を作り、何が技術的な挑戦だったかを簡潔に。',
    tech: ['Go', 'Docker', 'PostgreSQL'],
    github: 'https://github.com/your-username/project-gamma', // TODO: GitHubリンク
    demo: null,
    accent: 'sage',
  },
  {
    id: 4,
    tag: 'Mobile',
    title: 'Project Delta',
    description: 'TODO: プロジェクトの説明。何を作り、何が技術的な挑戦だったかを簡潔に。',
    tech: ['React Native', 'Expo', 'Supabase'],
    github: 'https://github.com/your-username/project-delta', // TODO: GitHubリンク
    demo: 'https://your-demo-url.vercel.app', // TODO: デモリンク（なければ削除）
    accent: 'clay',
  },
]

export default function Projects() {
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
                <span className={styles.tag}>{p.tag}</span>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.desc}>{p.description}</p>

                <ul className={styles.tech}>
                  {p.tech.map((t) => (
                    <li key={t} className={styles.techBadge}>{t}</li>
                  ))}
                </ul>

                <div className={styles.links}>
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkBtn}
                  >
                    GitHub
                  </a>
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
