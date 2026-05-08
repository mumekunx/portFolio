import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './About.module.css'

const facts = [
  { label: 'University', value: 'TODO: 大学名' },
  { label: 'Faculty', value: 'TODO: 学部・学科名' },
  { label: 'Year', value: 'TODO: 学年 (e.g. 3年生)' },
  { label: 'Location', value: 'TODO: 居住地' },
]

export default function About() {
  useScrollReveal()

  return (
    <section className={`section ${styles.about}`} id="about">
      <div className="container">
        <p className="section-label">About</p>
        <h2 className="section-title">About Me</h2>

        <div className={styles.grid}>
          <div className={`${styles.photo} fade-in`}>
            <div className={styles.photoInner}>
              {/* TODO: <img src="your-photo.jpg" alt="Your Name" /> に差し替え */}
              <span className={styles.photoText}>Your Photo</span>
            </div>
            <div className={styles.photoDecor} />
          </div>

          <div className={styles.bio}>
            <p className={`${styles.bioParagraph} fade-in fade-in-delay-1`}>
              {/* TODO: 自己紹介文に変更 */}
              はじめまして！情報学部に通っている〇年生です。フロントエンド開発と機械学習に特に興味を持っており、日々勉強中です。
            </p>
            <p className={`${styles.bioParagraph} fade-in fade-in-delay-2`}>
              {/* TODO: 自己紹介文（続き）に変更 */}
              趣味は〇〇と〇〇で、コードを書く以外の時間は〇〇をしています。チームで何かを作り上げることが好きで、ハッカソンにもよく参加しています。
            </p>

            <ul className={`${styles.facts} fade-in fade-in-delay-3`}>
              {facts.map(({ label, value }) => (
                <li key={label} className={styles.fact}>
                  <span className={styles.factLabel}>{label}</span>
                  <span className={styles.factValue}>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
