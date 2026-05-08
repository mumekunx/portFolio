import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

export default function Hero() {
  const shapeRef = useRef(null)

  useEffect(() => {
    let frame
    let t = 0
    const animate = () => {
      t += 0.003
      if (shapeRef.current) {
        const x = 50 + 15 * Math.sin(t)
        const y = 50 + 15 * Math.cos(t * 0.7)
        shapeRef.current.style.transform = `translate(${x - 50}px, ${y - 50}px)`
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.bgShape} ref={shapeRef} />
      <div className={styles.bgShapeAlt} />

      <div className={`container ${styles.content}`}>
        <div className={styles.text}>
          <p className={styles.greeting}>
            {/* TODO: 挨拶文をカスタマイズ */}
            Hi, I&apos;m
          </p>
          <h1 className={styles.name}>
            {/* TODO: 自分の名前に変更 */}
            Your Name
          </h1>
          <p className={styles.tagline}>
            {/* TODO: キャッチコピーに変更 */}
            情報学部の学生 — フロントエンド × AI に夢中。<br />
            きれいなコードと、ちょっと変わったアイデアが好き。
          </p>
          <div className={styles.cta}>
            <a href="#projects" className={styles.btnPrimary}>
              Works を見る
            </a>
            <a href="#contact" className={styles.btnSecondary}>
              連絡はこちら
            </a>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.morphBlob}>
            {/* TODO: 自分の写真を追加する場合は <img> に差し替え */}
            <span className={styles.photoPlaceholder}>Photo</span>
          </div>
        </div>
      </div>

      <a href="#about" className={styles.scroll}>
        <span className={styles.scrollLine} />
        <span className={styles.scrollLabel}>scroll</span>
      </a>
    </section>
  )
}
