import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { useReducedMotion } from 'framer-motion'

type Kind = 'heart' | 'rose' | 'petal' | 'star' | 'mote'

interface Item {
  key: string
  kind: Kind
  left: number
  top: number
  size: number
  dur: number
  delay: number
  o: number
  tx1: number
  tx2: number
  rot: number
  char?: string
  color?: string
}

const HEARTS = ['❤️', '💗', '💘', '💖', '💕']
const ROSES = ['🌹', '🥀']

const rand = (min: number, max: number) => min + Math.random() * (max - min)

function buildItems(): Item[] {
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const narrow = window.innerWidth < 640
  const scale = Math.min(1, window.innerWidth / 1150) * (isTouch ? 0.8 : 1)
  const base = 34

  const count = Math.max(
    10,
    Math.round((base * (narrow ? 0.6 : 1) * scale * (isTouch ? 0.75 : 1)) / 10) * 10,
  )

  const items: Item[] = []
  let i = 0

  const push = (kind: Kind, extra: Partial<Item> = {}) => {
    items.push({
      key: `${kind}-${i++}`,
      kind,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 0,
      dur: 0,
      delay: 0,
      o: 0.35,
      tx1: 0,
      tx2: 0,
      rot: 0,
      ...extra,
    })
  }

  const heartN = Math.round(count * 0.22)
  const roseN = Math.round(count * 0.1)
  const petalN = Math.round(count * 0.24)
  const starN = Math.round(count * 0.26)
  const moteN = count - heartN - roseN - petalN - starN

  for (let n = 0; n < heartN; n++) {
    push('heart', {
      left: rand(-2, 102),
      size: rand(16, 44),
      dur: rand(22, 40),
      delay: rand(-36, 0),
      o: rand(0.14, 0.4),
      tx1: rand(-4, 4),
      tx2: rand(-3, 3),
      rot: rand(6, 20),
      char: HEARTS[n % HEARTS.length],
    })
  }

  for (let n = 0; n < roseN; n++) {
    push('rose', {
      left: rand(-2, 102),
      size: rand(20, 42),
      dur: rand(26, 46),
      delay: rand(-40, 0),
      o: rand(0.12, 0.32),
      tx1: rand(-3, 3),
      tx2: rand(-5, 5),
      rot: rand(8, 24),
      char: ROSES[n % ROSES.length],
    })
  }

  for (let n = 0; n < petalN; n++) {
    push('petal', {
      left: rand(-4, 104),
      top: rand(-80, -10),
      size: rand(10, 26),
      dur: rand(13, 24),
      delay: rand(-22, 0),
      o: rand(0.3, 0.6),
      tx1: rand(-9, 9),
      tx2: rand(-8, 8),
      rot: rand(140, 260),
    })
  }

  for (let n = 0; n < starN; n++) {
    push('star', {
      left: rand(-2, 102),
      top: rand(2, 96),
      size: rand(8, 18),
      dur: rand(1.8, 4.4),
      delay: rand(-4, 0),
      o: rand(0.4, 0.95),
    })
  }

  for (let n = 0; n < moteN; n++) {
    push('mote', {
      left: rand(-2, 102),
      top: rand(4, 96),
      size: rand(5, 14),
      dur: rand(20, 36),
      delay: rand(-32, 0),
      o: rand(0.3, 0.7),
      tx1: rand(-3, 3),
      tx2: rand(-3, 3),
      color: n % 2 === 0 ? 'rgba(255,224,180,0.9)' : 'rgba(244,140,178,0.9)',
    })
  }

  return items
}

function toVars(item: Item): CSSProperties {
  return {
    '--dur': `${item.dur.toFixed(1)}s`,
    '--delay': `${item.delay.toFixed(2)}s`,
    '--o': item.o,
    '--tx1': `${item.tx1}vw`,
    '--tx2': `${item.tx2}vw`,
    '--rot': `${item.rot}deg`,
  } as CSSProperties
}

function StarShape({ size, className, style }: { size: number; className?: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        left: 0,
        top: 0,
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(243,221,169,0.85))',
        clipPath:
          'polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)',
        ...style,
      }}
    />
  )
}

export default function FloatingElements() {
  const reduce = useReducedMotion()
  const items = useMemo(() => (reduce ? [] : buildItems()), [reduce])

  if (items.length === 0) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
    >
      {items.map((item) => {
        const vars = toVars(item)

        if (item.kind === 'heart' || item.kind === 'rose') {
          return (
            <span
              key={item.key}
              className="animate-float-up absolute"
              style={{
                ...vars,
                left: `${item.left}%`,
                bottom: -60,
                fontSize: item.size,
                opacity: item.o,
                filter: 'blur(0.4px)',
              }}
            >
              {item.char}
            </span>
          )
        }

        if (item.kind === 'petal') {
          return (
            <span
              key={item.key}
              className="animate-petal-fall absolute"
              style={{
                ...vars,
                left: `${item.left}%`,
                top: 0,
                width: item.size,
                height: item.size * 0.9,
                borderRadius: '80% 0 80% 0',
                background:
                  'linear-gradient(135deg, rgba(244,140,178,0.85), rgba(225,75,128,0.65))',
                opacity: item.o,
                boxShadow: '0 0 12px rgba(244,140,178,0.35)',
              }}
            />
          )
        }

        if (item.kind === 'star') {
          return (
            <StarShape
              key={item.key}
              size={item.size}
              className="animate-twinkle"
              style={{
                ...vars,
                left: `${item.left}%`,
                top: `${item.top}%`,
              }}
            />
          )
        }

        const flutter = [...item.key].reduce((a, c) => a + c.charCodeAt(0), 0) % 2 === 0

        return (
          <span
            key={item.key}
            className={flutter ? 'animate-twinkle' : 'animate-float-up'}
            style={{
              ...vars,
              position: 'absolute',
              left: `${item.left}%`,
              top: `${item.top}%`,
              bottom: 'auto',
              width: item.size,
              height: item.size,
              borderRadius: '9999px',
              background:
                item.color ?? 'radial-gradient(circle, rgba(255,224,180,0.8), rgba(255,224,180,0))',
              opacity: item.o,
              filter: 'blur(0.5px)',
              boxShadow: '0 0 12px rgba(255,214,180,0.4)',
            }}
          />
        )
      })}
    </div>
  )
}