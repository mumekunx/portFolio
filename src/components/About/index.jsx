import { useIsMobile } from '../../hooks/useMediaQuery'
import AboutDesktop from './About.desktop'
import AboutMobile from './About.mobile'

export default function About() {
  const isMobile = useIsMobile()
  return isMobile ? <AboutMobile /> : <AboutDesktop />
}
