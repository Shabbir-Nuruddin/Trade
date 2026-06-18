import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export function AriaFab() {
  const nav = useNavigate()
  const loc = useLocation()
  if (loc.pathname.startsWith('/assistant')) return null
  return (
    <motion.button
      onClick={() => nav('/assistant')}
      className="absolute right-4 bottom-24 z-30 w-14 h-14 rounded-full grid place-items-center shadow-glow"
      style={{ background: 'linear-gradient(135deg,#34d399,#10b981)' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Ask Aria"
    >
      <SparkleIcon />
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-ink-900" />
    </motion.button>
  )
}

function SparkleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="#06281c">
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
      <path d="M19 14l.9 2.6L22.5 17.5l-2.6.9L19 21l-.9-2.6L15.5 17.5l2.6-.9L19 14z" opacity="0.85" />
    </svg>
  )
}
