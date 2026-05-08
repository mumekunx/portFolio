import { useIsMobile } from '../../hooks/useMediaQuery'
import HeroDesktop from './Hero.desktop'
import HeroMobile from './Hero.mobile'

export default function Hero() {
  const isMobile = useIsMobile()
  return isMobile ? <HeroMobile /> : <HeroDesktop />
}
