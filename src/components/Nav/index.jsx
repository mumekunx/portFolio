import { useIsMobile } from '../../hooks/useMediaQuery'
import NavDesktop from './Nav.desktop'
import NavMobile from './Nav.mobile'

export default function Nav() {
  const isMobile = useIsMobile()
  return isMobile ? <NavMobile /> : <NavDesktop />
}
