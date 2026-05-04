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
        <button
          onClick={onNext}
          className="px-7 py-3 bg-[#e8e4dc] text-[#0f0f0f] rounded-lg text-sm tracking-widest uppercase font-medium hover:bg-white transition-colors"
        >
          Reveal
        </button>
        <button
          onClick={onSkip}
          className="px-7 py-3 bg-[#1a1a1a] text-[#888] rounded-lg text-sm tracking-widest uppercase border border-[#2a2a2a] hover:border-[#444] hover:text-[#aaa] transition-colors"
        >
          Skip
        </button>
      </div>
      <p className="text-[#c3c3c3] text-sm tracking-wide">Next card in {timeLeft}s</p>
      <div className="h-5">
        {revealed && (
          <p className="text-[#888] text-sm">
            The card was: <span className="text-[#e8e4dc] font-medium">{revealed}</span>
          </p>
        )}
      </div>
    </div>
  )
}
