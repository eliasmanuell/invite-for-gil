import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Celebration from './Celebration'
import FinalMessage from './FinalMessage'

type Phase = 'celebrating' | 'final'

export default function AcceptedFlow() {
  const [phase, setPhase] = useState<Phase>('celebrating')
  const handleCelebrationDone = useCallback(() => setPhase('final'), [])

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === 'celebrating' ? (
          <Celebration key="celebration" onDone={handleCelebrationDone} />
        ) : (
          <FinalMessage key="final" />
        )}
      </AnimatePresence>
    </>
  )
}