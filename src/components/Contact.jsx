import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './Contact.module.css'

// TODO: 各 SNS のリンクを実際の URL に変更
const socials = [
  {
    name: 'GitHub',
    url: 'https://github.com/your-username',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'Twitter / X',
    url: 'https://twitter.com/your-username', // TODO: Twitterリンク
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/your-username', // TODO: LinkedInリンク（なければ削除）
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Zenn',
    url: 'https://zenn.dev/your-username', // TODO: Zennリンク（なければ削除）
    icon: (
      <svg viewBox="0 0 88 88" fill="currentColor" width="22" height="22">
        <path d="M9.2 74.2h15.7c.5 0 1-.3 1.3-.7L56.7 15c.4-.6 0-1.4-.7-1.4H40.4c-.5 0-1 .3-1.3.7L8.5 72.8c-.4.6 0 1.4.7 1.4z"/>
        <path d="M58.4 74.2h20c.7 0 1.1-.8.7-1.4L60.4 44.1c-.4-.6-1.3-.6-1.7 0l-10 16.3c-.2.3-.2.8 0 1.1l8.9 12.1c.4.4.5.6.8.6z"/>
      </svg>
    ),
  },
]

export default function Contact() {
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
          href="mailto:your-email@example.com" // TODO: メールアドレスに変更
          className={`${styles.mailBtn} fade-in fade-in-delay-2`}
        >
          {/* TODO: メールアドレスに変更 */}
          your-email@example.com
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
