import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { EASE_OUT, fadeUp, stagger } from '../lib/motion'

interface DeclinedViewProps {
  onBack: () => void
}

export default function DeclinedView({ onBack }: DeclinedViewProps) {
  return (
    <motion.div
      className="relative z-20 w-full max-w-md px-4 text-center sm:px-0"
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.4 } }}
      variants={stagger(0.15, 0.18)}
    >
      <motion.h2
        variants={fadeUp}
        className="font-display text-5xl font-bold text-cream sm:text-6xl"
      >
        Tudo bem. ❤️
      </motion.h2>

      <motion.p
        variants={fadeUp}
        className="mt-6 text-lg text-blush/90"
      >
        Obrigado por seres sincera comigo.
      </motion.p>

      <motion.div variants={fadeUp} className="gold-rule mx-auto mt-7 w-44" />

      <motion.p
        variants={fadeUp}
        className="mx-auto mt-6 max-w-sm text-[15px] leading-relaxed text-blush/80"
      >
        Independentemente da resposta, espero que continues a ter um dia bonito.
        🌹
      </motion.p>

      <motion.button
        type="button"
        onClick={onBack}
        variants={fadeUp}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-6 py-2.5 text-sm font-medium tracking-wide text-gold-light backdrop-blur-md transition-colors hover:border-gold/70 hover:bg-white/10"
      >
        <RotateCcw size={15} />
        Voltar ao convite
      </motion.button>
    </motion.div>
  )
}