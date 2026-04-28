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

  useEffect(() => {
    const chosen: number = Math.floor(Math.random() * total)
    setValue(chosen)
    setName(data[chosen]['name'])
  }, [])

  console.log(`${bucket_url}/${name}.jpg`)
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Reveal src={`${bucket_url}${name}.jpg`} />
    </div>
  )
}

export default App
