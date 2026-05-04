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

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault()
      handleSelect(filtered[highlighted])
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={guess}
        onChange={e => { onChange(e.target.value); setShowDropdown(true); setHighlighted(-1) }}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        onFocus={() => setShowDropdown(true)}
        placeholder="Search for a card..."
        className={`w-full px-4 py-2 rounded border text-sm outline-none transition-colors ${
          feedback === 'correct' ? 'border-green-500 bg-green-50' :
          feedback === 'wrong' ? 'border-red-500 bg-red-50' :
          'border-gray-300'
        }`}
      />

      {showDropdown && filtered.length > 0 && (
        <ul className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
          {filtered.map((n, i) => (
            <li
              key={n}
              onMouseDown={() => handleSelect(n)}
              className={`px-4 py-2 text-sm cursor-pointer ${
                i === highlighted ? 'bg-gray-200' : 'hover:bg-gray-100'
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