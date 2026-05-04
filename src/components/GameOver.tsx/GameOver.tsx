import { History } from '../History/History.tsx'

interface RoundResult {
  name: string
  src: string
  steps: number
  score: number
  skipped: boolean
}

interface GameOverProps {
  score: number
  history: RoundResult[]
  onPlayAgain: () => void
}

export function GameOver({ score, history, onPlayAgain }: GameOverProps) {
  return (
    <div className="flex flex-col items-center gap-6 p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Game Over</h1>
      <p className="text-lg">Final Score: <strong>{score}</strong></p>
      <History history={history} />
      <button onClick={onPlayAgain} className="px-6 py-2 bg-black text-white rounded">
        Play Again
      </button>
    </div>
  )
}