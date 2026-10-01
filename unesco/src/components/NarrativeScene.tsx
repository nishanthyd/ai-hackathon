interface NarrativeSceneProps {
  title: string
  description: string
}

export default function NarrativeScene({ title, description }: NarrativeSceneProps) {
  return (
    <div className="glass-panel rounded-[2rem] border border-white/10 p-6 shadow-soft backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.32em] text-accent2">Scene</p>
      <h3 className="mt-4 text-xl font-semibold text-textHigh">{title}</h3>
      <p className="mt-3 text-base leading-7 text-textMid">{description}</p>
    </div>
  )
}
