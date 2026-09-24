import type { CSSProperties } from 'react'

const BLOBS: Array<{
  style: CSSProperties
  dur: number
  delay: number
}> = [
  {
    style: {
      top: '-18%',
      left: '-12%',
      width: '52vmax',
      height: '52vmax',
      background:
        'radial-gradient(circle, rgba(176,42,88,0.5) 0%, rgba(176,42,88,0) 65%)',
      filter: 'blur(30px)',
    },
    dur: 26,
    delay: 0,
  },
  {
    style: {
      bottom: '-22%',
      right: '-14%',
      width: '58vmax',
      height: '58vmax',
      background:
        'radial-gradient(circle, rgba(215,178,106,0.28) 0%, rgba(215,178,106,0) 65%)',
      filter: 'blur(36px)',
    },
    dur: 30,
    delay: 3,
  },
  {
    style: {
      top: '28%',
      right: '6%',
      width: '30vmax',
      height: '30vmax',
      background:
        'radial-gradient(circle, rgba(244,140,178,0.28) 0%, rgba(244,140,178,0) 65%)',
      filter: 'blur(26px)',
    },
    dur: 22,
    delay: -6,
  },
]

export default function GlowBlobs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className="animate-drift-blob absolute"
          style={
            {
              ...blob.style,
              '--dur': `${blob.dur}s`,
              '--delay': `${blob.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}