interface FilterSidebarProps {
  subjects: string[]
  grades: string[]
  selectedSubjects: string[]
  selectedGrades: string[]
  selectedTypes: string[]
  onSubjectChange: (subjects: string[]) => void
  onGradeChange: (grades: string[]) => void
  onTypeChange: (types: string[]) => void
  onSellOpen: () => void
}

const contentTypes = ['Notes', 'Video']

export default function FilterSidebar({
  subjects,
  grades,
  selectedSubjects,
  selectedGrades,
  selectedTypes,
  onSubjectChange,
  onGradeChange,
  onTypeChange,
  onSellOpen
}: FilterSidebarProps) {
  const toggle = (value: string, list: string[], setter: (values: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value])
  }

  return (
    <div className="glass-panel rounded-[2rem] border border-white/10 bg-[#0C1528]/95 p-6 shadow-soft backdrop-blur-xl">
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-accent2">Filters</p>
          <h3 className="mt-4 text-xl font-semibold text-textHigh">Refine your search</h3>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-textMid">Subject</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => toggle(subject, selectedSubjects, onSubjectChange)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    selectedSubjects.includes(subject)
                      ? 'border-accent2 bg-accent2/15 text-textHigh'
                      : 'border-white/10 bg-white/5 text-textMid hover:border-accent2 hover:text-textHigh'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-textMid">Grade</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {grades.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => toggle(grade, selectedGrades, onGradeChange)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    selectedGrades.includes(grade)
                      ? 'border-accent2 bg-accent2/15 text-textHigh'
                      : 'border-white/10 bg-white/5 text-textMid hover:border-accent2 hover:text-textHigh'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-textMid">Content type</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggle(type, selectedTypes, onTypeChange)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    selectedTypes.includes(type)
                      ? 'border-accent2 bg-accent2/15 text-textHigh'
                      : 'border-white/10 bg-white/5 text-textMid hover:border-accent2 hover:text-textHigh'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-[#09111E]/95 p-5 text-sm text-textMid">
          <p className="font-semibold text-textHigh">Sell your notes</p>
          <p className="mt-2">List files with a polished form and reach other students in the marketplace.</p>
          <button
            type="button"
            onClick={onSellOpen}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent2 to-accent3 px-4 py-3 text-sm font-semibold text-primary transition hover:scale-[1.01]"
          >
            Start selling
          </button>
        </div>
      </div>
    </div>
  )
}
