import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const CHARS = ['❤️', '💖', '💗', '💕', '💘', '✨', '🌹']

interface Heart {
  dx: number
  dy: number
  s: number
  r: number
  dur: number
  delay: number
  char: string
}

function buildHearts(reduced: boolean): Heart[] {
  const n = reduced ? 14 : 36
  return Array.from({ length: n }, (_, i) => {
    const ang = Math.random() * Math.PI * 2
    const dist = 60 + Math.random() * Math.random() * 230
    return {
      dx: Math.cos(ang) * dist,
      dy: Math.sin(ang) * dist,
      s: 14 + Math.random() * 24,
      r: Math.random() * 340 - 170,
      dur: 1.2 + Math.random() * 1.1,
      delay: 0.05 + Math.random() * 0.12,
      char: CHARS[i % CHARS.length] as string,
    }
  })
}

export default function HeartBurst() {
  const reduce = useReducedMotion()

  const hearts = useMemo(
    () => buildHearts(reduce === true),
    [reduce],
  )

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-0 w-0"
    >
      {hearts.map((h, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            fontSize: h.s,
            marginLeft: -h.s * 0.5,
            marginTop: -h.s * 0.5,
          }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
          animate={{
            x: h.dx,
            y: h.dy,
            scale: [0, 1.2, 0.8],
            opacity: [0, 1, 0],
            rotate: h.r,
          }}
          transition={{
            duration: h.dur,
            ease: 'easeOut',
            delay: h.delay,
          }}
        >
          {h.char}
        </motion.span>
      ))}
    </div>
  )
}