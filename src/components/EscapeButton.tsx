import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

interface Pos {
  x: number
  y: number
  r: number
  s: number
}

const MARGIN = 18
const TRIGGER_DIST = 150
const COOLDOWN = 280

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))

const LABELS = ['RECUSAR', 'RECUSAR 🙈', 'RECUSAR? 😅', 'Não fujas! 🥺', 'foge... 😏']

interface EscapeButtonProps {
  onEscape?: (count: number) => void
  onDecline?: () => void
  anchor?: RefObject<HTMLDivElement | null>
}

export default function EscapeButton({
  onEscape,
  onDecline,
  anchor,
}: EscapeButtonProps) {
  const reduce = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const [pos, setPos] = useState<Pos>({ x: 0, y: 0, r: 0, s: 1 })
  const [ready, setReady] = useState(false)
  const [tease, setTease] = useState(false)
  const [escapeCount, setEscapeCount] = useState(0)
  const escapeCountRef = useRef(0)
  const posRef = useRef(pos)
  const lastFlee = useRef(0)
  const raf = useRef(0)
  const area = useRef({ w: 0, h: 0 })
  const btn = useRef({ w: 0, h: 0 })
  const initialized = useRef(false)

  useEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current
      const el = btnRef.current
      if (!wrap || !el) return
      const wr = wrap.getBoundingClientRect()
      const br = el.getBoundingClientRect()
      area.current = { w: wr.width, h: wr.height }
      btn.current = { w: br.width, h: br.height }
      if (!initialized.current) {
        initialized.current = true
        let x: number
        let y: number
        const anchorEl = anchor?.current
        if (anchorEl) {
          const ar = anchorEl.getBoundingClientRect()
          x = ar.left - wr.left + (ar.width - br.width) / 2
          y = ar.top - wr.top + (ar.height - br.height) / 2
        } else {
          x = wr.width - br.width - MARGIN * 0.8
          y = wr.height - br.height - MARGIN * 0.8
        }
        const next = {
          x: clamp(x, MARGIN, wr.width),
          y: clamp(y, MARGIN, wr.height),
          r: 0,
          s: 1,
        }
        posRef.current = next
        setPos(next)
        setReady(true)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [reduce, anchor])

  const flee = useCallback(
    (px?: number, py?: number) => {
      if (reduce) return
      const now = performance.now()
      if (now - lastFlee.current < COOLDOWN) return
      lastFlee.current = now

      const { w, h } = area.current
      const { w: bw, h: bh } = btn.current
      if (w < 20 || h < 20) return

      const maxX = clamp(w - bw - MARGIN, MARGIN, w)
      const maxY = clamp(h - bh - MARGIN, MARGIN, h)
      const cy = (h - bh) / 2
      const cx = (w - bw) / 2

      const slots = [
        { x: MARGIN, y: MARGIN },
        { x: maxX, y: MARGIN },
        { x: MARGIN, y: maxY },
        { x: maxX, y: maxY },
        { x: cx, y: MARGIN },
        { x: cx, y: maxY },
        { x: MARGIN, y: cy },
        { x: maxX, y: cy },
      ]

      let best = slots[0]
      let bestScore = -1
      for (const s of slots) {
        const sxc = s.x + bw / 2
        const syc = s.y + bh / 2
        const dx = px === undefined ? 0 : sxc - px
        const dy = py === undefined ? 0 : syc - py
        const dPtr = Math.hypot(dx, dy)
        const dPrev = Math.hypot(s.x - posRef.current.x, s.y - posRef.current.y)
        const score = dPtr + dPrev * 1.5
        if (score > bestScore) {
          bestScore = score
          best = s
        }
      }

      const jitterX = (Math.random() * 3 - 1.5) * Math.min(56, w * 0.07)
      const jitterY = (Math.random() * 3 - 1.5) * Math.min(56, h * 0.07)
      const x = clamp(best.x + jitterX, MARGIN, maxX)
      const y = clamp(best.y + jitterY, MARGIN, maxY)
      const r = (Math.random() * 18 - 9) * (escapeCountRef.current < 2 ? 1 : 1.4)
      const s = Math.max(0.8, 1 - escapeCountRef.current * 0.03)

      const next = { x, y, r, s }
      posRef.current = next
      setPos(next)
      escapeCountRef.current += 1
      setEscapeCount(escapeCountRef.current)
      onEscape?.(escapeCountRef.current)
      if (escapeCountRef.current >= 4) setTease(true)
    },
    [reduce, onEscape],
  )

  useEffect(() => {
    if (reduce) return

    const handleMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        const wrap = wrapRef.current
        if (!wrap) return
        const rect = wrap.getBoundingClientRect()
        const px = e.clientX - rect.left
        const py = e.clientY - rect.top
        const { w: bw, h: bh } = btn.current
        const centerX = posRef.current.x + bw / 2
        const centerY = posRef.current.y + bh / 2
        if (Math.hypot(px - centerX, py - centerY) < TRIGGER_DIST) {
          flee(px, py)
        }
      })
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('pointermove', handleMove)
    }
  }, [reduce, flee])

  const label = LABELS[Math.min(escapeCount, LABELS.length - 1)]

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 z-30">
      <motion.button
        ref={btnRef}
        type="button"
        aria-label="Recusar convite"
        onPointerDown={(e) => {
          if (reduce) return
          e.preventDefault()
          const rect = wrapRef.current?.getBoundingClientRect()
          if (rect) {
            const { w, h } = btn.current
            flee(
              e.clientX - rect.left + w / 2,
              e.clientY - rect.top + h / 2,
            )
          } else {
            flee()
          }
        }}
        onClick={(e) => {
          if (reduce) {
            onDecline?.()
            return
          }
          e.preventDefault()
          flee()
        }}
        className="absolute left-0 top-0 rounded-full border border-rose-light/45 bg-white/10 px-6 py-2.5 text-sm font-semibold tracking-widest text-rose-light shadow-[0_8px_24px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md transition-colors hover:border-rose-light/80 hover:bg-white/15 active:scale-95"
        style={{ zIndex: 30 }}
        initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 0 }}
        animate={{
          x: pos.x,
          y: pos.y,
          rotate: pos.r,
          scale: pos.s,
          opacity: ready ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 460,
          damping: 26,
          mass: 0.95,
        }}
        whileHover={reduce ? undefined : { scale: pos.s * 1.04 }}
      >
        {label}
      </motion.button>

      <AnimatePresence>
        {tease && !reduce && (
          <motion.span
            key="tease"
            className="absolute z-20 whitespace-nowrap rounded-full border border-gold/30 bg-wine-900/80 px-3 py-1 text-xs font-medium text-gold-light shadow-lg backdrop-blur-md"
            style={{ left: '50%', top: 8, x: '-50%' }}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          >
            este botão tem ideias próprias 😌
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}