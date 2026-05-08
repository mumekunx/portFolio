import { useScrollReveal } from '../../hooks/useScrollReveal'
import styles from './Contact.desktop.module.css'

// TODO: 各 SNS のリンクを実際の URL に変更
const socials = [
  {
    name: 'GitHub',
    url: 'https://github.com/mumekunx',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'Twitter / X',
    url: 'https://x.com/s_06yt',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/s_06yt',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: 'Zenn',
    url: 'https://zenn.dev/mumekunx',
    icon: (
      <svg viewBox="0 0 88 88" fill="currentColor" width="22" height="22">
        <path d="M9.2 74.2h15.7c.5 0 1-.3 1.3-.7L56.7 15c.4-.6 0-1.4-.7-1.4H40.4c-.5 0-1 .3-1.3.7L8.5 72.8c-.4.6 0 1.4.7 1.4z"/>
        <path d="M58.4 74.2h20c.7 0 1.1-.8.7-1.4L60.4 44.1c-.4-.6-1.3-.6-1.7 0l-10 16.3c-.2.3-.2.8 0 1.1l8.9 12.1c.4.4.5.6.8.6z"/>
      </svg>
    ),
  },
]

export default function ContactDesktop() {
  useScrollReveal()

  return (
    <section className={styles.contact} id="contact">
      <div className={styles.bgDecor1} />
      <div className={styles.bgDecor2} />

      <div className={`container ${styles.inner}`}>
        <p className={`section-label ${styles.label}`}>Contact</p>
        <h2 className={`${styles.title} fade-in`}>Let&apos;s Connect</h2>
        <p className={`${styles.sub} fade-in fade-in-delay-1`}>
          {/* TODO: 連絡先メッセージに変更 */}
          お仕事の依頼・コラボ・雑談、なんでもお気軽にどうぞ。<br />
          メールや SNS からご連絡ください。
        </p>

        <a
          href="mailto:mumekun.syuto0614@gmail.com"
          className={`${styles.mailBtn} fade-in fade-in-delay-2`}
        >
          mumekun.syuto0614@gmail.com
        </a>

        <ul className={`${styles.socials} fade-in fade-in-delay-3`}>
          {socials.map((s) => (
            <li key={s.name}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={s.name}
              >
                {s.icon}
                <span>{s.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
