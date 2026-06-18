import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Asset } from '../data/types'
import { convictionPrompts } from '../ai/aria'
import { usd } from '../lib/format'

/**
 * The signature behavioral guardrail. Before any trade executes, Aria surfaces
 * the real risks and makes the user articulate their thesis. Impulsive trades
 * get a calmer second option; thoughtful ones sail through.
 */
export function ConvictionCheck({
  asset,
  dollars,
  side,
  onConfirm,
  onCancel,
}: {
  asset: Asset
  dollars: number
  side: 'buy' | 'sell'
  onConfirm: () => void
  onCancel: () => void
}) {
  const { risks, question } = convictionPrompts(asset, dollars, side)
  const [thesis, setThesis] = useState('')
  const impulsive = asset.risk === 'High' && side === 'buy'
  const weak = thesis.trim().length > 0 && thesis.trim().length < 12
  const ready = thesis.trim().length >= 12

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        className="relative w-full max-w-[420px] bg-ink-800 rounded-t-3xl sm:rounded-3xl border border-white/10 p-5 m-0 sm:m-3 max-h-[88%] overflow-y-auto no-scrollbar"
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        exit={{ y: 60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="w-10 h-1 rounded-full bg-white/15 mx-auto mb-4 sm:hidden" />

        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🛡️</span>
          <h3 className="font-bold text-lg">Conviction Check</h3>
        </div>
        <p className="text-sm text-white/55">
          A 10-second gut check before you {side} {usd(dollars, 0)} of {asset.symbol}.
        </p>

        {/* Risk simulation */}
        <div className="card p-4 mt-4 border-amber-500/20 bg-amber-500/5">
          <div className="text-amber-300 text-sm font-semibold mb-2">What could go wrong</div>
          <ul className="space-y-2">
            {risks.map((r, i) => (
              <li key={i} className="text-sm text-white/75 flex gap-2">
                <span className="text-amber-400">•</span>
                {r}
              </li>
            ))}
          </ul>
          {side === 'buy' && (
            <div className="mt-3 pt-3 border-t border-white/5 text-xs text-white/55">
              If {asset.symbol} dropped 25%, this position would be worth{' '}
              <span className="text-rose-300 font-semibold">{usd(dollars * 0.75, 0)}</span> — could you hold
              through that without panic-selling?
            </div>
          )}
        </div>

        {/* Thesis */}
        <div className="mt-4">
          <label className="text-sm font-medium">{question}</label>
          <textarea
            value={thesis}
            onChange={(e) => setThesis(e.target.value)}
            rows={2}
            placeholder="e.g. Long-term bet on AI demand, money I won't need for 5+ years…"
            className="w-full mt-2 bg-ink-700 border border-white/10 rounded-2xl p-3 text-sm outline-none focus:border-accent/40 resize-none"
          />
          {weak && (
            <p className="text-xs text-amber-300 mt-1">
              That’s a bit thin — a clear reason now protects you from a rash decision later.
            </p>
          )}
        </div>

        {impulsive && (
          <div className="card p-3 mt-3 text-xs text-white/65 border-accent/20 bg-accent/5">
            ✨ Aria: This is a high-risk, impulsive-looking buy. A calmer alternative: invest the same{' '}
            {usd(dollars, 0)} into <b>VOO</b> for instant diversification, or start with half.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button onClick={onCancel} className="btn-ghost">
            Rethink
          </button>
          <button
            onClick={onConfirm}
            disabled={!ready}
            className={ready ? 'btn-primary' : 'btn-ghost opacity-40 pointer-events-none'}
          >
            I’m confident · {side === 'buy' ? 'Buy' : 'Sell'}
          </button>
        </div>
        <p className="text-center text-[10px] text-white/30 mt-2">
          Aria never blocks a thoughtful trade — it just makes sure it’s thoughtful.
        </p>
      </motion.div>
    </motion.div>
  )
}
