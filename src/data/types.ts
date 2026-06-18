export type AssetKind = 'stock' | 'etf' | 'crypto' | 'mutual'
export type Risk = 'Low' | 'Medium' | 'High'

export interface Asset {
  id: string
  symbol: string
  name: string
  kind: AssetKind
  price: number
  change24h: number // percent
  risk: Risk
  sector: string
  marketCap?: string
  peRatio?: number
  dividend?: number
  summary: string // plain-language one-liner
  spark: number[] // recent price series for sparkline
  tags: string[]
}

export interface Holding {
  assetId: string
  shares: number
  avgCost: number
}

export interface Collection {
  id: string
  title: string
  blurb: string
  emoji: string
  assetIds: string[]
}

export interface Lesson {
  id: string
  title: string
  minutes: number
  level: 'Beginner' | 'Core' | 'Advanced'
  emoji: string
  body: string
}

export interface Goal {
  id: string
  title: string
  emoji: string
  target: number
  current: number
}
