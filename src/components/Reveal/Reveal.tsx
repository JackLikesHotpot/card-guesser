import { useState } from 'react'

interface RevealProps {
  src: string
  step?: number
  /** optional: control from parent */
}

const CLIP_STEPS: Record<string, string[]> = {
  center: [
    'inset(40% 40%)',
    'inset(30% 30%)',
    'inset(20% 20%)',
    'inset(10% 10%)',
    'inset(0% 0%)',
  ],
  top: [
    'inset(0% 40% 80% 40%)',
    'inset(0% 30% 60% 30%)',
    'inset(0% 20% 40% 20%)',
    'inset(0% 10% 20% 10%)',
    'inset(0% 0%)',
  ],
  bottom: [
    'inset(80% 40% 0% 40%)',
    'inset(60% 30% 0% 30%)',
    'inset(40% 20% 0% 20%)',
    'inset(20% 10% 0% 10%)',
    'inset(0% 0%)',
  ],
  left: [
    'inset(40% 80% 40% 0%)',
    'inset(30% 60% 30% 0%)',
    'inset(20% 40% 20% 0%)',
    'inset(10% 20% 10% 0%)',
    'inset(0% 0%)',
  ],
  right: [
    'inset(40% 0% 40% 80%)',
    'inset(30% 0% 30% 60%)',
    'inset(20% 0% 20% 40%)',
    'inset(10% 0% 10% 20%)',
    'inset(0% 0%)',
  ],
  'top left': [
    'inset(0% 80% 80% 0%)',
    'inset(0% 60% 60% 0%)',
    'inset(0% 40% 40% 0%)',
    'inset(0% 20% 20% 0%)',
    'inset(0% 0%)',
  ],
  'top right': [
    'inset(0% 0% 80% 80%)',
    'inset(0% 0% 60% 60%)',
    'inset(0% 0% 40% 40%)',
    'inset(0% 0% 20% 20%)',
    'inset(0% 0%)',
  ],
  'bottom left': [
    'inset(80% 80% 0% 0%)',
    'inset(60% 60% 0% 0%)',
    'inset(40% 40% 0% 0%)',
    'inset(20% 20% 0% 0%)',
    'inset(0% 0%)',
  ],
  'bottom right': [
    'inset(80% 0% 0% 80%)',
    'inset(60% 0% 0% 60%)',
    'inset(40% 0% 0% 40%)',
    'inset(20% 0% 0% 20%)',
    'inset(0% 0%)',
  ],
}

const origins = Object.keys(CLIP_STEPS)

export function Reveal({ src, step = 0 }: RevealProps) {
  const [origin] = useState(
    () => origins[Math.floor(Math.random() * origins.length)]
  )

  const clips = CLIP_STEPS[origin]

  // ✅ safety clamp
  const safeStep = Math.max(0, Math.min(step, clips.length - 1))

  return (
<div className="w-[500px] h-[500px] overflow-hidden border-4 border-red-700 relative">
  
  {/* ZOOM LAYER (camera movement) */}
  <div
    className="absolute inset-0"
    style={{
      transform: `scale(${2.4 + (1 - 2.4) * (step / (CLIP_STEPS[origin].length - 1))})`,
      transformOrigin: origin,
      transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }}
  >
    {/* IMAGE */}
    <img
      src={src}
      alt=""
      draggable={false}
      className="w-full h-full object-cover select-none"
    />
  </div>

  {/* REVEAL MASK LAYER */}
  <div
    className="absolute inset-0"
    style={{
      clipPath: clips[safeStep],
      backgroundImage: `url(${src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition:
        'clip-path 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }}
  />
</div>
  )
}