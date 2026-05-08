import { useIsMobile } from '../../hooks/useMediaQuery'
import FooterDesktop from './Footer.desktop'
import FooterMobile from './Footer.mobile'

export default function Footer() {
  const isMobile = useIsMobile()
  return isMobile ? <FooterMobile /> : <FooterDesktop />
}
