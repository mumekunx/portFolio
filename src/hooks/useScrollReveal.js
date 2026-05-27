import { useEffect } from 'react'

export function useScrollReveal(selector = '.fade-in') {
  useEffect(() => {
    const elements = document.querySelectorAll(selector)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 表示状態にするだけ（unobserve しない）。
          // HMR で className がリセットされても、再マウント時に
          // observe し直せば画面内の要素は再度 visible が付く。
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    elements.forEach((el) => {
      // 既に画面内にある要素はその場で表示（再マウント直後の取りこぼし防止）
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible')
      }
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [selector])
}
