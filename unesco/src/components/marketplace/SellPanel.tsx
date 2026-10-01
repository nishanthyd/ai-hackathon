import { useState } from 'react'

interface SellPanelProps {
  open: boolean
  onClose: () => void
  reducedMotion: boolean
}

export default function SellPanel({ open, onClose, reducedMotion }: SellPanelProps) {
  const [form, setForm] = useState({ title: '', subject: 'Mathematics', grade: '7', price: '10', file: '' })
  const [submitted, setSubmitted] = useState(false)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 px-4 py-10 backdrop-blur-sm">
      <div className={`mx-auto max-w-md rounded-[2rem] border border-white/10 bg-[#09111E]/95 p-6 shadow-soft backdrop-blur-xl sm:p-8 ${
        reducedMotion ? 'transition-none' : 'transition-transform duration-300 ease-out'
      }`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-accent2">Sell your notes</p>
            <h2 className="mt-3 text-3xl font-semibold text-textHigh">List a resource in minutes</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-textHigh transition hover:border-accent2 hover:text-accent2"
          >
            Close
          </button>
        </div>

        <div className="mt-7 space-y-5">
          <label className="block text-sm font-medium text-textHigh">
            Title
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="mt-3 w-full rounded-[1.5rem] border border-white/10 bg-[#0D1B31]/90 px-4 py-3 text-textHigh outline-none transition focus:border-accent2 focus:ring-2 focus:ring-accent2/20"
              placeholder="e.g. Verified climate action study guide"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-textHigh">
              Subject
              <select
                value={form.subject}
                onChange={(event) => setForm({ ...form, subject: event.target.value })}
                className="mt-3 w-full rounded-[1.5rem] border border-white/10 bg-[#0D1B31]/90 px-4 py-3 text-textHigh outline-none transition focus:border-accent2 focus:ring-2 focus:ring-accent2/20"
              >
                <option>Mathematics</option>
                <option>Science</option>
                <option>Social Studies</option>
                <option>Languages</option>
                <option>Arts</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-textHigh">
              Grade
              <select
                value={form.grade}
                onChange={(event) => setForm({ ...form, grade: event.target.value })}
                className="mt-3 w-full rounded-[1.5rem] border border-white/10 bg-[#0D1B31]/90 px-4 py-3 text-textHigh outline-none transition focus:border-accent2 focus:ring-2 focus:ring-accent2/20"
              >
                <option>3</option>
                <option>5</option>
                <option>7</option>
                <option>9</option>
                <option>11</option>
              </select>
            </label>
          </div>
          <label className="block text-sm font-medium text-textHigh">
            Price ($)
            <input
              type="text"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
              className="mt-3 w-full rounded-[1.5rem] border border-white/10 bg-[#0D1B31]/90 px-4 py-3 text-textHigh outline-none transition focus:border-accent2 focus:ring-2 focus:ring-accent2/20"
            />
          </label>
          <label className="block text-sm font-medium text-textHigh">
            File title
            <input
              type="text"
              value={form.file}
              onChange={(event) => setForm({ ...form, file: event.target.value })}
              className="mt-3 w-full rounded-[1.5rem] border border-white/10 bg-[#0D1B31]/90 px-4 py-3 text-textHigh outline-none transition focus:border-accent2 focus:ring-2 focus:ring-accent2/20"
              placeholder="e.g. climate-study-notes.pdf"
            />
          </label>

          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="w-full rounded-full bg-gradient-to-r from-accent2 to-accent3 px-5 py-4 text-sm font-semibold text-primary transition hover:scale-[1.01]"
          >
            Submit listing
          </button>

          {submitted ? (
            <div className="rounded-[1.75rem] border border-accent2/20 bg-accent2/10 p-5 text-sm text-textHigh">
              <p className="font-semibold">Listing submitted</p>
              <p className="mt-2 text-textMid">Your resource is now ready for review in the mock marketplace inventory.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
