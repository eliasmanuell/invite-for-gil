import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const COLORS = [
  '#f3dda9',
  '#f48cb2',
  '#e14b80',
  '#d7b26a',
  '#fff8ef',
  '#ff9cbe',
  '#ffd7a8',
]

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  color: string
}

interface Rocket {
  x: number
  y: number
  vy: number
  targetY: number
}

export default function Fireworks() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (reduce) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const sparks: Spark[] = []
    const rockets: Rocket[] = []
    let nextLaunch = performance.now() + 220
    let raf = 0
    let last = performance.now()

    const explode = (x: number, y: number) => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const n = 70 + Math.floor(Math.random() * 46)
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2
        const speed = 1.6 + Math.random() * 4.4
        sparks.push({
          x,
          y,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          life: 0,
          max: 55 + Math.random() * 70,
          size: 1.4 + Math.random() * 2.2,
          color,
        })
      }
    }

    const launch = () => {
      rockets.push({
        x: w * (0.14 + Math.random() * 0.72),
        y: h + 8,
        vy: -(10 + Math.random() * 3.2),
        targetY: h * (0.1 + Math.random() * 0.32),
      })
    }

    const tick = (t: number) => {
      const dt = Math.min(40, t - last) / 16.67
      last = t
      ctx.clearRect(0, 0, w, h)

      if (t > nextLaunch && rockets.length < 5) {
        launch()
        nextLaunch = t + 480 + Math.random() * 780
      }

      ctx.globalCompositeOperation = 'lighter'
      for (let i = rockets.length - 1; i >= 0; i--) {
        const rk = rockets[i]
        rk.y += rk.vy * dt
        ctx.beginPath()
        ctx.arc(rk.x, rk.y, 3.4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,244,238,0.95)'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(rk.x, rk.y + 8, 11, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(215,178,106,0.35)'
        ctx.fill()
        if (rk.y <= rk.targetY) {
          explode(rk.x, rk.y)
          rockets.splice(i, 1)
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i]
        p.life += dt
        if (p.life >= p.max) {
          sparks.splice(i, 1)
          continue
        }
        p.vx *= Math.pow(0.985, dt)
        p.vy = p.vy * Math.pow(0.985, dt) + 0.045 * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        const a = 1 - p.life / p.max
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.4 + a * p.size * 0.9, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.min(0.9, a * 1.1)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduce])

  if (reduce) return null
  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
    />
  )
}