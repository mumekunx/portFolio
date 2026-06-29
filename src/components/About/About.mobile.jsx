import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './About.mobile.module.css'

const facts = [
  { label: 'University', value: '近畿大学' },
  { label: 'Faculty', value: '情報学部 情報学科' },
  { label: 'Year', value: '2回生' },
  { label: 'GPA', value: '3.51' },
  { label: 'Location', value: '大阪' },
]

const achievements = [
  {
    icon: '🏛',
    title: '令和8年度 近畿大学情報学部 自治会委員長',
    sub: 'Student Council President',
  },
  {
    icon: '🚀',
    title: '学生団体 "CYPR" 立ち上げ中',
    sub: 'Founding Member · In Progress',
    inProgress: true,
  },
  {
    icon: '🎪',
    title: '生駒祭にてアプリを実運用、来場者 1,000 人が利用',
    sub: 'Kinki Univ. Campus Festival 2025',
  },
]

export default function AboutMobile() {
  useScrollReveal()

  return (
    <section className={`section ${styles.about}`} id="about">
      <div className="container">
        <p className="section-label">About</p>
        <h2 className="section-title">About Me</h2>

        <div className={styles.grid}>
          <div className={`${styles.left} fade-in`}>
            <div className={styles.photoWrap}>
              <div className={styles.photoInner}>
                {/* TODO: <img src="your-photo.jpg" alt="Iwai Shuto" /> に差し替え */}
                <span className={styles.photoText}>Photo</span>
              </div>
            </div>
            <p className={`${styles.bioParagraph} fade-in fade-in-delay-1`}>
              中学のころ夢中になっていたFPSゲームの開発に興味を持ったのが、プログラミングとの出会いです。気になったことはすぐ手を動かして試す、というスタンスでやってきました。
            </p>
            <p className={`${styles.bioParagraph} fade-in fade-in-delay-2`}>
              特に興味があるのはLLMをはじめとするAI研究と、日常を豊かにするアプリ開発。将来はソフトウェアエンジニアとして、使っていて楽しいプロダクトを作り続けたいと思っています。趣味はゲームと最新AIを追いかけること、そしておしゃべり。
            </p>
          </div>

          <div className={styles.right}>
            <ul className={`${styles.facts} fade-in fade-in-delay-3`}>
              {facts.map(({ label, value }) => (
                <li key={label} className={styles.fact}>
                  <span className={styles.factLabel}>{label}</span>
                  <span className={styles.factValue}>{value}</span>
                </li>
              ))}
            </ul>

            <ul className={`${styles.achievements} fade-in fade-in-delay-4`}>
              {achievements.map(({ icon, title, sub, inProgress }) => (
                <li key={title} className={styles.achievement}>
                  <span className={styles.achieveIcon}>{icon}</span>
                  <div className={styles.achieveBody}>
                    <span className={styles.achieveTitle}>
                      {title}
                      {inProgress && <span className={styles.achieveBadge}>In Progress</span>}
                    </span>
                    <span className={styles.achieveSub}>{sub}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
