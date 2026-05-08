import { useIsMobile } from '../../hooks/useMediaQuery'
import ContactDesktop from './Contact.desktop'
import ContactMobile from './Contact.mobile'

export default function Contact() {
  const isMobile = useIsMobile()
  return isMobile ? <ContactMobile /> : <ContactDesktop />
}
