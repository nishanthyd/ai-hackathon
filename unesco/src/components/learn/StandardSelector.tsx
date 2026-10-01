interface StandardSelectorProps {
  grades: number[]
  selectedGrade: number
  onSelectGrade: (grade: number) => void
}

export default function StandardSelector({ grades, selectedGrade, onSelectGrade }: StandardSelectorProps) {
  return (
    <div className="mt-8 space-y-4">
      <p className="text-sm uppercase tracking-[0.28em] text-textMid">Grade level</p>
      <div className="flex flex-wrap gap-3">
        {grades.map((grade) => (
          <button
            key={grade}
            type="button"
            onClick={() => onSelectGrade(grade)}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              grade === selectedGrade
                ? 'bg-accent2 text-primary shadow-glow'
                : 'bg-white/5 text-textLow hover:bg-white/10 hover:text-textHigh'
            }`}
          >
            Grade {grade}
          </button>
        ))}
      </div>
    </div>
  )
}
