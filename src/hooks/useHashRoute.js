import { useEffect, useState } from 'react'

export function useHashRoute() {
  const [hash, setHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''
  )

  useEffect(() => {
    const onChange = () => setHash(window.location.hash.replace('#', ''))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = (h) => {
    window.location.hash = h
  }

  const reset = () => {
    history.pushState('', document.title, window.location.pathname + window.location.search)
    setHash('')
  }

  // #blog/<slug> なら記事詳細
  const blogSlug = hash.startsWith('blog/') ? hash.slice('blog/'.length) : null

  return { hash, navigate, reset, blogSlug }
}
