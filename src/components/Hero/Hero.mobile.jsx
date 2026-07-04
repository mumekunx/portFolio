import styles from './Hero.mobile.module.css'

const navItems = [
  { hash: 'about', label: 'About' },
  { hash: 'skills', label: 'Skills' },
  { hash: 'projects', label: 'Projects' },
  { hash: 'blog', label: 'Blog' },
]

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

        <nav className={styles.nav}>
          {navItems.map((item, i) => (
            <a
              key={item.hash}
              href={`#${item.hash}`}
              className={styles.navItem}
              style={{ animationDelay: `${0.4 + i * 0.08}s` }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}
