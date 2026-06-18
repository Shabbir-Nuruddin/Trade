import { useNavigate } from 'react-router-dom'
import { useStore, riskScore, diversificationScore } from '../state/store'
import { assetById, GOALS } from '../data/assets'
import { usd, pct, cx } from '../lib/format'
import { Donut, Ring } from '../components/Charts'
import { Term } from '../components/MicroLesson'

const SECTOR_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4', '#a3e635', '#f43f5e']

export default function Portfolio() {
  const nav = useNavigate()
  const holdings = useStore((s) => s.holdings)
  const invested = useStore((s) => s.investedTotal())
  const cash = useStore((s) => s.cash)
  const netWorth = useStore((s) => s.netWorth())

  const risk = riskScore(holdings)
  const diversification = diversificationScore(holdings)

  // Allocation by sector
  const bySector: Record<string, number> = {}
  for (const h of holdings) {
    const a = assetById(h.assetId)
    if (!a) continue
    bySector[a.sector] = (bySector[a.sector] || 0) + h.shares * a.price
  }
  const segments = Object.entries(bySector)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({ label, value, color: SECTOR_COLORS[i % SECTOR_COLORS.length] }))

  // total gain/loss
  const totalCost = holdings.reduce((s, h) => s + h.avgCost * h.shares, 0)
  const gain = invested - totalCost
  const gainPct = totalCost ? (gain / totalCost) * 100 : 0

  return (
    <div className="px-4 pt-12 sm:pt-8 space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <p className="text-white/50 text-sm">Track your long-term progress</p>
      </header>

      <section className="card p-5">
        <p className="text-white/50 text-sm">Net worth</p>
        <h2 className="text-3xl font-extrabold tabular-nums">{usd(netWorth, 0)}</h2>
        <p className={cx('text-sm font-semibold', gain >= 0 ? 'text-up' : 'text-down')}>
          {gain >= 0 ? '▲' : '▼'} {usd(Math.abs(gain), 0)} ({pct(gainPct)}) all time
        </p>
        <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
          <div className="bg-white/5 rounded-2xl p-3">
            <div className="text-white/45 text-xs">Invested</div>
            <div className="font-semibold">{usd(invested, 0)}</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3">
            <div className="text-white/45 text-xs">Cash</div>
            <div className="font-semibold">{usd(cash, 0)}</div>
          </div>
        </div>
      </section>

      {/* Health scores */}
      <section className="grid grid-cols-2 gap-3">
        <div className="card p-4 flex flex-col items-center">
          <Ring value={diversification} size={84} color="#10b981">
            <div className="text-lg font-bold">{diversification}</div>
          </Ring>
          <div className="text-sm font-semibold mt-2">
            <Term lesson="diversify">Diversification</Term>
          </div>
          <div className="text-[11px] text-white/40 text-center">
            {diversification >= 65 ? 'Well spread out' : diversification >= 40 ? 'Could spread more' : 'Concentrated'}
          </div>
        </div>
        <div className="card p-4 flex flex-col items-center">
          <Ring value={risk} size={84} color={risk > 66 ? '#f43f5e' : risk > 40 ? '#f59e0b' : '#10b981'}>
            <div className="text-lg font-bold">{risk}</div>
          </Ring>
          <div className="text-sm font-semibold mt-2">
            <Term lesson="risk">Risk level</Term>
          </div>
          <div className="text-[11px] text-white/40 text-center">
            {risk > 66 ? 'Aggressive' : risk > 40 ? 'Balanced' : 'Conservative'}
          </div>
        </div>
      </section>

      {/* Aria nudge */}
      <button
        onClick={() => nav('/assistant')}
        className="w-full text-left card p-4 border-accent/15 bg-gradient-to-br from-accent/10 to-transparent"
      >
        <div className="text-sm">
          <span className="text-accent-soft font-semibold">✨ Aria: </span>
          {risk > 66
            ? 'Your mix is aggressive. Adding a bond fund (VBTLX) or VOO would lower risk without killing returns.'
            : 'Nice balance. Keep investing on a schedule and let compounding do the work.'}
        </div>
      </button>

      {/* Allocation donut */}
      <section className="card p-4">
        <h3 className="font-semibold mb-3">Asset allocation</h3>
        <div className="flex items-center gap-4">
          <Donut segments={segments} />
          <div className="flex-1 space-y-1.5">
            {segments.map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                <span className="flex-1 text-white/70 truncate">{s.label}</span>
                <span className="font-semibold">{Math.round((s.value / invested) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Holdings */}
      <section className="card p-4">
        <h3 className="font-semibold mb-1">Holdings</h3>
        <div className="divide-y divide-white/5">
          {holdings.map((h) => {
            const a = assetById(h.assetId)
            if (!a) return null
            const value = h.shares * a.price
            const g = value - h.avgCost * h.shares
            const gp = (g / (h.avgCost * h.shares)) * 100
            return (
              <button
                key={h.assetId}
                onClick={() => nav(`/asset/${h.assetId}`)}
                className="w-full flex items-center justify-between py-3 active:opacity-70"
              >
                <div className="text-left">
                  <div className="font-semibold">{a.symbol}</div>
                  <div className="text-xs text-white/45">
                    {h.shares.toFixed(a.kind === 'crypto' ? 4 : 2)} @ {usd(a.price)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold tabular-nums">{usd(value, 0)}</div>
                  <div className={cx('text-xs font-medium', g >= 0 ? 'text-up' : 'text-down')}>
                    {pct(gp)}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Goals */}
      <section className="card p-4">
        <h3 className="font-semibold mb-3">Long-term goals</h3>
        <div className="space-y-4">
          {GOALS.map((goal) => {
            const p = Math.min(100, (goal.current / goal.target) * 100)
            return (
              <div key={goal.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{goal.emoji} {goal.title}</span>
                  <span className="text-white/50">
                    {usd(goal.current, 0)} / {usd(goal.target, 0)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-soft to-accent"
                    style={{ width: `${p}%`, transition: 'width 0.7s ease' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
