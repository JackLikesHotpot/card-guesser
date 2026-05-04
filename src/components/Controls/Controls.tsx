interface ControlsProps {
  timeLeft: number
  revealed: string | null
  onNext: () => void
  onSkip: () => void
}

export function Controls({ timeLeft, revealed, onNext, onSkip }: ControlsProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        <button onClick={onNext} className="px-4 py-2 bg-black text-white rounded">
          Next
        </button>
        <button onClick={onSkip} className="px-4 py-2 bg-gray-300 rounded">
          Skip
        </button>
      </div>
      <p className="text-gray-600 text-sm">Next card in: {timeLeft}s</p>
      <div className="h-6">
        {revealed && (
          <p className="text-gray-500 text-sm">
            The card was: <strong className="text-black">{revealed}</strong>
          </p>
        )}
      </div>
    </div>
  )
}