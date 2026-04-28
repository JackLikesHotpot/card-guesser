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


  useEffect(() => {
    const chosen: number = Math.floor(Math.random() * total)
    setValue(chosen)
    setName(data[chosen]['name'])
  }, [])

  const handleNext = () => {
    setStep(s => Math.min(s + 1, 4))
  }

  const handleReset = () => {
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
          onClick={handleReset}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Reset
        </button>
      </div>

      {/* Debug (optional) */}
      <p>Step: {step}</p>
    </div>
  )
}

export default App
