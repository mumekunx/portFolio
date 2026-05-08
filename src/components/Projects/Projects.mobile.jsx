import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Projects.mobile.module.css'

const projects = [
  {
    id: 1,
    tag: 'Hackathon',
    title: 'Wagamama Gourmet',
    description: '「今のわがまま」に合わせて飲食店候補がリアルタイムで変わる地図アプリ。スライダーで価格・距離・雰囲気などの優先度を直感操作。2026年2月、チーム4人・1週間で開発。',
    tech: ['React', 'TypeScript', 'FastAPI', 'Python', 'Supabase', 'MapLibre GL JS'],
    github: 'https://github.com/kc3hack/2026_team25',
    demo: 'https://www.youtube.com/watch?v=fbzGp0XJGq8',
    accent: 'sage',
    inProgress: false,
  },
  {
    id: 3,
    tag: 'Desktop App',
    title: 'フォトブース落書き App',
    description: '近畿大学・生駒祭の情報学部展示にて実運用。来場者1000人に使ってもらったElectron製デスクトップ描画アプリ。1人で設計・開発・当日運営まで担当。',
    tech: ['Electron', 'React', 'Vite', 'Tailwind CSS'],
    github: null,
    demo: null,
    accent: 'sage',
    inProgress: false,
  },
  {
    id: 4,
    tag: 'iOS App',
    title: 'BoardGames on iPhone',
    description: '物理カード不要でボードゲームが遊べる iOSアプリ。第一弾は協力型カードゲーム「Ito」のオンラインリアルタイム対戦。SwiftUI + Firebase Firestore + Cloud Functions で構成。',
    tech: ['Swift', 'SwiftUI', 'Firebase', 'Cloud Functions', 'TypeScript'],
    github: 'https://github.com/TamariPlace/boardGamesOnIphone',
    demo: null,
    accent: 'sage',
    inProgress: true,
  },
  {
    id: 2,
    tag: 'Mobile / NLP',
    title: 'RealTimeNoting',
    description: '会話をリアルタイムで文字起こし・要約・固有名詞解決するFlutterアプリ。WebSocketで低遅延ストリーミング、日本語NLPサービスと連携。',
    tech: ['Flutter', 'Dart', 'TypeScript', 'Python', 'FastAPI', 'WebSocket'],
    github: 'https://github.com/TamariPlace/RealTimeNoting',
    demo: null,
    accent: 'clay',
    inProgress: true,
  },
]

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
