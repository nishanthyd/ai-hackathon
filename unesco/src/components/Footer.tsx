export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-primary/90 px-4 py-10 text-sm text-textMid sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-textLow">EduVision · UNESCO Global Youth Hackathon 2026</p>
          <p className="text-xs text-textMid">Built for inclusive cultural learning, media literacy, and sustainable community storytelling.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-textMid">
          <a href="#home" className="transition hover:text-textHigh">
            Home
          </a>
          <a href="#impact" className="transition hover:text-textHigh">
            Impact
          </a>
          <a href="#contact" className="transition hover:text-textHigh">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
