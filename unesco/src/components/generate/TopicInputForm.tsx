interface TopicInputFormProps {
  form: { topic: string; language: string; grade: string }
  errors: Record<string, string>
  onChange: (values: { topic: string; language: string; grade: string }) => void
  onSubmit: () => void
  isSubmitting: boolean
}

const languages = [
  'English',
  'Spanish',
  'French',
  'Arabic',
  'Swahili',
  'Hindi',
  'Kannada',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Punjabi'
]
const explanationLevels = ['Simple', 'Moderate', 'Detailed']

export default function TopicInputForm({ form, errors, onChange, onSubmit, isSubmitting }: TopicInputFormProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-accent2">Create a video lesson</p>
        <h2 className="mt-3 text-3xl font-semibold text-textHigh">Design the lesson prompt</h2>
        <p className="mt-3 text-base leading-7 text-textMid">
          Enter a topic and choose the language and explanation depth for your AI video lesson.
        </p>
      </div>

      <div className="space-y-6">
        <label className="block text-sm font-medium text-textHigh">
          Topic or concept
          <textarea
            value={form.topic}
            onChange={(event) => onChange({ ...form, topic: event.target.value })}
            rows={5}
            className="mt-3 w-full rounded-[1.5rem] border border-white/10 bg-[#0D1B31]/90 px-5 py-4 text-textHigh outline-none transition focus:border-accent2 focus:ring-2 focus:ring-accent2/20"
            placeholder="e.g. renewable energy verification for middle school students"
          />
        </label>
        {errors.topic ? <p className="text-sm text-rose-400">{errors.topic}</p> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-textHigh">
            Primary language
            <select
              value={form.language}
              onChange={(event) => onChange({ ...form, language: event.target.value })}
              className="mt-3 w-full rounded-[1.5rem] border border-white/10 bg-[#0D1B31]/90 px-4 py-3 text-textHigh outline-none transition focus:border-accent2 focus:ring-2 focus:ring-accent2/20"
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-textHigh">
            Explanation depth
            <select
              value={form.grade}
              onChange={(event) => onChange({ ...form, grade: event.target.value })}
              className="mt-3 w-full rounded-[1.5rem] border border-white/10 bg-[#0D1B31]/90 px-4 py-3 text-textHigh outline-none transition focus:border-accent2 focus:ring-2 focus:ring-accent2/20"
            >
              {explanationLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-textMid">
            Generates a full educational video with lesson plan, TTS narration, and rendered Manim animations.
          </p>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent2 to-accent3 px-6 py-3 text-sm font-semibold text-primary transition enabled:hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Generating video...' : 'Generate lesson video'}
          </button>
        </div>
      </div>
    </div>
  )
}
