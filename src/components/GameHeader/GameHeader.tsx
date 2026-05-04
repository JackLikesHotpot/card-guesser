interface GameHeaderProps {
  gameTimeLeft: number
  score: number
  lastScore: number | null
}

export function GameHeader({ gameTimeLeft, score, lastScore }: GameHeaderProps) {
  const mins = Math.floor(gameTimeLeft / 60)
  const secs = String(gameTimeLeft % 60).padStart(2, '0')

  return (
    <div className="flex gap-6 text-sm">
      <span className="text-gray-600">Time: <strong>{mins}:{secs}</strong></span>
      <span className="text-gray-600">Score: <strong>{score}</strong></span>
      {lastScore !== null && (
        <span className="text-green-600">+{lastScore} last round</span>
      )}
    </div>
  )
}