import { useEffect, useState } from 'react'

interface RevealProps {
  src: string
  interval?: number
  /** Which part of the image to start from e.g. 'center', 'top', 'bottom left' */
  origin?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right'
}

const CLIP_STEPS: Record<string, string[]> = {
  'center':       ['inset(40% 40%)', 'inset(30% 30%)', 'inset(20% 20%)', 'inset(10% 10%)', 'inset(0% 0%)'],
  'top':          ['inset(0% 40% 80% 40%)', 'inset(0% 30% 60% 30%)', 'inset(0% 20% 40% 20%)', 'inset(0% 10% 20% 10%)', 'inset(0% 0%)'],
  'bottom':       ['inset(80% 40% 0% 40%)', 'inset(60% 30% 0% 30%)', 'inset(40% 20% 0% 20%)', 'inset(20% 10% 0% 10%)', 'inset(0% 0%)'],
  'left':         ['inset(40% 80% 40% 0%)', 'inset(30% 60% 30% 0%)', 'inset(20% 40% 20% 0%)', 'inset(10% 20% 10% 0%)', 'inset(0% 0%)'],
  'right':        ['inset(40% 0% 40% 80%)', 'inset(30% 0% 30% 60%)', 'inset(20% 0% 20% 40%)', 'inset(10% 0% 10% 20%)', 'inset(0% 0%)'],
  'top left':     ['inset(0% 80% 80% 0%)', 'inset(0% 60% 60% 0%)', 'inset(0% 40% 40% 0%)', 'inset(0% 20% 20% 0%)', 'inset(0% 0%)'],
  'top right':    ['inset(0% 0% 80% 80%)', 'inset(0% 0% 60% 60%)', 'inset(0% 0% 40% 40%)', 'inset(0% 0% 20% 20%)', 'inset(0% 0%)'],
  'bottom left':  ['inset(80% 80% 0% 0%)', 'inset(60% 60% 0% 0%)', 'inset(40% 40% 0% 0%)', 'inset(20% 20% 0% 0%)', 'inset(0% 0%)'],
  'bottom right': ['inset(80% 0% 0% 80%)', 'inset(60% 0% 0% 60%)', 'inset(40% 0% 0% 40%)', 'inset(20% 0% 0% 20%)', 'inset(0% 0%)'],
}

const origins = Object.keys(CLIP_STEPS)

export function Reveal({ src, interval = 2500 }: Omit<RevealProps, 'origin'>) {
  const [step, setStep] = useState(0)
  const [origin] = useState(() => origins[Math.floor(Math.random() * origins.length)])
  const clips = CLIP_STEPS[origin]

  useEffect(() => {
    setStep(0)
  }, [origin])

  useEffect(() => {
    const id = setInterval(() => {
      setStep(s => (s < clips.length - 1 ? s + 1 : s))
    }, interval)
    return () => clearInterval(id)
  }, [interval, clips])

  const maxZoom = 2.4
  const minZoom = 1.0

  const progress = step / (clips.length - 1)

  const scale = maxZoom - progress * (maxZoom - minZoom)

  return (
<div
  className="w-[500px] h-[500px] shrink-0 border-solid border-red-700 border-4 overflow-hidden relative"
  onContextMenu={e => e.preventDefault()}
>
  <img
    src={src}
    alt=""
    draggable={false}
    className="w-full h-full object-cover select-none"
    style={{
      transform: `scale(${scale})`,
      transformOrigin: origin,
      transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }}
  />
</div>
  )
}