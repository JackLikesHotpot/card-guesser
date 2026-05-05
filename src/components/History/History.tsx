import type { RoundResult } from '../../types'

interface HistoryProps {
  history: RoundResult[]
}

export function History({ history }: HistoryProps) {
  if (history.length === 0) return null

  return (
    <div>
      <p className="text-[#787575] text-xs tracking-widest uppercase mb-2">History</p>
      <div className="flex flex-col gap-2">
        {[...history].reverse().map((r, i) => (
          <div key={i} className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg px-3 py-2 border border-[#2a2a2a]">
            <img src={r.src} className="w-7 h-10 object-cover rounded flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-base text-[#ccc] truncate">{r.name}</p>
              <p className="text-sm text-[#555]">
                {r.skipped ? 'Skipped' : `${r.steps} reveal${r.steps !== 1 ? 's' : ''}`}
              </p>
            </div>
            <span className={`text-xs font-medium flex-shrink-0 ${r.skipped ? 'text-[#555]' : 'text-[#6abf7b]'}`}>
              {r.skipped ? '—' : `+${r.score}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
