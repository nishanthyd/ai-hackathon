export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-primary/90 px-4 py-10 text-sm text-textMid sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-textLow">EduVision · UNESCO Global Youth Hackathon 2026</p>
          <p className="text-xs text-textMid">Cinematic learning, multilingual literacy, and ethical verification in one platform.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-textMid">
          <a href="/" className="transition hover:text-textHigh">
            Home
          </a>
          <a href="/generate" className="transition hover:text-textHigh">
            Generate
          </a>
          <a href="/learn" className="transition hover:text-textHigh">
            Learn
          </a>
          <a href="/marketplace" className="transition hover:text-textHigh">
            Marketplace
          </a>
        </div>
      </div>
    </footer>
  )
}
