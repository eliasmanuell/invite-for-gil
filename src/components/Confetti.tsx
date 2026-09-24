import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { useReducedMotion } from 'framer-motion'

const PALETTE = ['#f3dda9', '#e14b80', '#f48cb2', '#ffffff', '#d7b26a', '#ff6b9d']

interface Piece {
  key: string
  left: number
  w: number
  h: number
  c: string
  dur: number
  delay: number
  tx: number
  rot: number
}

function buildPieces(): Piece[] {
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const n = isTouch ? 45 : 90
  return Array.from({ length: n }, (_, i) => ({
    key: `c-${i}`,
    left: Math.random() * 100,
    w: 5 + Math.random() * 7,
    h: 10 + Math.random() * 9,
    c: PALETTE[i % PALETTE.length] as string,
    dur: 3.2 + Math.random() * 2.8,
    delay: Math.random() * 2.4,
    tx: (Math.random() * 2 - 1) * 14,
    rot: 360 + Math.random() * 540,
  }))
}

export default function Confetti() {
  const reduce = useReducedMotion()
  const pieces = useMemo<Piece[]>(() => (reduce ? [] : buildPieces()), [reduce])

  if (pieces.length === 0) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      {pieces.map((p) => (
        <span
          key={p.key}
          className="animate-confetti absolute top-0"
          style={
            {
              left: `${p.left}%`,
              width: p.w,
              height: p.h,
              background: p.c,
              borderRadius: 2,
              opacity: 0.95,
              '--dur': `${p.dur}s`,
              '--delay': `${p.delay}s`,
              '--tx': `${p.tx}vw`,
              '--rot': `${p.rot}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}