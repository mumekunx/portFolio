import { useScrollReveal } from '../../hooks/useScrollReveal'
import { socials } from '../../data/socials'
import styles from './Contact.desktop.module.css'

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
