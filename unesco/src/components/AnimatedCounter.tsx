import { useEffect, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  reducedMotion?: boolean
}

export default function AnimatedCounter({ value, suffix = '', reducedMotion = false }: AnimatedCounterProps) {
  const [count, setCount] = useState(reducedMotion ? value : 0)

  useEffect(() => {
    if (reducedMotion) {
      setCount(value)
      return
    }

    let animationFrame = 0
    const duration = 1200
    const start = performance.now()

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick)
      } else {
        setCount(value)
      }
    }

    animationFrame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(animationFrame)
  }, [value, reducedMotion])

  return (
    <span className="text-4xl font-semibold tracking-[-0.04em] text-textHigh sm:text-5xl lg:text-6xl">
      {count}
      {suffix}
    </span>
  )
}
