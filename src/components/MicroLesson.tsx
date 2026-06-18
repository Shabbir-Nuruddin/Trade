import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { lessonById } from '../data/assets'
import { useStore } from '../state/store'

/** A tappable term that pops a 30-second contextual lesson. */
export function Term({ children, lesson }: { children: React.ReactNode; lesson: string }) {
  const [open, setOpen] = useState(false)
  const l = lessonById(lesson)
  const markLesson = useStore((s) => s.markLesson)
  if (!l) return <>{children}</>
  return (
    <>
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          setOpen(true)
          markLesson(l.id)
        }}
        className="underline decoration-dotted decoration-accent/60 underline-offset-2 text-accent-soft font-medium cursor-pointer"
      >
        {children}
      </span>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative w-full max-w-[420px] card p-5 m-3 mb-6"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{l.emoji}</span>
                <span className="chip !bg-accent/15 !border-accent/30 text-accent-soft">
                  ⚡ {l.minutes} min · Aria explains
                </span>
              </div>
              <h3 className="text-lg font-bold mt-2">{l.title}</h3>
              <p className="text-sm text-white/70 mt-2 leading-relaxed">{l.body}</p>
              <button onClick={() => setOpen(false)} className="btn-primary w-full mt-4">
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
