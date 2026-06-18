import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../state/store'

export default function Welcome() {
  const setName = useStore((s) => s.setName)
  const [value, setValue] = useState('')
  const ready = value.trim().length >= 2

  function start() {
    if (ready) setName(value)
  }

  return (
    <div className="h-full flex flex-col justify-between px-6 pt-16 pb-10 bg-[radial-gradient(circle_at_50%_-10%,#0e2a22_0%,#070b14_60%)]">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col justify-center"
      >
        <div
          className="w-16 h-16 rounded-2xl grid place-items-center text-3xl shadow-glow mb-6"
          style={{ background: 'linear-gradient(135deg,#34d399,#10b981)' }}
        >
          ✨
        </div>
        <h1 className="text-3xl font-extrabold leading-tight">
          Meet <span className="text-accent-soft">Aria</span>
        </h1>
        <p className="text-white/55 mt-2 leading-relaxed">
          Your AI investing co-pilot. Aria helps you invest smarter — not just faster — with
          plain-English guidance, risk-aware trades, and lessons that actually stick.
        </p>

        <label className="block text-sm text-white/60 mt-8 mb-2">What should Aria call you?</label>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && start()}
          placeholder="Your name"
          maxLength={24}
          className="w-full bg-ink-700 border border-white/10 rounded-2xl py-4 px-4 text-lg outline-none focus:border-accent/50"
        />
      </motion.div>

      <div>
        <button
          onClick={start}
          disabled={!ready}
          className={ready ? 'btn-primary w-full' : 'btn-ghost w-full opacity-40 pointer-events-none'}
        >
          Get started →
        </button>
        <p className="text-center text-[11px] text-white/30 mt-3">
          Prototype · mock market data · not financial advice
        </p>
      </div>
    </div>
  )
}
