import styles from './Footer.mobile.module.css'

export default function FooterMobile() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copy}>
          {/* TODO: 自分の名前に変更 */}
          &copy; {year} Iwai Shuto. Built with React + Vite.
        </p>
        <a href="#hero" className={styles.top}>Back to top ↑</a>
      </div>
    </footer>
  )
}
