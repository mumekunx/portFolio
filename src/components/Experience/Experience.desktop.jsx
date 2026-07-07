import { useEffect, useMemo, useRef, useState } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { experience } from '../../data/experience'
import styles from './Experience.desktop.module.css'

export default function ExperienceDesktop() {
  useScrollReveal()

  const [selectedYear, setSelectedYear] = useState('all')
  const scrollRef = useRef(null)

  const years = useMemo(
    () => [...new Set(experience.map((e) => e.date.slice(0, 4)))].sort((a, b) => b.localeCompare(a)),
    []
  )

  const filtered = useMemo(
    () =>
      selectedYear === 'all'
        ? experience
        : experience.filter((e) => e.date.slice(0, 4) === selectedYear),
    [selectedYear]
  )

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [selectedYear])

  return (
    <section className={`section ${styles.experience}`} id="experience">
      <div className="container">
        <p className="section-label">Experience</p>
        <h2 className="section-title">Milestones</h2>

        <div className={styles.chipRow} role="group" aria-label="Filter by year">
          <button
            type="button"
            className={styles.chip}
            aria-pressed={selectedYear === 'all'}
            onClick={() => setSelectedYear('all')}
          >
            All
          </button>
          {years.map((year) => (
            <button
              key={year}
              type="button"
              className={styles.chip}
              aria-pressed={selectedYear === year}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>

        <div
          className={styles.scrollArea}
          ref={scrollRef}
          tabIndex={0}
          role="group"
          aria-label="Milestones timeline"
        >
          {filtered.length === 0 ? (
            <p className={styles.empty}>該当なし</p>
          ) : (
            <ul className={`${styles.timeline} ${styles.timelineFade}`} key={selectedYear}>
              {filtered.map((item) => (
                <li key={`${item.date}-${item.title}`} className={styles.item}>
                  <div className={styles.rail} aria-hidden="true">
                    <span className={styles.dot} />
                  </div>
                  <div className={styles.card}>
                    <div className={styles.meta}>
                      <time dateTime={item.date} className={styles.date}>{item.date}</time>
                      {item.tag && <span className={styles.tag}>{item.tag}</span>}
                      {item.inProgress && <span className={styles.badge}>In Progress</span>}
                    </div>
                    <h3 className={styles.title}>{item.title}</h3>
                    <p className={styles.description}>{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
