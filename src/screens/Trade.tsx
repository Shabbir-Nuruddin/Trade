import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { assetById } from '../data/assets'
import { useStore } from '../state/store'
import { usd, cx } from '../lib/format'
import { RiskBadge } from '../components/RiskBadge'
import { ConvictionCheck } from '../components/ConvictionCheck'

export default function Trade() {
  const { id } = useParams()
  const nav = useNavigate()
  const loc = useLocation()
  const a = id ? assetById(id) : undefined
  const initialSide = (loc.state as { side?: 'buy' | 'sell' })?.side ?? 'buy'

  const cash = useStore((s) => s.cash)
  const buy = useStore((s) => s.buy)
  const sell = useStore((s) => s.sell)
  const owned = useStore((s) => (a ? s.holdingValue(a.id) : 0))

  const [side, setSide] = useState<'buy' | 'sell'>(initialSide)
  const [amount, setAmount] = useState(0)
  const [checking, setChecking] = useState(false)
  const [done, setDone] = useState(false)

  if (!a) return <div className="p-6">Asset not found.</div>

  const max = side === 'buy' ? cash : owned
  const quick = side === 'buy' ? [50, 100, 250, 500] : [25, 50, 100]
  const valid = amount > 0 && amount <= max + 0.01

  function execute() {
    if (side === 'buy') buy(a!.id, amount)
    else sell(a!.id, amount)
    setChecking(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="px-4 pt-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="w-20 h-20 rounded-full bg-accent grid place-items-center text-3xl text-ink-900 shadow-glow"
        >
          ✓
        </motion.div>
        <h2 className="text-xl font-bold mt-4">
          {side === 'buy' ? 'Invested' : 'Sold'} {usd(amount, 0)}
        </h2>
        <p className="text-white/55 mt-1 text-sm">
          {side === 'buy' ? 'Bought' : 'Sold'} {usd(amount, 0)} of {a.symbol}. Your portfolio updated instantly.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-6 w-full">
          <button onClick={() => nav('/portfolio')} className="btn-primary">
            View portfolio
          </button>
          <button onClick={() => nav('/')} className="btn-ghost">
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pt-12 sm:pt-8 space-y-5">
      <header className="flex items-center gap-3">
        <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 grid place-items-center">
          ←
        </button>
        <div>
          <h1 className="text-lg font-bold">{side === 'buy' ? 'Buy' : 'Sell'} {a.symbol}</h1>
          <p className="text-xs text-white/45">{usd(a.price)} · {a.name}</p>
        </div>
      </header>

      {/* Buy/Sell toggle */}
      <div className="flex bg-ink-700/70 rounded-2xl p-1">
        {(['buy', 'sell'] as const).map((s) => (
          <button
            key={s}
            onClick={() => { setSide(s); setAmount(0) }}
            disabled={s === 'sell' && owned <= 0}
            className={cx(
              'flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition',
              side === s ? 'bg-accent text-ink-900' : 'text-white/50',
              s === 'sell' && owned <= 0 && 'opacity-30',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Risk indicator banner */}
      <div className="card p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-white/45">Risk indicator</div>
          <RiskBadge risk={a.risk} className="mt-1" />
        </div>
        <div className="text-right text-xs text-white/45">
          {side === 'buy' ? 'Cash available' : 'You own'}
          <div className="text-white font-semibold text-sm">{usd(max, 0)}</div>
        </div>
      </div>

      {/* Amount */}
      <div className="card p-5 text-center">
        <div className="text-white/45 text-xs mb-1">Amount</div>
        <div className="text-4xl font-extrabold tabular-nums">{usd(amount, 0)}</div>
        <div className="text-xs text-white/40 mt-1">
          ≈ {(amount / a.price).toFixed(a.kind === 'crypto' ? 5 : 3)} {a.symbol}
        </div>
        <div className="flex gap-2 justify-center mt-4 flex-wrap">
          {quick.map((v) => (
            <button
              key={v}
              onClick={() => setAmount(Math.min(v, max))}
              className="chip hover:!bg-white/10"
            >
              {usd(v, 0)}
            </button>
          ))}
          <button onClick={() => setAmount(Math.floor(max))} className="chip hover:!bg-white/10">
            Max
          </button>
        </div>
        <input
          type="range"
          min={0}
          max={Math.max(1, Math.floor(max))}
          value={amount}
          onChange={(e) => setAmount(+e.target.value)}
          className="w-full mt-4 accent-accent"
        />
      </div>

      <button
        onClick={() => setChecking(true)}
        disabled={!valid}
        className={cx('w-full', valid ? 'btn-primary' : 'btn-ghost opacity-40 pointer-events-none')}
      >
        Review {side} →
      </button>
      <p className="text-center text-[11px] text-white/35">
        Every trade passes a quick <b className="text-accent-soft">Conviction Check</b> — so you invest on logic, not impulse.
      </p>

      <AnimatePresence>
        {checking && (
          <ConvictionCheck
            asset={a}
            dollars={amount}
            side={side}
            onConfirm={execute}
            onCancel={() => setChecking(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
