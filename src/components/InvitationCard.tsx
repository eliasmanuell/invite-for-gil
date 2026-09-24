import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Heart } from 'lucide-react'
import EscapeButton from './EscapeButton'
import { EASE_OUT, fadeUp, stagger } from '../lib/motion'

const SPARKS: Array<{ left: number; delay: number }> = [
  { left: 18, delay: 0 },
  { left: 42, delay: 0.5 },
  { left: 66, delay: 0.9 },
  { left: 84, delay: 1.3 },
]

interface InvitationCardProps {
  onAccept: () => void
  onDecline: () => void
}

export default function InvitationCard({ onAccept, onDecline }: InvitationCardProps) {
  const anchorRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      className="glass relative z-10 w-full max-w-xl rounded-[1.75rem] px-6 py-8 text-center sm:px-10 sm:py-10"
      variants={stagger(0.15, 0.12)}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      {/* gold corner flourishes */}
      <div aria-hidden className="pointer-events-none absolute left-4 top-4 h-7 w-7 rounded-tl-lg border-l border-t border-gold/55" />
      <div aria-hidden className="pointer-events-none absolute bottom-4 right-4 h-7 w-7 rounded-br-lg border-b border-r border-gold/55" />

      <motion.div variants={fadeUp} className="flex flex-col items-center">
        <motion.span
          className="mb-3 text-rose-light"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.25, 1] }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 }}
        >
          <Heart
            className="animate-twinkle"
            size={30}
            fill="currentColor"
            strokeWidth={0}
            style={{ '--dur': '2.2s', '--delay': '0s' } as CSSProperties}
          />
        </motion.span>

        <h1 className="font-display text-2xl font-semibold text-cream sm:text-3xl">
          Tenho um convite para ti{' '}
          <motion.span
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            ❤️
          </motion.span>
        </h1>
      </motion.div>

      <motion.p
        variants={fadeUp}
        className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-blush/90 sm:text-base"
      >
        Estava aqui a pensar que talvez pudéssemos transformar um sábado normal
        em uma memória bonita.
      </motion.p>

      <motion.p variants={fadeUp} className="mt-6 text-sm font-light italic text-rose-light/80">
        Então queria saber...
      </motion.p>

      <motion.h2
        variants={fadeUp}
        className="text-gradient-rose text-glow-soft mt-2 font-display text-3xl font-bold italic sm:text-4xl md:text-5xl"
      >
        Queres sair comigo?
      </motion.h2>

      <motion.div
        variants={fadeUp}
        className="mx-auto mt-7 flex max-w-md flex-wrap items-center justify-center gap-3"
      >
        <span className="glass-chip flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-cream/95">
          <Calendar size={16} className="text-gold" />
          Sábado, 03 de Outubro
        </span>
        <span className="glass-chip flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-cream/95">
          <Clock size={16} className="text-gold" />
          A partir das 12h
        </span>
      </motion.div>

      <motion.div variants={fadeUp} className="gold-rule mx-auto mt-7 w-40" />

      <motion.p
        variants={fadeUp}
        className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-blush/75 italic"
      >
        Só nós dois, uma boa conversa e talvez algumas histórias para contar
        depois. 🌹
      </motion.p>

      {/* buttons */}
      <div className="relative mt-8">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          <motion.button
            type="button"
            onClick={onAccept}
            className="pulse-glow btn-shine group relative flex items-center gap-2 rounded-full bg-linear-to-br from-rose via-rose-deep to-burgundy px-8 py-3.5 text-sm font-bold tracking-[0.2em] text-white shadow-[0_18px_40px_-12px_rgba(225,75,128,0.6)] transition-transform duration-200 hover:scale-[1.05] active:scale-95"
            whileTap={{ scale: 0.94 }}
          >
            <Heart size={18} fill="currentColor" strokeWidth={0} />
            ACEITAR
            <span aria-hidden className="pointer-events-none absolute inset-0">
              {SPARKS.map((s, i) => (
                <motion.span
                  key={i}
                  className="absolute bottom-3 h-1.5 w-1.5 rounded-full bg-white/90"
                  style={{ left: `${s.left}%` }}
                  animate={{ y: [0, -26], opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: s.delay,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </span>
          </motion.button>

          <div ref={anchorRef} className="h-11 w-[8.8rem]" aria-hidden />
        </div>

        <EscapeButton anchor={anchorRef} onDecline={onDecline} />
      </div>

      <motion.button
        type="button"
        onClick={onDecline}
        className="relative z-20 mt-9 text-xs font-light tracking-wide text-blush/45 underline decoration-dotted underline-offset-4 transition-colors hover:text-blush/75"
        variants={fadeUp}
      >
        Se realmente quiseres recusar, podes tocar aqui.
      </motion.button>
    </motion.div>
  )
}