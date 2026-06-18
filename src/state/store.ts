import { create } from 'zustand'
import type { Holding, Risk } from '../data/types'
import { ASSETS, assetById } from '../data/assets'

export interface ChatMessage {
  role: 'user' | 'aria'
  text: string
  basket?: { assetId: string; weight: number }[]
}

interface AppState {
  name: string
  cash: number
  holdings: Holding[]
  watchlist: string[]
  lessonsDone: string[]
  chat: ChatMessage[]

  setName: (name: string) => void
  buy: (assetId: string, dollars: number) => void
  sell: (assetId: string, dollars: number) => void
  toggleWatch: (assetId: string) => void
  markLesson: (id: string) => void
  pushChat: (m: ChatMessage) => void

  holdingValue: (assetId: string) => number
  investedTotal: () => number
  netWorth: () => number
  dayChangePct: () => number
}

const initialHoldings: Holding[] = [
  { assetId: 'voo', shares: 14, avgCost: 452 },
  { assetId: 'aapl', shares: 18, avgCost: 188 },
  { assetId: 'nvda', shares: 4, avgCost: 720 },
  { assetId: 'btc', shares: 0.06, avgCost: 58000 },
  { assetId: 'icln', shares: 60, avgCost: 15.1 },
]

const savedName = typeof localStorage !== 'undefined' ? localStorage.getItem('aria.name') || '' : ''

export const useStore = create<AppState>((set, get) => ({
  name: savedName,
  cash: 2500,
  holdings: initialHoldings,
  watchlist: ['nvda', 'tsla', 'btc', 'msft'],
  lessonsDone: ['compounding'],
  chat: [],

  setName: (name) => {
    const clean = name.trim().slice(0, 24)
    try {
      localStorage.setItem('aria.name', clean)
    } catch {
      /* ignore */
    }
    set({ name: clean })
  },

  buy: (assetId, dollars) => {
    const a = assetById(assetId)
    if (!a || dollars <= 0) return
    set((s) => {
      const spend = Math.min(dollars, s.cash)
      const shares = spend / a.price
      const existing = s.holdings.find((h) => h.assetId === assetId)
      let holdings: Holding[]
      if (existing) {
        const totalCost = existing.avgCost * existing.shares + spend
        const totalShares = existing.shares + shares
        holdings = s.holdings.map((h) =>
          h.assetId === assetId ? { ...h, shares: totalShares, avgCost: totalCost / totalShares } : h,
        )
      } else {
        holdings = [...s.holdings, { assetId, shares, avgCost: a.price }]
      }
      return { cash: +(s.cash - spend).toFixed(2), holdings }
    })
  },

  sell: (assetId, dollars) => {
    const a = assetById(assetId)
    if (!a) return
    set((s) => {
      const h = s.holdings.find((x) => x.assetId === assetId)
      if (!h) return s
      const value = h.shares * a.price
      const proceeds = Math.min(dollars, value)
      const sharesSold = proceeds / a.price
      const remaining = h.shares - sharesSold
      const holdings =
        remaining < 1e-8
          ? s.holdings.filter((x) => x.assetId !== assetId)
          : s.holdings.map((x) => (x.assetId === assetId ? { ...x, shares: remaining } : x))
      return { cash: +(s.cash + proceeds).toFixed(2), holdings }
    })
  },

  toggleWatch: (assetId) =>
    set((s) => ({
      watchlist: s.watchlist.includes(assetId)
        ? s.watchlist.filter((x) => x !== assetId)
        : [assetId, ...s.watchlist],
    })),

  markLesson: (id) =>
    set((s) => (s.lessonsDone.includes(id) ? s : { lessonsDone: [...s.lessonsDone, id] })),

  pushChat: (m) => set((s) => ({ chat: [...s.chat, m] })),

  holdingValue: (assetId) => {
    const h = get().holdings.find((x) => x.assetId === assetId)
    const a = assetById(assetId)
    return h && a ? h.shares * a.price : 0
  },

  investedTotal: () =>
    get().holdings.reduce((sum, h) => {
      const a = assetById(h.assetId)
      return sum + (a ? h.shares * a.price : 0)
    }, 0),

  netWorth: () => get().investedTotal() + get().cash,

  dayChangePct: () => {
    const holdings = get().holdings
    const total = get().investedTotal()
    if (total === 0) return 0
    const weighted = holdings.reduce((sum, h) => {
      const a = assetById(h.assetId)
      if (!a) return sum
      const value = h.shares * a.price
      return sum + value * (a.change24h / 100)
    }, 0)
    return (weighted / total) * 100
  },
}))

// Portfolio risk score 0-100 (higher = riskier) based on holding weights.
export function riskScore(holdings: Holding[]): number {
  const weight: Record<Risk, number> = { Low: 20, Medium: 55, High: 90 }
  let total = 0
  let acc = 0
  for (const h of holdings) {
    const a = assetById(h.assetId)
    if (!a) continue
    const v = h.shares * a.price
    total += v
    acc += v * weight[a.risk]
  }
  return total ? Math.round(acc / total) : 0
}

// Diversification 0-100 (higher = better spread across sectors).
export function diversificationScore(holdings: Holding[]): number {
  const bySector: Record<string, number> = {}
  let total = 0
  for (const h of holdings) {
    const a = assetById(h.assetId)
    if (!a) continue
    const v = h.shares * a.price
    bySector[a.sector] = (bySector[a.sector] || 0) + v
    total += v
  }
  if (!total) return 0
  // Herfindahl-based: more even sectors → higher score.
  const hhi = Object.values(bySector).reduce((s, v) => s + (v / total) ** 2, 0)
  const sectors = Object.keys(bySector).length
  const spread = (1 - hhi) * 100
  const breadth = Math.min(sectors / ASSETS.length * 2.2, 1) * 100
  return Math.round(spread * 0.7 + breadth * 0.3)
}
