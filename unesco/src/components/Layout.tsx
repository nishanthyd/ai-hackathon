import type { ReactNode } from 'react'
import NavBar from './layout/NavBar'
import Footer from './layout/Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-deepCharcoal text-textHigh">
      <a className="sr-only focus:not-sr-only" href="#home">
        Skip to content
      </a>
      <NavBar />
      <main className="relative isolate overflow-hidden px-6 py-8 md:px-10 lg:px-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}
