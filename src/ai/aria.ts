import { ASSETS, assetById } from '../data/assets'
import type { Asset } from '../data/types'

export interface AriaReply {
  text: string
  basket?: { assetId: string; weight: number }[]
  source: 'live' | 'scripted'
}

const KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
const MODEL = (import.meta.env.VITE_GEMINI_MODEL as string) || 'gemini-2.0-flash'

const SYSTEM = `You are Aria, a calm, plain-spoken AI investing co-pilot inside a mobile app for first-time investors.
Your job is to make people BETTER investors, not faster traders. Always:
- Explain in simple language, no jargon (or define it in one line).
- Mention risk honestly and discourage impulsive, emotional trades.
- Be concise: 2-4 short sentences max unless asked for detail.
- Never give a guaranteed-return promise. You are educational, not a licensed advisor.
Available assets you can reference: ${ASSETS.map((a) => `${a.symbol} (${a.name}, ${a.risk} risk)`).join(', ')}.`

/** Try the live Gemini API; fall back to scripted on any failure. */
export async function askAria(prompt: string, history: { role: string; text: string }[] = []): Promise<AriaReply> {
  if (KEY) {
    try {
      const res = await withTimeout(
        fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
          {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM }] },
              contents: [
                ...history.map((h) => ({
                  role: h.role === 'aria' ? 'model' : 'user',
                  parts: [{ text: h.text }],
                })),
                { role: 'user', parts: [{ text: prompt }] },
              ],
              generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
            }),
          },
        ),
        9000,
      )
      if (res.ok) {
        const data = await res.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
        if (text) return { text, basket: detectBasket(prompt), source: 'live' }
      }
    } catch {
      /* fall through to scripted */
    }
  }
  return scripted(prompt)
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)),
  ])
}

// ---- Scripted fallback (demo-safe, no network) ----

export function scripted(promptRaw: string): AriaReply {
  const p = promptRaw.toLowerCase()

  // Plain-English goal → basket
  const moneyMatch = promptRaw.match(/\$?\s?(\d[\d,]*)/)
  const amount = moneyMatch ? +moneyMatch[1].replace(/,/g, '') : undefined
  const wantsSafe = /(safe|low.?risk|secure|cautious|beginner|long.?term|retire)/.test(p)
  const wantsClean = /(clean|green|solar|wind|esg|climate|energy)/.test(p)
  const wantsCrypto = /(crypto|bitcoin|btc|eth)/.test(p)
  const wantsGrowth = /(grow|growth|aggressive|tech|ai)/.test(p)
  const hasGoal = wantsSafe || wantsClean || wantsCrypto || wantsGrowth
  const askVerb = /(invest|put|build|portfolio|allocate|basket|where|start|recommend|suggest|have|want|spare|spend)/.test(p)
  // A dollar amount + any goal is a plan request; or an explicit ask verb + a goal/amount.
  const isBasketAsk = (amount != null && hasGoal) || (askVerb && (amount != null || hasGoal))

  if (isBasketAsk) {
    let basket: { assetId: string; weight: number }[]
    let style: string
    if (wantsClean) {
      basket = [{ assetId: 'icln', weight: 50 }, { assetId: 'voo', weight: 35 }, { assetId: 'vbtlx', weight: 15 }]
      style = 'a clean-energy tilt with a diversified core to keep risk in check'
    } else if (wantsCrypto) {
      basket = [{ assetId: 'voo', weight: 60 }, { assetId: 'btc', weight: 25 }, { assetId: 'eth', weight: 15 }]
      style = 'mostly a broad index with a small, sensible crypto slice — crypto is high risk, so we keep it minor'
    } else if (wantsSafe) {
      basket = [{ assetId: 'voo', weight: 50 }, { assetId: 'vt', weight: 25 }, { assetId: 'vbtlx', weight: 25 }]
      style = 'a calm, well-diversified mix built to grow steadily over the years while keeping risk low'
    } else if (wantsGrowth) {
      basket = [{ assetId: 'voo', weight: 45 }, { assetId: 'msft', weight: 25 }, { assetId: 'nvda', weight: 20 }, { assetId: 'vbtlx', weight: 10 }]
      style = 'growth-leaning with AI leaders, cushioned by an index fund and a little bonds'
    } else {
      basket = [{ assetId: 'voo', weight: 50 }, { assetId: 'vt', weight: 25 }, { assetId: 'vbtlx', weight: 25 }]
      style = 'a calm, well-diversified mix built to grow steadily over years'
    }
    const amt = amount ? `$${amount.toLocaleString()}` : 'your money'
    const lines = basket
      .map((b) => `• ${b.weight}% ${assetById(b.assetId)?.symbol} — ${assetById(b.assetId)?.name}`)
      .join('\n')
    return {
      text: `Here's ${style}. For ${amt} I'd suggest:\n\n${lines}\n\nThis spreads your risk instead of betting on one name. Want me to set up the trades?`,
      basket,
      source: 'scripted',
    }
  }

  // Explain a term / asset
  for (const a of ASSETS) {
    if (p.includes(a.symbol.toLowerCase()) || p.includes(a.name.toLowerCase())) {
      if (/(what|explain|tell me|should i|good|safe|buy|about|risk)/.test(p)) {
        return { text: explainAsset(a), source: 'scripted' }
      }
    }
  }

  if (/(p\/e|pe ratio|price.to.earn)/.test(p))
    return { text: 'P/E ratio = price ÷ yearly earnings per share. A P/E of 25 means you pay $25 for every $1 of annual profit. A high P/E means investors expect fast growth — and there is more to lose if that growth disappoints.', source: 'scripted' }
  if (/(diversif)/.test(p))
    return { text: 'Diversification means spreading money across many assets so one bad pick can’t sink you. The easiest way is a broad index fund like VOO, which holds 500 companies at once.', source: 'scripted' }
  if (/(risk)/.test(p))
    return { text: 'Risk is how much an investment can swing up and down. Bonds and broad ETFs are calmer; single stocks and crypto can double or halve. Match the risk to how long you can leave the money invested.', source: 'scripted' }
  if (/(volatil|crash|drop|down|scared|panic)/.test(p))
    return { text: 'Market dips are normal — about a 10% drop happens most years. Selling in a panic locks in the loss. If your plan and time horizon haven’t changed, staying invested is usually the smart move.', source: 'scripted' }
  if (/(hi|hello|hey|help|what can you)/.test(p.trim()))
    return { text: 'Hi, I’m Aria 👋 I can help you understand any investment, build a plan for a goal in plain English, or sanity-check a trade before you make it. Try: “I have $500 and want safe long-term growth.”', source: 'scripted' }

  return {
    text: 'Good question. The smartest first move for most beginners is a broad, low-cost index fund like VOO — instant diversification across 500 companies. Tell me your goal and budget (e.g. “$500, safe, long-term”) and I’ll build you a plan.',
    source: 'scripted',
  }
}

function explainAsset(a: Asset): string {
  return `${a.name} (${a.symbol}) — ${a.summary} It’s currently ${a.risk.toLowerCase()} risk${
    a.risk === 'High' ? ', so keep it to a small slice of your portfolio and only invest what you can leave alone.' : ' and can sit comfortably as a core holding.'
  }`
}

function detectBasket(prompt: string) {
  const r = scripted(prompt)
  return r.basket
}

// Conviction Check: generate a behavioral risk reframe before a trade.
export function convictionPrompts(asset: Asset, dollars: number, side: 'buy' | 'sell') {
  const high = asset.risk === 'High'
  const risks: string[] = []
  if (side === 'buy') {
    if (high) risks.push(`${asset.symbol} is high-risk — it could fall 30%+ in weeks without warning.`)
    if (asset.change24h > 3) risks.push(`It’s already up ${asset.change24h.toFixed(1)}% today. Buying after a spike often means buying the top.`)
    if (asset.peRatio && asset.peRatio > 50) risks.push(`Its P/E of ${asset.peRatio} is steep — a lot of future growth is already priced in.`)
    if (asset.kind === 'crypto') risks.push('Crypto trades 24/7 and is driven by sentiment — expect a wild ride.')
    if (risks.length === 0) risks.push(`Even solid picks like ${asset.symbol} can drop in a market-wide selloff.`)
  } else {
    risks.push('Selling locks in your result — if this is a long-term holding, a dip is not always a reason to exit.')
    if (asset.change24h < -2) risks.push(`${asset.symbol} is down ${Math.abs(asset.change24h).toFixed(1)}% today. Selling into fear is how many investors lock in losses.`)
  }
  const question =
    side === 'buy'
      ? `In one line: why do you believe ${asset.symbol} is a good buy right now?`
      : `In one line: what’s changed about ${asset.symbol} that makes you want to sell?`
  return { risks, question }
}
