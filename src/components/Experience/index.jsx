import { useIsMobile } from '../../hooks/useMediaQuery'
import ExperienceDesktop from './Experience.desktop'
import ExperienceMobile from './Experience.mobile'

export default function Experience() {
  const isMobile = useIsMobile()
  return isMobile ? <ExperienceMobile /> : <ExperienceDesktop />
}
