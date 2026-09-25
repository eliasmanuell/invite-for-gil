import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE_OUT } from '../lib/motion'

const LINES = [
  {
    text: 'Tenho uma pergunta para te fazer...',
    showAt: 350,
    hold: 1700,
  },
  {
    text: 'E prometo que é uma pergunta simples. ❤️',
    showAt: 1900,
    hold: 1750,
  },
  {
    text: 'Ou talvez não seja tão simples assim...',
    showAt: 3550,
    hold: 1750,
  },
]

interface IntroProps {
  onDone: () => void
}

export default function Intro({ onDone }: IntroProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timers: number[] = []
    LINES.forEach((line, i) => {
      timers.push(window.setTimeout(() => setIndex(i), line.showAt))
    })
    const last = LINES[LINES.length - 1]
    timers.push(window.setTimeout(onDone, last.showAt + last.hold + 600))
    return () => {
      timers.forEach((t) => clearTimeout(t))
    }
  }, [onDone])

  return (
    <motion.div
      key="intro"
      className="relative z-20 flex min-h-0 flex-col items-center justify-center text-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(14px)', scale: 1.03 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      <div className="relative flex min-h-[9rem] items-center justify-center px-6 sm:min-h-[7rem]">
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(225,75,128,0.22), rgba(225,75,128,0) 70%)',
            filter: 'blur(8px)',
          }}
        />
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            className="relative font-display text-xl leading-relaxed text-blush/95 sm:text-2xl md:text-[1.7rem]"
            initial={{ opacity: 0, y: 16, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{
              opacity: 0,
              y: -14,
              filter: 'blur(12px)',
              transition: { duration: 0.7, ease: 'easeIn' },
            }}
            transition={{ duration: 1.1, ease: EASE_OUT }}
          >
            {LINES[index].text}
            <motion.span
              className="caret-blink ml-1 inline-block h-[1em] w-[2px] translate-y-[0.18em] rounded-full bg-rose-light"
              style={{ boxShadow: '0 0 12px rgba(244,140,178,0.9)' }}
            />
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.p
        className="mt-6 text-xs tracking-[0.35em] text-gold/70 uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        ✦ ✦ ✦
      </motion.p>
    </motion.div>
  )
}