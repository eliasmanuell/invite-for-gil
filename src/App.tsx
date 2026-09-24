import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import FloatingElements from './components/FloatingElements'
import GlowBlobs from './components/GlowBlobs'
import Intro from './components/Intro'
import InvitationCard from './components/InvitationCard'
import AcceptedFlow from './components/AcceptedFlow'
import DeclinedView from './components/DeclinedView'
import type { InvitationState } from './types'

export default function App() {
  const [state, setState] = useState<InvitationState>('intro')

  const goToInvitation = useCallback(() => setState('invitation'), [])

  return (
    <div className="romantic-bg relative min-h-dvh w-full overflow-x-hidden">
      <FloatingElements />
      <GlowBlobs />

      <main className="relative z-10 flex min-h-dvh items-center justify-center px-4 py-10">
        <AnimatePresence mode="wait">
          {state === 'intro' && (
            <Intro key="intro" onDone={goToInvitation} />
          )}

          {state === 'invitation' && (
            <InvitationCard
              key="invitation"
              onAccept={() => setState('accepted')}
              onDecline={() => setState('declined')}
            />
          )}

          {state === 'accepted' && <AcceptedFlow key="accepted" />}

          {state === 'declined' && (
            <DeclinedView key="declined" onBack={goToInvitation} />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}