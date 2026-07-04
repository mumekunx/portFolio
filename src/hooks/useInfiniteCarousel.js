import { useRef, useEffect, useState } from 'react'

// 3セット複製 [...items, ...items, ...items] を並べた無限ループカルーセルの共通ロジック。
// itemCount には複製前(1セットぶん)の件数を渡す。gap はカード間の gap(px)。
// 返り値の trackRef をスクロールコンテナに、scroll(dir) をナビボタンの onClick に渡す。
// activeIndex は現在中央に来ている論理インデックス(0〜itemCount-1、中央セット基準の剰余)。
export function useInfiniteCarousel(itemCount, gap = 32) {
  const trackRef = useRef(null)
  const itemWidthRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)

  // 初期スクロール位置を中央セットの先頭に
  useEffect(() => {
    const track = trackRef.current
    if (!track || itemCount === 0) return

    const positionToMiddle = () => {
      const item = track.children[itemCount] // 中央セットの先頭
      if (!item) return
      itemWidthRef.current = item.offsetWidth + gap
      const itemCenter = item.offsetLeft + item.offsetWidth / 2
      track.scrollTo({ left: itemCenter - track.clientWidth / 2, behavior: 'instant' })
    }

    positionToMiddle()
    window.addEventListener('resize', positionToMiddle)
    return () => window.removeEventListener('resize', positionToMiddle)
  }, [itemCount, gap])

  // スクロールが中央セットの外に出たら、中央セットの同じ相対位置へワープ
  useEffect(() => {
    const track = trackRef.current
    if (!track || itemCount === 0) return

    let raf = null

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const itemW = itemWidthRef.current
        if (!itemW) return
        const middleStart = itemCount * itemW
        const middleEnd = itemCount * 2 * itemW
        // 前セットに入ったら中央セットへ
        if (track.scrollLeft < middleStart - itemW / 2) {
          track.scrollTo({ left: track.scrollLeft + itemCount * itemW, behavior: 'instant' })
        }
        // 後セットに入ったら中央セットへ
        else if (track.scrollLeft > middleEnd - itemW / 2) {
          track.scrollTo({ left: track.scrollLeft - itemCount * itemW, behavior: 'instant' })
        }

        // 現在中央付近にあるアイテムの論理インデックスを算出(中央セット基準の剰余)
        const rawIndex = Math.round(track.scrollLeft / itemW)
        const normalized = ((rawIndex % itemCount) + itemCount) % itemCount
        setActiveIndex((prev) => (prev === normalized ? prev : normalized))
      })
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [itemCount])

  const scroll = (dir) => {
    const track = trackRef.current
    if (!track) return
    const amount = itemWidthRef.current || track.clientWidth * 0.8
    track.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return { trackRef, scroll, activeIndex }
}
