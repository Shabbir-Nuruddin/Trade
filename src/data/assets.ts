import type { Asset, Collection, Lesson, Goal } from './types'

// Deterministic pseudo-random so the demo looks identical every load.
function seeded(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

function spark(seed: number, base: number, vol: number, len = 32): number[] {
  const rnd = seeded(seed)
  let v = base
  const out: number[] = []
  for (let i = 0; i < len; i++) {
    v += (rnd() - 0.48) * vol
    out.push(Math.max(1, +v.toFixed(2)))
  }
  return out
}

export const ASSETS: Asset[] = [
  {
    id: 'nvda', symbol: 'NVDA', name: 'NVIDIA', kind: 'stock', price: 1208.4, change24h: 3.8,
    risk: 'High', sector: 'Semiconductors', marketCap: '2.9T', peRatio: 64.2, dividend: 0.03,
    summary: 'Designs the chips powering the AI boom. Huge growth, but priced for perfection.',
    spark: spark(11, 1100, 38), tags: ['AI', 'Tech', 'Momentum'],
  },
  {
    id: 'aapl', symbol: 'AAPL', name: 'Apple', kind: 'stock', price: 214.1, change24h: 0.6,
    risk: 'Low', sector: 'Consumer Tech', marketCap: '3.3T', peRatio: 33.1, dividend: 0.45,
    summary: 'iPhone maker with a loyal user base and steady cash flow. A blue-chip staple.',
    spark: spark(22, 205, 4), tags: ['Tech', 'Dividend', 'Blue-chip'],
  },
  {
    id: 'msft', symbol: 'MSFT', name: 'Microsoft', kind: 'stock', price: 449.7, change24h: 1.1,
    risk: 'Low', sector: 'Software', marketCap: '3.3T', peRatio: 38.9, dividend: 0.72,
    summary: 'Windows, Office, Azure cloud and a big AI bet via OpenAI. Diversified and durable.',
    spark: spark(33, 430, 7), tags: ['AI', 'Cloud', 'Blue-chip'],
  },
  {
    id: 'tsla', symbol: 'TSLA', name: 'Tesla', kind: 'stock', price: 178.2, change24h: -4.2,
    risk: 'High', sector: 'Autos / Energy', marketCap: '568B', peRatio: 44.0, dividend: 0,
    summary: 'EV leader with wild swings. Story stock — moves on hype as much as fundamentals.',
    spark: spark(44, 200, 11), tags: ['EV', 'Volatile', 'Momentum'],
  },
  {
    id: 'voo', symbol: 'VOO', name: 'Vanguard S&P 500 ETF', kind: 'etf', price: 498.3, change24h: 0.4,
    risk: 'Low', sector: 'Broad Market', marketCap: '—', dividend: 1.3,
    summary: 'Owns the 500 biggest US companies in one click. The classic beginner core holding.',
    spark: spark(55, 480, 3), tags: ['Diversified', 'Beginner', 'Core'],
  },
  {
    id: 'icln', symbol: 'ICLN', name: 'iShares Clean Energy ETF', kind: 'etf', price: 13.9, change24h: 1.9,
    risk: 'Medium', sector: 'Clean Energy', marketCap: '—', dividend: 1.8,
    summary: 'A basket of solar, wind and clean-power companies worldwide. Thematic, mid-risk.',
    spark: spark(66, 13, 0.6), tags: ['Clean Energy', 'Thematic', 'ESG'],
  },
  {
    id: 'btc', symbol: 'BTC', name: 'Bitcoin', kind: 'crypto', price: 67450, change24h: 2.3,
    risk: 'High', sector: 'Crypto', marketCap: '1.3T',
    summary: 'The original cryptocurrency — digital scarce money. High reward, high volatility.',
    spark: spark(77, 64000, 1800), tags: ['Crypto', 'Volatile'],
  },
  {
    id: 'eth', symbol: 'ETH', name: 'Ethereum', kind: 'crypto', price: 3510, change24h: -1.4,
    risk: 'High', sector: 'Crypto', marketCap: '422B',
    summary: 'The platform behind most crypto apps and tokens. Volatile but foundational.',
    spark: spark(88, 3600, 140), tags: ['Crypto', 'Volatile'],
  },
  {
    id: 'vbtlx', symbol: 'VBTLX', name: 'Vanguard Total Bond Fund', kind: 'mutual', price: 9.6, change24h: 0.1,
    risk: 'Low', sector: 'Bonds', marketCap: '—', dividend: 3.6,
    summary: 'A spread of US bonds that cushions a portfolio when stocks fall. Slow and steady.',
    spark: spark(99, 9.5, 0.05), tags: ['Bonds', 'Defensive', 'Income'],
  },
  {
    id: 'vt', symbol: 'VT', name: 'Vanguard Total World ETF', kind: 'etf', price: 118.2, change24h: 0.5,
    risk: 'Low', sector: 'Global Market', marketCap: '—', dividend: 1.9,
    summary: 'Every investable stock on Earth in one fund. Maximum diversification, set-and-forget.',
    spark: spark(101, 114, 1.4), tags: ['Diversified', 'Global', 'Core'],
  },
  {
    id: 'cost', symbol: 'COST', name: 'Costco', kind: 'stock', price: 862.5, change24h: 0.9,
    risk: 'Low', sector: 'Retail', marketCap: '382B', peRatio: 52.4, dividend: 0.5,
    summary: 'Membership warehouse retailer with famously loyal customers and steady growth.',
    spark: spark(112, 830, 11), tags: ['Retail', 'Defensive', 'Blue-chip'],
  },
  {
    id: 'amd', symbol: 'AMD', name: 'AMD', kind: 'stock', price: 162.3, change24h: 2.7,
    risk: 'High', sector: 'Semiconductors', marketCap: '262B', peRatio: 236, dividend: 0,
    summary: 'NVIDIA’s main chip rival, chasing the AI wave. Fast growth, rich valuation.',
    spark: spark(123, 150, 6), tags: ['AI', 'Tech', 'Momentum'],
  },
]

export const assetById = (id: string) => ASSETS.find((a) => a.id === id)

export const COLLECTIONS: Collection[] = [
  { id: 'safe', title: 'Beginner Safe', blurb: 'Low-risk, diversified starters', emoji: '🛟', assetIds: ['voo', 'vt', 'vbtlx', 'aapl'] },
  { id: 'ai', title: 'The AI Wave', blurb: 'Companies building the AI future', emoji: '🤖', assetIds: ['nvda', 'msft', 'amd'] },
  { id: 'clean', title: 'Clean Energy', blurb: 'Bet on the energy transition', emoji: '🌱', assetIds: ['icln', 'tsla'] },
  { id: 'crypto', title: 'Crypto Starter', blurb: 'The two largest coins', emoji: '⚡', assetIds: ['btc', 'eth'] },
  { id: 'dividend', title: 'Steady Income', blurb: 'Pays you to hold', emoji: '💵', assetIds: ['aapl', 'cost', 'vbtlx'] },
]

export const TRENDING_IDS = ['nvda', 'btc', 'tsla', 'amd', 'icln']

export const LESSONS: Lesson[] = [
  { id: 'diversify', title: 'Why diversification matters', minutes: 2, level: 'Beginner', emoji: '🧺',
    body: "Don't put all your eggs in one basket. Spreading money across many assets means one bad pick won't sink you. An index fund like VOO does this automatically by holding 500 companies at once." },
  { id: 'risk', title: 'Reading risk indicators', minutes: 2, level: 'Beginner', emoji: '⚖️',
    body: 'Risk is how much an investment can swing up AND down. Low-risk assets (bonds, broad ETFs) move slowly. High-risk ones (single stocks, crypto) can double — or halve. Match risk to your time horizon.' },
  { id: 'pe', title: 'What is a P/E ratio?', minutes: 1, level: 'Core', emoji: '🔢',
    body: 'Price-to-Earnings compares a stock’s price to its yearly profit per share. A P/E of 25 means you pay $25 for every $1 of annual earnings. High P/E = the market expects fast growth (and more risk if it disappoints).' },
  { id: 'dca', title: 'Dollar-cost averaging', minutes: 2, level: 'Core', emoji: '📆',
    body: 'Instead of timing the market, invest a fixed amount on a schedule (say $50/month). You automatically buy more when prices are low and less when high — and you remove emotion from the decision.' },
  { id: 'compounding', title: 'The magic of compounding', minutes: 2, level: 'Beginner', emoji: '🪄',
    body: 'Your returns earn returns. $1,000 growing 8%/year becomes ~$2,160 in 10 years and ~$10,000 in 30 — without adding a cent. Time in the market is your biggest advantage as a young investor.' },
  { id: 'volatility', title: 'Volatility is normal', minutes: 1, level: 'Beginner', emoji: '🎢',
    body: 'Markets drop ~10% about once a year on average. That’s the price of admission for long-term growth. Selling in a panic locks in losses — staying invested is usually the winning move.' },
]

export const lessonById = (id: string) => LESSONS.find((l) => l.id === id)

export const GOALS: Goal[] = [
  { id: 'emergency', title: 'Safety Net', emoji: '🛟', target: 10000, current: 6400 },
  { id: 'house', title: 'House Deposit', emoji: '🏠', target: 60000, current: 18250 },
  { id: 'freedom', title: 'Financial Freedom', emoji: '🌴', target: 500000, current: 41800 },
]

// Glossary terms that trigger contextual micro-lessons when tapped.
export const GLOSSARY: Record<string, string> = {
  'P/E ratio': 'pe',
  'Diversification': 'diversify',
  'Risk': 'risk',
  'Volatility': 'volatility',
  'Dividend': 'compounding',
}
