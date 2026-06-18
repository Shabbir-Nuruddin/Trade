import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LESSONS } from '../data/assets'
import { useStore } from '../state/store'
import type { Lesson } from '../data/types'
import { cx } from '../lib/format'

export default function Learn() {
  const nav = useNavigate()
  const done = useStore((s) => s.lessonsDone)
  const markLesson = useStore((s) => s.markLesson)
  const [open, setOpen] = useState<Lesson | null>(null)

  const progress = Math.round((done.length / LESSONS.length) * 100)
  const next = LESSONS.find((l) => !done.includes(l.id)) ?? LESSONS[0]

  return (
    <div className="px-4 pt-12 sm:pt-8 space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Learn & Invest</h1>
        <p className="text-white/50 text-sm">Bite-size lessons, zero jargon</p>
      </header>

      {/* progress */}
      <section className="card p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold">Your learning path</span>
          <span className="text-white/50">{done.length}/{LESSONS.length} done</span>
        </div>
        <div className="h-2 rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-soft to-accent"
            style={{ width: `${progress}%`, transition: 'width 0.6s ease' }}
          />
        </div>
      </section>

      {/* AI recommended next */}
      <button
        onClick={() => { setOpen(next); markLesson(next.id) }}
        className="w-full text-left card p-4 border-accent/20 bg-gradient-to-br from-accent/10 to-transparent"
      >
        <div className="text-xs text-accent-soft font-semibold mb-1">✨ Aria recommends next</div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{next.emoji}</span>
          <div>
            <div className="font-semibold">{next.title}</div>
            <div className="text-xs text-white/45">{next.minutes} min · {next.level}</div>
          </div>
        </div>
      </button>

      {/* market explainer */}
      <button
        onClick={() => nav('/assistant', { state: { prompt: 'Explain what’s moving the market today' } })}
        className="w-full text-left card p-4"
      >
        <div className="text-sm font-semibold">📰 Market explainer</div>
        <p className="text-xs text-white/50 mt-1">
          Markets are up today on cooling inflation data. Tap to have Aria break it down for you.
        </p>
      </button>

      {/* all lessons */}
      <section>
        <h3 className="font-semibold mb-2">All lessons</h3>
        <div className="space-y-2">
          {LESSONS.map((l) => {
            const isDone = done.includes(l.id)
            return (
              <button
                key={l.id}
                onClick={() => { setOpen(l); markLesson(l.id) }}
                className="w-full card p-4 flex items-center gap-3 text-left active:scale-[0.99] transition"
              >
                <span className="text-2xl">{l.emoji}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{l.title}</div>
                  <div className="text-[11px] text-white/45">{l.minutes} min · {l.level}</div>
                </div>
                <span
                  className={cx(
                    'w-6 h-6 rounded-full grid place-items-center text-xs',
                    isDone ? 'bg-accent text-ink-900' : 'bg-white/8 text-white/40',
                  )}
                >
                  {isDone ? '✓' : '›'}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative w-full max-w-[420px] bg-ink-800 rounded-t-3xl sm:rounded-3xl border border-white/10 p-5 m-0 sm:m-3"
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              exit={{ y: 60 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 rounded-full bg-white/15 mx-auto mb-4 sm:hidden" />
              <div className="text-3xl">{open.emoji}</div>
              <h3 className="text-xl font-bold mt-2">{open.title}</h3>
              <div className="text-xs text-white/45 mb-3">{open.minutes} min read · {open.level}</div>
              <p className="text-sm text-white/75 leading-relaxed">{open.body}</p>
              <button
                onClick={() => nav('/assistant', { state: { prompt: open.title } })}
                className="btn-ghost w-full mt-4 !py-2.5 text-sm"
              >
                Ask Aria a follow-up
              </button>
              <button onClick={() => setOpen(null)} className="btn-primary w-full mt-2">
                Mark complete
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
