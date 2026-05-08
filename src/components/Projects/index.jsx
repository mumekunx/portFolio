import { useIsMobile } from '../../hooks/useMediaQuery'
import ProjectsDesktop from './Projects.desktop'
import ProjectsMobile from './Projects.mobile'

export default function Projects() {
  const isMobile = useIsMobile()
  return isMobile ? <ProjectsMobile /> : <ProjectsDesktop />
}
