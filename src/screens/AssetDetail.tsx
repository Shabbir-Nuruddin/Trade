import { useParams, useNavigate } from 'react-router-dom'
import { assetById } from '../data/assets'
import { useStore } from '../state/store'
import { usd, pct, cx } from '../lib/format'
import { AreaChart } from '../components/Charts'
import { RiskBadge } from '../components/RiskBadge'
import { Term } from '../components/MicroLesson'

export default function AssetDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const a = id ? assetById(id) : undefined
  const watchlist = useStore((s) => s.watchlist)
  const toggleWatch = useStore((s) => s.toggleWatch)
  const holdingValue = useStore((s) => (a ? s.holdingValue(a.id) : 0))

  if (!a) return <div className="p-6">Asset not found.</div>
  const up = a.change24h >= 0
  const watched = watchlist.includes(a.id)

  return (
    <div className="px-4 pt-12 sm:pt-8 space-y-5">
      <header className="flex items-center justify-between">
        <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 grid place-items-center">
          ←
        </button>
        <button
          onClick={() => toggleWatch(a.id)}
          className={cx('w-9 h-9 rounded-full grid place-items-center', watched ? 'bg-accent/20 text-accent-soft' : 'bg-white/5')}
        >
          {watched ? '★' : '☆'}
        </button>
      </header>

      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{a.symbol}</h1>
          <RiskBadge risk={a.risk} />
        </div>
        <p className="text-white/50">{a.name} · {a.sector}</p>
      </div>

      <div className="card p-5">
        <div className="text-3xl font-extrabold tabular-nums">{usd(a.price)}</div>
        <div className={cx('text-sm font-semibold', up ? 'text-up' : 'text-down')}>
          {up ? '▲' : '▼'} {pct(a.change24h)} today
        </div>
        <div className="mt-3 -mx-1">
          <AreaChart data={a.spark} color={up ? '#10b981' : '#f43f5e'} />
        </div>
      </div>

      {/* Plain-language summary — Aria */}
      <div className="card p-4 border-accent/15 bg-gradient-to-br from-accent/10 to-transparent">
        <div className="flex items-center gap-2 mb-1">
          <span>✨</span>
          <span className="font-semibold text-accent-soft text-sm">In plain English</span>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">{a.summary}</p>
        <button
          onClick={() => nav('/assistant', { state: { prompt: `Tell me more about ${a.symbol}` } })}
          className="text-xs text-accent-soft font-medium mt-2"
        >
          Ask Aria to explain this →
        </button>
      </div>

      {/* Key stats with contextual lessons */}
      <div className="card p-4">
        <h3 className="font-semibold mb-3">Key stats</h3>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          {a.marketCap && <Stat label="Market cap" value={a.marketCap} />}
          {a.peRatio != null && (
            <Stat label={<Term lesson="pe">P/E ratio</Term>} value={a.peRatio.toString()} />
          )}
          {a.dividend != null && (
            <Stat label={<Term lesson="compounding">Dividend</Term>} value={`${a.dividend}%`} />
          )}
          <Stat label={<Term lesson="risk">Risk</Term>} value={a.risk} />
          {holdingValue > 0 && <Stat label="You own" value={usd(holdingValue, 0)} />}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {a.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      </div>

      {/* sticky-ish trade buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => nav(`/trade/${a.id}`, { state: { side: 'buy' } })} className="btn-primary">
          Buy
        </button>
        <button
          onClick={() => nav(`/trade/${a.id}`, { state: { side: 'sell' } })}
          className={cx('btn-ghost', holdingValue <= 0 && 'opacity-40 pointer-events-none')}
        >
          Sell
        </button>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: React.ReactNode; value: string }) {
  return (
    <div>
      <div className="text-white/45 text-xs">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  )
}
