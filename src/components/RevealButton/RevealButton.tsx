import { useState, useEffect } from 'react'
import { Reveal } from '../Reveal/Reveal'

export function RevealController({ src }: { src: string }) {
  const [step, setStep] = useState(0)
  const [buttonText, setButtonText] = useState('Reveal')
  
  useEffect(() => {
    if (step === 4) {
      setButtonText('Skip')
    }
  }, [step])

  return (
    <div className="flex flex-col items-center gap-4">
      <Reveal src={src} step={step} />

      <button
        onClick={() => setStep(s => Math.min(s + 1, 4))}
        className="px-4 py-2 bg-black text-white rounded">
        {buttonText}
      </button>
    </div>
  )
}