import { motion } from 'framer-motion'
import { Calendar, Clock, Heart } from 'lucide-react'
import { EASE_OUT, fadeUp, stagger } from '../lib/motion'

export default function FinalMessage() {
  return (
    <motion.div
      className="relative z-20 w-full max-w-lg px-4 text-center sm:px-0"
      initial="hidden"
      animate="show"
      variants={stagger(0.2, 0.16)}
      exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.4 } }}
    >
      <motion.div
        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-rose-light/40 bg-white/5 shadow-[0_0_40px_rgba(225,75,128,0.35)] backdrop-blur-md"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.15 }}
      >
        <Heart size={30} fill="#e14b80" strokeWidth={0} />
      </motion.div>

      <motion.h2
        variants={fadeUp}
        className="text-gradient-rose text-glow-soft font-display text-5xl font-bold sm:text-6xl"
      >
        EU SABIA! ❤️
      </motion.h2>

      <motion.p
        variants={fadeUp}
        className="mt-4 text-lg text-blush/95"
      >
        Então temos um encontro marcado.
      </motion.p>

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

      <motion.div variants={fadeUp} className="gold-rule mx-auto mt-7 w-44" />

      <motion.p
        variants={fadeUp}
        className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-blush/90"
      >
        Obrigado por dizer sim.
        <br />
        Agora só falta transformar este convite em uma memória que os dois vamos
        querer guardar.
      </motion.p>

      <motion.p
        variants={fadeUp}
        className="font-display text-2xl font-semibold italic text-cream"
      >
        Até sábado. ❤️
      </motion.p>

      <motion.p
        variants={fadeUp}
        className="mx-auto mt-6 max-w-md text-xs font-light text-blush/55 italic"
      >
        P.S.: Prometo que o meu convite pessoalmente será ainda melhor que este. 😉
      </motion.p>
    </motion.div>
  )
}