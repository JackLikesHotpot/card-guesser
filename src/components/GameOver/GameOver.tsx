import type { RoundResult } from '../../types'

interface GameOverProps {
  score: number
  history: RoundResult[]
  onPlayAgain: () => void
}

export function GameOver({ score, history, onPlayAgain }: GameOverProps) {
  const correct = history.filter(r => !r.skipped).length
  const skipped = history.filter(r => r.skipped).length

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6">
      <div className="w-full max-w-1/3">

        <div className="text-center mb-8">
          <p className="text-[#555] text-xs tracking-widest uppercase mb-2">Game Over</p>
          <p className="text-5xl font-medium text-[#e8e4dc]">{score}</p>
          <p className="text-[#555] text-sm mt-1">points</p>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a] text-center">
            <p className="text-2xl font-medium text-[#6abf7b]">{correct}</p>
            <p className="text-xs text-[#555] uppercase tracking-widest mt-1">Correct</p>
          </div>
          <div className="flex-1 bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a] text-center">
            <p className="text-2xl font-medium text-[#888]">{skipped}</p>
            <p className="text-xs text-[#555] uppercase tracking-widest mt-1">Skipped</p>
          </div>
          <div className="flex-1 bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a] text-center">
            <p className="text-2xl font-medium text-[#e8e4dc]">{history.length}</p>
            <p className="text-xs text-[#555] uppercase tracking-widest mt-1">Total</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-6 max-h-64 overflow-y-auto">
          {history.map((r, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg px-3 py-2 border border-[#2a2a2a]">
              <img src={r.src} className="w-7 h-10 object-cover rounded flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#ccc] truncate">{r.name}</p>
                <p className="text-[11px] text-[#555]">
                  {r.skipped ? 'skipped' : `${r.steps} reveal${r.steps !== 1 ? 's' : ''}`}
                </p>
              </div>
              <span className={`text-xs font-medium flex-shrink-0 ${r.skipped ? 'text-[#555]' : 'text-[#6abf7b]'}`}>
                {r.skipped ? '—' : `+${r.score}`}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full py-3 bg-[#e8e4dc] text-[#0f0f0f] rounded-lg text-xs tracking-widest uppercase font-medium hover:bg-white transition-colors"
        >
          Play Again
        </button>

      </div>
    </div>
  )
}
