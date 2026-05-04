interface WrongGuessesProps {
  guesses: string[]
}

export function WrongGuesses({ guesses }: WrongGuessesProps) {
  if (guesses.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 max-w-md">
      {guesses.map(g => (
        <span key={g} className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full border border-red-200">
          {g}
        </span>
      ))}
    </div>
  )
}