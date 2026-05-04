interface GameHeaderProps {
  gameTimeLeft: number
  score: number
  lastScore: number | null
}

export function GameHeader({ gameTimeLeft, score, lastScore }: GameHeaderProps) {
  const mins = Math.floor(gameTimeLeft / 60)
  const secs = String(gameTimeLeft % 60).padStart(2, '0')

  return (
    <div className="flex justify-between items-center px-4 py-3 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] mb-4">
      <div className="text-base text-[#888]">
        Time <span className="text-[#e8e4dc] font-medium">{mins}:{secs}</span>
      </div>
      <div className="text-sm text-[#444] tracking-widest uppercase">YGO Card Guesser</div>
      <div className="text-base text-[#888] flex items-center gap-2">
        Score <span className="text-[#e8e4dc] font-medium">{score}</span>
        {lastScore !== null && (
          <span className="text-[#6abf7b] text-xs">+{lastScore}</span>
        )}
      </div>
    </div>
  )
}
