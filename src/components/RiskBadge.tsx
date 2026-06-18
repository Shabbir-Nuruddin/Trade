import type { Risk } from '../data/types'
import { cx } from '../lib/format'

const map: Record<Risk, { cls: string; dot: string }> = {
  Low: { cls: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
  Medium: { cls: 'text-amber-300 bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
  High: { cls: 'text-rose-300 bg-rose-500/10 border-rose-500/20', dot: 'bg-rose-400' },
}

export function RiskBadge({ risk, className }: { risk: Risk; className?: string }) {
  const m = map[risk]
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border',
        m.cls,
        className,
      )}
    >
      <span className={cx('w-1.5 h-1.5 rounded-full', m.dot)} />
      {risk} risk
    </span>
  )
}
