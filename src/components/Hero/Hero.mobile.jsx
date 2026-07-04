import styles from './Hero.mobile.module.css'

export default function HeroMobile() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.bgShape} />
      <div className={styles.bgShapeAlt} />

      <div className={`container ${styles.content}`}>
        {/* TODO: アイコン（アバター）を入れる枠。<img> 等に差し替え予定 */}
        <div className={styles.avatar} aria-hidden="true" />

        <div className={styles.text}>
          <p className={styles.greeting}>Hi, I&apos;m</p>
          <h1 className={styles.name}>Iwai Shuto</h1>
          <p className={styles.tagline}>
            好奇心が原動力 — AI × アプリ開発で、<br />
            面白いものをかたちにしていく。
          </p>
        </div>
      </div>
    </section>
  )
}
