import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ASSETS, COLLECTIONS, TRENDING_IDS, assetById } from '../data/assets'
import type { AssetKind } from '../data/types'
import { AssetRow } from '../components/AssetRow'
import { cx, pct } from '../lib/format'

const filters: { key: AssetKind | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'stock', label: 'Stocks' },
  { key: 'etf', label: 'ETFs' },
  { key: 'crypto', label: 'Crypto' },
  { key: 'mutual', label: 'Mutual funds' },
]

export default function Discover() {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [kind, setKind] = useState<AssetKind | 'all'>('all')

  const results = useMemo(() => {
    return ASSETS.filter((a) => {
      const matchKind = kind === 'all' || a.kind === kind
      const matchQ =
        !q ||
        a.symbol.toLowerCase().includes(q.toLowerCase()) ||
        a.name.toLowerCase().includes(q.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()))
      return matchKind && matchQ
    })
  }, [q, kind])

  return (
    <div className="px-4 pt-12 sm:pt-8 space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Discover</h1>
        <p className="text-white/50 text-sm">Find your next investment</p>
      </header>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">🔍</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search stocks, ETFs, crypto, themes…"
          className="w-full bg-ink-700/70 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm outline-none focus:border-accent/40"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setKind(f.key)}
            className={cx(
              'chip whitespace-nowrap',
              kind === f.key && '!bg-accent !text-ink-900 !border-accent font-semibold',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!q && kind === 'all' && (
        <>
          {/* Trending */}
          <section>
            <h3 className="font-semibold mb-2">🔥 Trending now</h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1">
              {TRENDING_IDS.map((id) => {
                const a = assetById(id)!
                const u = a.change24h >= 0
                return (
                  <button
                    key={id}
                    onClick={() => nav(`/asset/${id}`)}
                    className="card p-3 min-w-[140px] text-left"
                  >
                    <div className="text-sm font-bold">{a.symbol}</div>
                    <div className="text-[11px] text-white/45 truncate">{a.name}</div>
                    <div className={cx('text-sm font-semibold mt-2', u ? 'text-up' : 'text-down')}>
                      {pct(a.change24h)}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Curated collections */}
          <section>
            <h3 className="font-semibold mb-2">Curated collections</h3>
            <div className="grid grid-cols-2 gap-3">
              {COLLECTIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setQ(c.assetIds.length ? assetById(c.assetIds[0])!.tags[0] : '')}
                  className="card p-4 text-left active:scale-[0.98] transition"
                >
                  <div className="text-2xl">{c.emoji}</div>
                  <div className="font-semibold mt-1 text-sm">{c.title}</div>
                  <div className="text-[11px] text-white/45">{c.blurb}</div>
                  <div className="text-[10px] text-accent-soft mt-1">{c.assetIds.length} assets →</div>
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Results list */}
      <section className="card p-4">
        <h3 className="font-semibold mb-1">
          {q || kind !== 'all' ? `${results.length} results` : 'All assets'}
        </h3>
        <div className="divide-y divide-white/5">
          {results.map((a) => (
            <AssetRow key={a.id} asset={a} subtitle={`${a.sector} · ${a.risk} risk`} />
          ))}
          {results.length === 0 && (
            <p className="text-sm text-white/40 py-6 text-center">
              No matches. Try “AI”, “clean energy”, or “dividend”.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
