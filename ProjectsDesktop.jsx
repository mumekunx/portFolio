import styles from './Projects.module.css'
import { useInfiniteCarousel } from '@/hooks/useInfiniteCarousel'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import projects from '@/lib/projects'

export default function ProjectsDesktop() {
  useScrollReveal()
  const { trackRef, scroll, activeIndex } = useInfiniteCarousel(projects.length, 20)

  return (
    <section className={`section ${styles.projects}`} id="projects">
      <div className="container">
        <p className="section-label">Projects</p>
        <h2 className="section-title">Selected Works</h2>

        <div className={styles.carouselContainer}>
          <button 
            className={styles.prevButton} 
            onClick={() => scroll(-1)}
            aria-label="前のプロジェクト"
          >
            &lt;
          </button>
          
          <div className={styles.grid} ref={trackRef}>
            {projects.map((project) => (
              <div key={project.slug} className={styles.card}>
                <div className={styles.cardImage}>
                  <img src={project.image} alt={project.title} />
                </div>
                <div className={styles.cardContent}>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className={styles.tags}>
                    {project.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className={styles.nextButton} 
            onClick={() => scroll(1)}
            aria-label="次のプロジェクト"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  )
}
