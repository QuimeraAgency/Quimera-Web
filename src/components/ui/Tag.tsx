export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-semibold tracking-[0.08em] uppercase border rounded-full text-ink-300 border-[var(--rule)] font-title"
      style={{ fontFamily: 'var(--font-title)' }}
    >
      {children}
    </span>
  )
}
