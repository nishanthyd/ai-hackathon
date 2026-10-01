interface SectionHeadingProps {
  eyebrow: string
  title: string
  description: string
}

export default function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent2">{eyebrow}</p>
      <h2 className="text-3xl font-semibold leading-tight text-textHigh sm:text-4xl lg:text-5xl">{title}</h2>
      <p className="text-base leading-8 text-textMid sm:text-lg">{description}</p>
    </div>
  )
}
