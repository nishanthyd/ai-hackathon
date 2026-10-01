interface BrandBadgeProps {
  label: string
}

export default function BrandBadge({ label }: BrandBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-textMid">
      {label}
    </span>
  )
}
