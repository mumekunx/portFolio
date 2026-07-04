import styles from './Hero.desktop.module.css'

export default function HeroDesktop() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.bgShape} />
      <div className={styles.bgShapeAlt} />

      <div className={`container ${styles.content}`}>
        <div className={styles.text}>
          <p className={styles.greeting}>Hi, I&apos;m</p>
          <h1 className={styles.name}>Iwai Shuto</h1>
          <p className={styles.tagline}>
            好奇心が原動力 — AI × アプリ開発で、面白いものをかたちにしていく。
          </p>
        </div>
      </div>
    </section>
  )
}
