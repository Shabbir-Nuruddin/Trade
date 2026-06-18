import { useNavigate } from 'react-router-dom'
import type { Asset } from '../data/types'
import { usd, pct, cx } from '../lib/format'
import { Sparkline } from './Charts'

const kindEmoji: Record<Asset['kind'], string> = {
  stock: '🏢', etf: '🧺', crypto: '⚡', mutual: '🏦',
}

export function AssetRow({ asset, subtitle }: { asset: Asset; subtitle?: string }) {
  const nav = useNavigate()
  const up = asset.change24h >= 0
  return (
    <button
      onClick={() => nav(`/asset/${asset.id}`)}
      className="w-full flex items-center gap-3 py-3 active:opacity-70 transition"
    >
      <div className="w-10 h-10 rounded-2xl bg-white/5 grid place-items-center text-lg shrink-0">
        {kindEmoji[asset.kind]}
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="font-semibold leading-tight">{asset.symbol}</div>
        <div className="text-xs text-white/45 truncate">{subtitle ?? asset.name}</div>
      </div>
      <Sparkline data={asset.spark} color={up ? '#22c55e' : '#f43f5e'} />
      <div className="text-right shrink-0 w-[78px]">
        <div className="font-semibold tabular-nums">{usd(asset.price)}</div>
        <div className={cx('text-xs font-medium tabular-nums', up ? 'text-up' : 'text-down')}>
          {pct(asset.change24h)}
        </div>
      </div>
    </button>
  )
}
