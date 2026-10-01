interface SubjectGridProps {
  subjects: { id: string; label: string; color: string; icon: string }[]
  selected: string
  onSelect: (subject: string) => void
  reducedMotion: boolean
}

export default function SubjectGrid({ subjects, selected, onSelect, reducedMotion }: SubjectGridProps) {
  return (
    <section aria-label="Subject grid" className="space-y-6">
      <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0B1221]/95 p-6 shadow-soft backdrop-blur-xl">
        <h2 className="text-3xl font-semibold text-textHigh">Choose a subject</h2>
        <p className="mt-3 text-base leading-7 text-textMid">Browse curated subject areas and start a structured learning path with contextual lesson previews.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject, index) => (
          <button
            type="button"
            key={subject.id}
            onClick={() => onSelect(subject.id)}
            style={reducedMotion ? undefined : { transitionDelay: `${index * 80}ms` }}
            className={`group rounded-[2rem] border p-8 text-left ${
              selected === subject.id
                ? 'border-accent2/40 bg-gradient-to-br from-accent2/10 to-transparent shadow-glow'
                : 'border-white/10 bg-[#0B1221]/95 hover:border-accent2/30 hover:bg-white/5'
            } ${reducedMotion ? '' : 'transition-all duration-300'}`}
          >
            <div className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${subject.color} text-2xl text-primary shadow-glow`}>{subject.icon}</div>
            <h3 className="mt-5 text-xl font-semibold text-textHigh">{subject.label}</h3>
            <p className="mt-3 text-sm leading-7 text-textMid">Explore interactive lessons, grade-specific modules, and peer-ready previews.</p>
          </button>
        ))}
      </div>
    </section>
  )
}
