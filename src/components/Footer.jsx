import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copy}>
          {/* TODO: 自分の名前に変更 */}
          &copy; {year} Your Name. Built with React + Vite.
        </p>
        <a href="#hero" className={styles.top}>Back to top ↑</a>
      </div>
    </footer>
  )
}
