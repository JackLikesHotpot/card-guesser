interface WrongGuessesProps {
  guesses: string[]
}

export function WrongGuesses({ guesses }: WrongGuessesProps) {
  if (guesses.length === 0) return null

  return (
    <div>
      <p className="text-[#555] text-xs tracking-widest uppercase mb-2">Wrong guesses</p>
      <div className="flex flex-wrap gap-2">
        {guesses.map(g => (
          <span
            key={g}
            className="text-xs px-3 py-1 rounded-full bg-[#2a1515] text-[#e06060] border border-[#3a1a1a]"
          >
            {g}
          </span>
        ))}
      </div>
    </div>
  )
}
