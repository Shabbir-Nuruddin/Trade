import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BottomNav } from './components/BottomNav'
import { AriaFab } from './components/AriaFab'
import { useStore } from './state/store'
import Welcome from './screens/Welcome'
import Home from './screens/Home'
import Discover from './screens/Discover'
import AssetDetail from './screens/AssetDetail'
import Trade from './screens/Trade'
import Portfolio from './screens/Portfolio'
import Learn from './screens/Learn'
import Assistant from './screens/Assistant'

function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="h-full overflow-y-auto no-scrollbar pb-28"
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const loc = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={loc} key={loc.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/discover" element={<Page><Discover /></Page>} />
        <Route path="/asset/:id" element={<Page><AssetDetail /></Page>} />
        <Route path="/trade/:id" element={<Page><Trade /></Page>} />
        <Route path="/portfolio" element={<Page><Portfolio /></Page>} />
        <Route path="/learn" element={<Page><Learn /></Page>} />
        <Route path="/assistant" element={<Page><Assistant /></Page>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const name = useStore((s) => s.name)
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 sm:p-6">
      {/* Phone frame */}
      <div className="relative w-full sm:w-[400px] h-[100dvh] sm:h-[860px] bg-ink-900 sm:rounded-[2.75rem] sm:border-[10px] sm:border-black/80 sm:shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* notch */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/80 rounded-b-2xl z-40" />
        <div className="relative h-full">
          {!name ? (
            <Welcome />
          ) : (
            <>
              <AnimatedRoutes />
              <AriaFab />
              <BottomNav />
            </>
          )}
        </div>
      </div>
      {/* Desktop hint */}
      <div className="hidden lg:block fixed bottom-6 left-6 text-white/30 text-xs max-w-[200px]">
        Aria — the AI co-pilot that makes you a better investor, not just a faster trader.
      </div>
    </div>
  )
}
