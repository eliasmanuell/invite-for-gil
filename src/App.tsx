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

  const handleAccept = useCallback(() => {
    const formData = new URLSearchParams()
    formData.set('form-name', 'convite-aceite')
    formData.set('evento', 'O convite foi aceito pela pessoa que o recebeu.')

    void fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })
      .then((response) => {
        if (!response.ok) {
          console.error('Acceptance notification failed', response.status)
        }
      })
      .catch(() => undefined)
    setState('accepted')
  }, [])

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
              onAccept={handleAccept}
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