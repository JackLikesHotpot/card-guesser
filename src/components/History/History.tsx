interface RoundResult {
  name: string
  src: string
  steps: number
  score: number
  skipped: boolean
}

interface HistoryProps {
  history: RoundResult[]
}

export function History({ history }: HistoryProps) {
  if (history.length === 0) return null

  return (
    <div className="w-full max-w-md flex flex-col gap-2 mt-4">
      <h2 className="font-semibold text-sm text-gray-500 uppercase tracking-wide">History</h2>
      {history.map((r, i) => (
        <div key={i} className="flex items-center gap-3 border rounded p-2">
          <img src={r.src} className="w-10 h-14 object-cover rounded" />
          <div className="flex-1">
            <p className="text-sm font-medium">{r.name}</p>
            <p className="text-xs text-gray-500">
              {r.skipped ? 'Skipped' : `${r.steps} reveal${r.steps !== 1 ? 's' : ''}`}
            </p>
          </div>
          <span className={`text-sm font-bold ${r.skipped ? 'text-gray-400' : 'text-green-600'}`}>
            {r.skipped ? 'skipped' : `+${r.score}`}
          </span>
        </div>
      ))}
    </div>
  )
}