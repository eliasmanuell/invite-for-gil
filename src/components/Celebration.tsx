import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Confetti from './Confetti'
import Fireworks from './Fireworks'
import HeartBurst from './HeartBurst'
import { EASE_OUT } from '../lib/motion'

interface CelebrationProps {
  onDone: () => void
}

export default function Celebration({ onDone }: CelebrationProps) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 7200)
    return () => window.clearTimeout(t)
  }, [onDone])

  const ringStyle = (size: number) => ({
    width: size,
    height: size,
    marginLeft: -size / 2,
    marginTop: -size / 2,
  })

  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: EASE_OUT } }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 45%, rgba(225,75,128,0.26), rgba(35,6,15,0.55) 72%)',
        }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.6, times: [0, 0.5, 1], ease: EASE_OUT }}
      >
        <motion.div
          className="absolute inset-0 z-30 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0] }}
          transition={{ duration: 0.7, times: [0, 0.3, 1] }}
        />

        {[{ d: 1.3, s: 112 }, { d: 1.9, s: 140 }].map((ring, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 z-20 rounded-full border-2 border-rose-light/80"
            style={ringStyle(ring.s)}
            initial={{ scale: 0.1, opacity: 0.95 }}
            animate={{ scale: i === 0 ? 4.4 : 5.4, opacity: 0 }}
            transition={{ duration: ring.d, ease: 'easeOut', delay: i * 0.14 }}
          />
        ))}

        <HeartBurst />
      </motion.div>

      <Confetti />
      <Fireworks />

      <motion.p
        className="absolute inset-x-0 bottom-8 z-30 text-center font-display text-lg italic text-rose-light/80 text-glow-soft sm:text-xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8, ease: EASE_OUT }}
      >
        que sim! que sim! ❤️
      </motion.p>
    </motion.div>
  )
}