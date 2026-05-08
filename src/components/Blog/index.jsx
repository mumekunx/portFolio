import { useIsMobile } from '../../hooks/useMediaQuery'
import BlogDesktop from './Blog.desktop'
import BlogMobile from './Blog.mobile'

export default function Blog() {
  const isMobile = useIsMobile()
  return isMobile ? <BlogMobile /> : <BlogDesktop />
}
