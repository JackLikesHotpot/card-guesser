import { useState, useEffect } from 'react'

interface RevealProps {
  src: string
  step?: number
}

const CLIP_STEPS: Record<string, string[]> = {
  center:              ['inset(47.5% 47.5%)',          'inset(40% 40%)',           'inset(30% 30%)',           'inset(15% 15%)',           'inset(0% 0%)'],
  top:                 ['inset(0% 47.5% 95% 47.5%)',   'inset(0% 40% 80% 40%)',    'inset(0% 30% 60% 30%)',    'inset(0% 15% 30% 15%)',    'inset(0% 0%)'],
  bottom:              ['inset(95% 47.5% 0% 47.5%)',   'inset(80% 40% 0% 40%)',    'inset(60% 30% 0% 30%)',    'inset(30% 15% 0% 15%)',    'inset(0% 0%)'],
  left:                ['inset(47.5% 95% 47.5% 0%)',   'inset(40% 80% 40% 0%)',    'inset(30% 60% 30% 0%)',    'inset(15% 30% 15% 0%)',    'inset(0% 0%)'],
  right:               ['inset(47.5% 0% 47.5% 95%)',   'inset(40% 0% 40% 80%)',    'inset(30% 0% 30% 60%)',    'inset(15% 0% 15% 30%)',    'inset(0% 0%)'],
  'top left':          ['inset(0% 95% 95% 0%)',         'inset(0% 80% 80% 0%)',     'inset(0% 60% 60% 0%)',     'inset(0% 30% 30% 0%)',     'inset(0% 0%)'],
  'top right':         ['inset(0% 0% 95% 95%)',         'inset(0% 0% 80% 80%)',     'inset(0% 0% 60% 60%)',     'inset(0% 0% 30% 30%)',     'inset(0% 0%)'],
  'bottom left':       ['inset(95% 95% 0% 0%)',         'inset(80% 80% 0% 0%)',     'inset(60% 60% 0% 0%)',     'inset(30% 30% 0% 0%)',     'inset(0% 0%)'],
  'bottom right':      ['inset(95% 0% 0% 95%)',         'inset(80% 0% 0% 80%)',     'inset(60% 0% 0% 60%)',     'inset(30% 0% 0% 30%)',     'inset(0% 0%)'],
  'upper left':        ['inset(5% 70% 70% 5%)',         'inset(5% 55% 55% 5%)',     'inset(5% 35% 35% 5%)',     'inset(5% 15% 15% 5%)',     'inset(0% 0%)'],
  'upper right':       ['inset(5% 5% 70% 70%)',         'inset(5% 5% 55% 55%)',     'inset(5% 5% 35% 35%)',     'inset(5% 5% 15% 15%)',     'inset(0% 0%)'],
  'lower left':        ['inset(70% 70% 5% 5%)',         'inset(55% 55% 5% 5%)',     'inset(35% 35% 5% 5%)',     'inset(15% 15% 5% 5%)',     'inset(0% 0%)'],
  'lower right':       ['inset(70% 5% 5% 70%)',         'inset(55% 5% 5% 55%)',     'inset(35% 5% 5% 35%)',     'inset(15% 5% 5% 15%)',     'inset(0% 0%)'],
  'top strip':         ['inset(0% 10% 90% 10%)',        'inset(0% 10% 75% 10%)',    'inset(0% 10% 55% 10%)',    'inset(0% 10% 25% 10%)',    'inset(0% 0%)'],
  'bottom strip':      ['inset(90% 10% 0% 10%)',        'inset(75% 10% 0% 10%)',    'inset(55% 10% 0% 10%)',    'inset(25% 10% 0% 10%)',    'inset(0% 0%)'],
  'left strip':        ['inset(10% 90% 10% 0%)',        'inset(10% 75% 10% 0%)',    'inset(10% 55% 10% 0%)',    'inset(10% 25% 10% 0%)',    'inset(0% 0%)'],
}

const origins = Object.keys(CLIP_STEPS)

export function Reveal({ src, step = 0 }: RevealProps) {
  const [origin, setOrigin] = useState(() => origins[Math.floor(Math.random() * origins.length)])
  const [loaded, setLoaded] = useState(false)

  const clips = CLIP_STEPS[origin]
  const safeStep = Math.max(0, Math.min(step, clips.length - 1))

  useEffect(() => {
    setLoaded(false)
    setOrigin(origins[Math.floor(Math.random() * origins.length)])
  }, [src])

  return (
    <div
      className="w-full h-full overflow-hidden relative bg-neutral-900 rounded-md"
      onContextMenu={e => e.preventDefault()}
    >
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <div className="w-8 h-8 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
          <span className="text-neutral-400 text-sm">Loading...</span>
        </div>
      )}

      <div
        key={src}
        className="absolute inset-0"
        style={{
          opacity: loaded ? 1 : 0,
          transform: `scale(${2.4 + (1 - 2.4) * (safeStep / (clips.length - 1))})`,
          transformOrigin: origin,
          transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          className="w-full h-full object-cover select-none"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  )
}