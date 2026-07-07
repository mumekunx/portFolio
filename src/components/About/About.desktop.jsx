import { useScrollReveal } from '../../hooks/useScrollReveal'
import { facts } from '../../data/about'
import { categories } from '../../data/skills.jsx'
import aboutPhoto from '../../assets/about-photo.jpg'
import styles from './About.desktop.module.css'

const techStack = [...new Set(categories.flatMap(({ items }) => items))]

export default function AboutDesktop() {
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
                <img
                  src={aboutPhoto}
                  alt="NVIDIA GTC 会場前で撮影した岩井柊人"
                  className={styles.photo}
                  loading="lazy"
                />
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

            <div className={`${styles.skills} fade-in fade-in-delay-4`}>
              <p className={styles.skillsLabel}>Tech Stack</p>
              <ul className={styles.skillList}>
                {techStack.map((item) => (
                  <li key={item} className={styles.skillBadge}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
