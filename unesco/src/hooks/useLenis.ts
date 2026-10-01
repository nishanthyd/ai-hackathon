import { useEffect, useState } from 'react'
import Lenis from 'lenis'

export function useLenis() {
  const [lenis, setLenis] = useState<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const instance = new Lenis({
      duration: 1.6,
      lerp: 0.09,
      gestureOrientation: 'vertical'
    })

    let frameId = 0

    const raf = (time: number) => {
      instance.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)
    setLenis(instance)

    return () => {
      cancelAnimationFrame(frameId)
      instance.destroy()
    }
  }, [])

  return lenis
}
