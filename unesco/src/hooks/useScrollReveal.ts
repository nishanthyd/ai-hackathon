import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal() {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const elements = Array.from(ref.current.querySelectorAll<HTMLElement>('[data-reveal]'))

    elements.forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 92%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })
  }, [])

  return ref
}
