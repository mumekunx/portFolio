import styles from './Footer.mobile.module.css'

export default function FooterMobile() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copy}>
          &copy; {year} Iwai Shuto. Built with React + Vite.
        </p>
      </div>
    </footer>
  )
}
