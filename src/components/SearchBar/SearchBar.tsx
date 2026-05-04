import { useState } from 'react'

interface SearchBarProps {
  guess: string
  feedback: 'correct' | 'wrong' | null
  filtered: string[]
  onChange: (value: string) => void
  onGuess: (selected: string) => void
  onSelect: (name: string) => void
}

export function SearchBar({ guess, feedback, filtered, onChange, onGuess, onSelect }: SearchBarProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)

  const handleSelect = (n: string) => {
    onSelect(n)
    setShowDropdown(false)
    setHighlighted(-1)
    onGuess(n)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || filtered.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)) }
    else if (e.key === 'Enter' && highlighted >= 0) { e.preventDefault(); handleSelect(filtered[highlighted]) }
  }

  const borderColor = feedback === 'correct'
    ? 'border-[#3a6b45]'
    : feedback === 'wrong'
    ? 'border-[#6b3a3a]'
    : 'border-[#2a2a2a]'

  return (
    <div className="relative w-full">
      <p className="text-[#707070] text-xs tracking-widest uppercase mb-2">Guess the card</p>
      <input
        type="text"
        value={guess}
        onChange={e => { onChange(e.target.value); setShowDropdown(true); setHighlighted(-1) }}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search cards..."
        className={`w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border text-base text-[#e8e4dc] placeholder-[#444] outline-none transition-colors ${borderColor}`}
      />

      {showDropdown && filtered.length > 0 && (
        <ul className="absolute top-full mt-1 w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg z-10 overflow-hidden">
          {filtered.map((n, i) => (
            <li
              key={n}
              onMouseDown={() => handleSelect(n)}
              className={`px-4 py-3 text-sm cursor-pointer border-b border-[#222] last:border-0 transition-colors ${
                i === highlighted ? 'bg-[#252525] text-[#e8e4dc]' : 'text-[#aaa] hover:bg-[#222] hover:text-[#e8e4dc]'
              }`}
            >
              {n}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
