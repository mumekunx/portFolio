import { useEffect, useRef } from 'react'
import styles from './Hero.mobile.module.css'

export default function HeroMobile() {
  const shapeRef = useRef(null)

  useEffect(() => {
    let frame
    let t = 0
    const animate = () => {
      t += 0.003
      if (shapeRef.current) {
        const x = 50 + 12 * Math.sin(t)
        const y = 50 + 12 * Math.cos(t * 0.7)
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
