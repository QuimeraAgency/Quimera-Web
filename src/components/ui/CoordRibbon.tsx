interface CoordRibbonProps {
  left: string[]
  right: string[]
  onPaper?: boolean
}

export function CoordRibbon({ left, right, onPaper = false }: CoordRibbonProps) {
  const borderColor = onPaper ? 'border-[var(--rule-paper)]' : 'border-[var(--rule)]'
  const textColor = onPaper ? 'text-[var(--on-bone-3)]' : 'text-ink-300'

  return (
    <div
      className={`flex justify-between items-center py-4 border-t border-b ${borderColor} font-mono text-[11px] tracking-[0.18em] uppercase ${textColor}`}
    >
      <div className="flex gap-5">
        {left.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
      <div className="flex gap-5">
        {right.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  )
}
