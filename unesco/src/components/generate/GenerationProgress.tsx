interface GenerationProgressProps {
  steps: string[]
  currentStep: number
  reducedMotion: boolean
}

export default function GenerationProgress({ steps, currentStep, reducedMotion }: GenerationProgressProps) {
  return (
    <div className={`space-y-6 ${reducedMotion ? 'transition-none' : 'transition-all duration-500'}`}>
      <p className="text-sm uppercase tracking-[0.28em] text-accent2">Generation progress</p>
      <div className="space-y-5">
        {steps.map((step, index) => {
          const active = index < currentStep
          const isCurrent = index === currentStep - 1
          return (
            <div key={step} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-textHigh">{step}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${active ? 'bg-accent2/15 text-accent2' : isCurrent ? 'bg-accent3/15 text-accent3' : 'bg-white/5 text-textMid'}`}>
                  {active ? 'Done' : isCurrent ? 'In progress' : 'Pending'}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent2 to-accent3 transition-all"
                  style={{ width: `${active ? 100 : isCurrent ? 50 : 0}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="rounded-[1.5rem] border border-white/10 bg-[#101A2F]/95 px-4 py-3.5 text-xs leading-5 text-textMid">
        {currentStep === 0
          ? 'Ready to generate your first lesson.'
          : currentStep <= steps.length && currentStep > 0
          ? `Currently ${steps[Math.min(currentStep - 1, steps.length - 1)].toLowerCase()}. Pipeline rendering in progress on server.`
          : 'Generation complete. Your rendered video is ready below.'}
      </div>
    </div>
  )
}
