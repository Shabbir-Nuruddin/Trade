import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../state/store'
import { askAria } from '../ai/aria'
import { assetById } from '../data/assets'
import { usd } from '../lib/format'

const SUGGESTIONS = [
  'I have $500 and want safe long-term growth',
  'Is now a good time to buy NVDA?',
  'Explain diversification simply',
  'I’m nervous the market will crash',
]

export default function Assistant() {
  const nav = useNavigate()
  const loc = useLocation()
  const chat = useStore((s) => s.chat)
  const pushChat = useStore((s) => s.pushChat)
  const buy = useStore((s) => s.buy)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [live, setLive] = useState(!!import.meta.env.VITE_ANTHROPIC_API_KEY)
  const endRef = useRef<HTMLDivElement>(null)

  async function send(text: string) {
    if (!text.trim() || typing) return
    setInput('')
    pushChat({ role: 'user', text })
    setTyping(true)
    const history = useStore.getState().chat.slice(-6).map((m) => ({ role: m.role, text: m.text }))
    const reply = await askAria(text, history)
    setLive(reply.source === 'live')
    setTyping(false)
    pushChat({ role: 'aria', text: reply.text, basket: reply.basket })
  }

  // Greeting + deep-link prompt from other screens
  useEffect(() => {
    if (chat.length === 0) {
      pushChat({
        role: 'aria',
        text: 'Hi, I’m Aria 👋 your investing co-pilot. I can explain any investment, build a plan for your goals in plain English, or sanity-check a trade. What’s on your mind?',
      })
    }
    const p = (loc.state as { prompt?: string })?.prompt
    if (p) send(p)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat, typing])

  function investBasket(basket: { assetId: string; weight: number }[]) {
    const budget = 500
    basket.forEach((b) => buy(b.assetId, (budget * b.weight) / 100))
    pushChat({ role: 'aria', text: `Done ✅ I’ve invested ${usd(budget, 0)} across your basket. Check your Portfolio to see it live.` })
  }

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <header className="px-4 pt-12 sm:pt-8 pb-3 flex items-center gap-3 border-b border-white/5">
        <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 grid place-items-center">
          ←
        </button>
        <div className="w-9 h-9 rounded-full grid place-items-center" style={{ background: 'linear-gradient(135deg,#34d399,#10b981)' }}>
          ✨
        </div>
        <div className="flex-1">
          <h1 className="font-bold leading-tight">Aria</h1>
          <p className="text-[11px] text-white/45">
            {live ? '● Live AI' : '● Demo mode'} · your investing co-pilot
          </p>
        </div>
      </header>

      {/* messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">
        {chat.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
          >
            <div
              className={
                m.role === 'user'
                  ? 'bg-accent text-ink-900 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%] text-sm font-medium'
                  : 'bg-ink-700 border border-white/5 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] text-sm whitespace-pre-line leading-relaxed'
              }
            >
              {m.text}
              {m.basket && (
                <div className="mt-3 space-y-2">
                  {m.basket.map((b) => {
                    const a = assetById(b.assetId)!
                    return (
                      <button
                        key={b.assetId}
                        onClick={() => nav(`/asset/${b.assetId}`)}
                        className="w-full flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 text-left"
                      >
                        <span className="font-semibold">{a.symbol}</span>
                        <span className="text-white/50 text-xs flex-1 px-2 truncate">{a.name}</span>
                        <span className="text-accent-soft font-semibold">{b.weight}%</span>
                      </button>
                    )
                  })}
                  <button onClick={() => investBasket(m.basket!)} className="btn-primary w-full !py-2.5 text-sm">
                    Invest $500 in this basket
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-ink-700 border border-white/5 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* suggestions */}
      {chat.length <= 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)} className="chip whitespace-nowrap shrink-0">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* input */}
      <div className="px-4 pb-4 pt-1 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(input)}
          placeholder="Ask Aria anything…"
          className="flex-1 bg-ink-700 border border-white/10 rounded-2xl py-3 px-4 text-sm outline-none focus:border-accent/40"
        />
        <button
          onClick={() => send(input)}
          className="w-11 h-11 rounded-2xl bg-accent text-ink-900 grid place-items-center font-bold shrink-0 active:scale-95 transition"
        >
          ↑
        </button>
      </div>
    </div>
  )
}
