import { useState, useEffect } from 'react'
import raw from '../data/card_info.json'
import { Reveal } from './components/Reveal/Reveal.tsx'

interface Card {
  name: string
  image_url: string 
  tag: string
  sets: string[]
}

const App = () => { 
  const data = raw as Card[]
  const bucket_url = import.meta.env.VITE_BUCKET_URL
  const [value, setValue] = useState(0);
  const [total, setTotal] = useState(data.length)
  const [name, setName] = useState('')
  const [step, setStep] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    pickRandomCard()
  }, [])

useEffect(() => {
  setTimeLeft(60)

  const interval = setInterval(() => {
    setTimeLeft(t => {
      if (t <= 1) {
        clearInterval(interval)
        handleSkip()
        return 0
      }
      return t - 1
    })
  }, 1000)

  return () => clearInterval(interval)
}, [value])

  const pickRandomCard = () => {
    const chosen = Math.floor(Math.random() * data.length)
    setValue(chosen)
    setName(data[chosen].name.replace(/[^a-zA-Z0-9 \-'!,&★☆.]/g, ''))
  }

  const handleNext = () => {
    if (disabled) return
    setStep(s => Math.min(s + 1, 4))

    setDisabled(true)
    setTimeout(() => {
      setDisabled(false)
    }, 1000)
  }

  const handleSkip = () => {
    pickRandomCard()
    setStep(0)
  }

return (
    <div className="flex flex-col items-center gap-4 p-6">
      
      {/* Reveal component */}
      <Reveal src={`${bucket_url}${name}.jpg`} step={step} />

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Next
        </button>

        <button
          onClick={handleSkip}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Skip
        </button>
      </div>
      <p className="text-gray-600">
        Next card in: {timeLeft}s
      </p>
    </div>
  )
}

export default App
