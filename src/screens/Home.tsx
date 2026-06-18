import { useNavigate } from 'react-router-dom'
import { useStore } from '../state/store'
import { ASSETS, assetById, TRENDING_IDS } from '../data/assets'
import { usd, pct, cx } from '../lib/format'
import { AreaChart, Ring } from '../components/Charts'
import { AssetRow } from '../components/AssetRow'
import { Term } from '../components/MicroLesson'

export default function Home() {
  const nav = useNavigate()
  const name = useStore((s) => s.name)
  const setName = useStore((s) => s.setName)
  const netWorth = useStore((s) => s.netWorth())
  const dayPct = useStore((s) => s.dayChangePct())
  const watchlist = useStore((s) => s.watchlist)
  const holdings = useStore((s) => s.holdings)
  const up = dayPct >= 0
  const dayValue = (netWorth * dayPct) / 100

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = name.split(' ')[0] || 'there'

  // Build a smooth net-worth curve for the hero chart.
  const series = Array.from({ length: 30 }, (_, i) => {
    const t = i / 29
    return netWorth * (0.82 + 0.18 * t + Math.sin(i / 3) * 0.012)
  })

  return (
    <div className="px-4 pt-12 sm:pt-8 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-white/50 text-sm">{greeting}, {firstName} 👋</p>
          <h1 className="text-xl font-bold">Your money</h1>
        </div>
        <button
          onClick={() => { if (confirm('Switch user? This returns to the welcome screen.')) setName('') }}
          title="Switch user"
          className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-soft to-accent grid place-items-center font-bold text-ink-900 uppercase active:scale-95 transition"
        >
          {firstName.charAt(0) || 'A'}
        </button>
      </header>

      {/* Hero portfolio card */}
      <section className="card p-5">
        <p className="text-white/50 text-sm">Total balance</p>
        <div className="flex items-end gap-3">
          <h2 className="text-4xl font-extrabold tabular-nums">{usd(netWorth, 0)}</h2>
        </div>
        <p className={cx('text-sm font-semibold mt-1', up ? 'text-up' : 'text-down')}>
          {up ? '▲' : '▼'} {usd(Math.abs(dayValue), 0)} ({pct(dayPct)}) today
        </p>
        <div className="mt-3 -mx-1">
          <AreaChart data={series} color={up ? '#10b981' : '#f43f5e'} height={120} />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button onClick={() => nav('/discover')} className="btn-primary">
            Invest
          </button>
          <button onClick={() => nav('/portfolio')} className="btn-ghost">
            Portfolio
          </button>
        </div>
      </section>

      {/* Aria insight of the day */}
      <button
        onClick={() => nav('/assistant')}
        className="w-full text-left card p-4 border-accent/20 bg-gradient-to-br from-accent/10 to-transparent"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">✨</span>
          <span className="font-semibold text-accent-soft">Aria · Insight of the day</span>
        </div>
        <p className="text-sm text-white/75 leading-relaxed">
          Your portfolio leans <Term lesson="risk">high-risk</Term> — NVDA is 1 in 4 of your dollars.
          A little <Term lesson="diversify">diversification</Term> could smooth the ride. Tap to see how. →
        </p>
      </button>

      {/* Account performance */}
      <section className="card p-4 flex items-center gap-4">
        <Ring value={Math.min(100, (dayPct + 2) * 25 + 50)} color={up ? '#10b981' : '#f43f5e'}>
          <div>
            <div className="text-lg font-bold leading-none">{pct(dayPct)}</div>
            <div className="text-[10px] text-white/40">today</div>
          </div>
        </Ring>
        <div className="flex-1 space-y-2 text-sm">
          <Stat label="Invested" value={usd(useStore.getState().investedTotal(), 0)} />
          <Stat label="Cash available" value={usd(useStore.getState().cash, 0)} />
          <Stat label="Holdings" value={`${holdings.length} assets`} />
        </div>
      </section>

      {/* Market summary */}
      <section>
        <h3 className="font-semibold mb-2">Markets today</h3>
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {['nvda', 'btc', 'voo', 'tsla', 'eth'].map((id) => {
            const a = assetById(id)!
            const u = a.change24h >= 0
            return (
              <button
                key={id}
                onClick={() => nav(`/asset/${id}`)}
                className="card px-3 py-2.5 min-w-[110px] text-left"
              >
                <div className="text-sm font-semibold">{a.symbol}</div>
                <div className="text-xs text-white/45">{usd(a.price)}</div>
                <div className={cx('text-xs font-medium', u ? 'text-up' : 'text-down')}>{pct(a.change24h)}</div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Watchlist */}
      <section className="card p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold">Watchlist</h3>
          <button onClick={() => nav('/discover')} className="text-xs text-accent-soft font-medium">
            Discover →
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {watchlist.map((id) => {
            const a = assetById(id)
            return a ? <AssetRow key={id} asset={a} /> : null
          })}
        </div>
      </section>

      {/* Recommendations */}
      <section className="card p-4">
        <h3 className="font-semibold mb-1">Picked for you</h3>
        <p className="text-xs text-white/45 mb-1">
          Based on your goals, Aria suggests adding some lower-risk ballast.
        </p>
        <div className="divide-y divide-white/5">
          {['vt', 'vbtlx', 'cost'].map((id) => {
            const a = assetById(id)
            return a ? <AssetRow key={id} asset={a} subtitle={a.summary.slice(0, 38) + '…'} /> : null
          })}
        </div>
      </section>

      <p className="text-center text-[11px] text-white/25 pt-1">
        Trending: {TRENDING_IDS.map((id) => assetById(id)?.symbol).join(' · ')}
      </p>
      <span className="hidden">{ASSETS.length}</span>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/45">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  )
}
