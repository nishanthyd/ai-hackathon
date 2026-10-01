import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { MotionProps } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

export const motionVariants = {
  pageTransition: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.85 } }
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.85 } }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.15
      }
    }
  }
}

export const scrollReveal = {
  fadeUp(target: string | Element) {
    gsap.fromTo(
      target,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: target,
          start: 'top 92%',
          end: 'bottom 40%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  },
  pinSection(target: string | Element) {
    ScrollTrigger.create({
      trigger: target,
      start: 'top top',
      end: 'bottom top',
      pin: true,
      pinSpacing: false
    })
  }
}

export type MotionVariantProps = MotionProps
