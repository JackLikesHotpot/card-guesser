import { useState, useMemo } from 'react'
import type { Card } from '../../types'

interface SettingsProps {
  data: Card[]
  onStart: (settings: GameSettings) => void
}

export interface GameSettings {
  gameDuration: number
  cardDuration: number
  allowedTypes: string[]
  allowedArchetypes: string[]
  allowedSets: string[]
  allowDuplicates: boolean
  allowEasyDropdown: boolean
}

// only enable easy dropdown button if an archetype/set is selected

export function Settings({ data, onStart }: SettingsProps) {
  const [gameDuration, setGameDuration] = useState(900)
  const [cardDuration, setCardDuration] = useState(60)
  const [allowedTypes, setAllowedTypes] = useState<string[]>([])
  const [allowedArchetypes, setAllowedArchetypes] = useState<string[]>([])
  // const [allowedTags, setAllowedTags] = useState<string[]>([])
  const [allowedSets, setAllowedSets] = useState<string[]>([])
  const [archetypeSearch, setArchetypeSearch] = useState('')
  const [setSearch, setSetSearch] = useState('')
  const [allowDuplicates, setAllowDuplicates] = useState(false)
  const [allowEasyDropdown, setAllowEasyDropdown] = useState(false)
  const allTypes = useMemo(() => [...new Set(data.map(c => c.type).filter(Boolean))].sort(), [data])
  const allArchetypes = useMemo(() => [...new Set(data.map(c => c.archetype).filter(Boolean))].sort(), [data])
  // const allTags = useMemo(() => [...new Set(data.map(c => c.tag).filter(Boolean))].sort(), [data])
  const allSets = useMemo(() => [...new Set(data.flatMap(c => c.sets).filter(Boolean))].sort(), [data])

  const filteredArchetypes = allArchetypes.filter(a => a.toLowerCase().includes(archetypeSearch.toLowerCase()))
  const filteredSets = allSets.filter(s => s.toLowerCase().includes(setSearch.toLowerCase()))

  const toggle = (value: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value])
  }

  const handleStart = () => {
    onStart({ gameDuration, cardDuration, allowedTypes, allowedArchetypes, allowedSets, allowDuplicates, allowEasyDropdown })
  }

  const matchingCards = data.filter(c => {
    if (allowedTypes.length && !allowedTypes.includes(c.type)) return false
    if (allowedArchetypes.length && !allowedArchetypes.includes(c.archetype)) return false
    // if (allowedTags.length && !allowedTags.includes(c.tag)) return false
    if (allowedSets.length && !c.sets.some(s => allowedSets.includes(s))) return false
    return true
  }).length

  return (
    <div className="min-h-screen bg-[#1c1c1c] p-8 flex justify-center">
      <div className="w-1/2">
        <div className="text-center mb-8">
          <p className="text-[#606060] text-xs tracking-widest uppercase mb-2">Settings</p>
          <p className="text-[#f5f5f5] text-3xl font-medium">Yu-Gi-Oh! Card Guesser</p>
        </div>

        <div className="flex flex-col gap-6">

          {/* Timers */}
          <div className="bg-[#272727] border border-[#383838] rounded-lg p-5">
            <p className="text-[#f5f5f5] text-sm font-medium mb-4">Timers</p>
            <div className="flex gap-6">
              <div className="flex-1">
                <p className="text-[#b0b0b0] text-xs tracking-widest uppercase mb-2">Game duration (seconds)</p>
                <input
                  type="number"
                  min={30}
                  max={3600}
                  value={gameDuration}
                  onChange={e => setGameDuration(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-[#1c1c1c] border border-[#383838] rounded-lg text-[#f5f5f5] text-sm outline-none"
                />
              </div>
              <div className="flex-1">
                <p className="text-[#b0b0b0] text-xs tracking-widest uppercase mb-2">Per card (seconds)</p>
                <input
                  type="number"
                  min={5}
                  max={300}
                  value={cardDuration}
                  onChange={e => setCardDuration(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-[#1c1c1c] border border-[#383838] rounded-lg text-[#f5f5f5] text-sm outline-none"
                />
              </div>
            </div>
          </div>

        <div className="bg-[#272727] border border-[#383838] rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#f5f5f5] text-sm font-medium">Allow duplicates</p>
              <p className="text-[#606060] text-xs mt-1">Same card can appear more than once</p>
            </div>
            <button
              onClick={() => setAllowDuplicates(d => !d)}
              className={`w-11 h-6 rounded-full transition-colors relative ${allowDuplicates ? 'bg-[#f5f5f5]' : 'bg-[#383838]'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full transition-all ${allowDuplicates ? 'left-6 bg-[#1c1c1c]' : 'left-1 bg-[#606060]'}`} />
            </button>
          </div>
        </div>

        <div className="bg-[#272727] border border-[#383838] rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#f5f5f5] text-sm font-medium">Enable easy dropdown?</p>
              <p className="text-[#606060] text-xs mt-1">Dropdown options will only include all possible cards in the selection.</p>
            </div>
            <button
              onClick={() => setAllowEasyDropdown(d => !d)}
              className={`w-11 h-6 rounded-full transition-colors relative ${allowEasyDropdown ? 'bg-[#f5f5f5]' : 'bg-[#383838]'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full transition-all ${allowEasyDropdown ? 'left-6 bg-[#1c1c1c]' : 'left-1 bg-[#606060]'}`} />
            </button>
          </div>
        </div>
        
          {/* Tag */}
          {/* <div className="bg-[#272727] border border-[#383838] rounded-lg p-5">
            <p className="text-[#f5f5f5] text-sm font-medium mb-4">Tag</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggle(tag, allowedTags, setAllowedTags)}
                  className={`px-4 py-1.5 rounded-full text-xs border transition-colors ${
                    allowedTags.includes(tag)
                      ? 'bg-[#f5f5f5] text-[#1c1c1c] border-[#f5f5f5]'
                      : 'bg-transparent text-[#b0b0b0] border-[#383838] hover:border-[#606060]'
                  }`}
                >
                  {tag.toUpperCase()}
                </button>
              ))}
            </div>
          </div> */}

          {/* Card Type */}
          <div className="bg-[#272727] border border-[#383838] rounded-lg p-5">
            <p className="text-[#f5f5f5] text-sm font-medium mb-4">Card type</p>
            <div className="flex flex-wrap gap-2">
              {allTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggle(type, allowedTypes, setAllowedTypes)}
                  className={`px-4 py-1.5 rounded-full text-xs border transition-colors ${
                    allowedTypes.includes(type)
                      ? 'bg-[#f5f5f5] text-[#1c1c1c] border-[#f5f5f5]'
                      : 'bg-transparent text-[#b0b0b0] border-[#383838] hover:border-[#606060]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Archetype */}
          <div className="bg-[#272727] border border-[#383838] rounded-lg p-5">
            <p className="text-[#f5f5f5] text-sm font-medium mb-3">Archetype</p>
            <input
              type="text"
              placeholder="Search archetypes..."
              value={archetypeSearch}
              onChange={e => setArchetypeSearch(e.target.value)}
              className="w-full px-4 py-2 bg-[#1c1c1c] border border-[#383838] rounded-lg text-[#f5f5f5] text-sm outline-none mb-3 placeholder-[#606060]"
            />
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {filteredArchetypes.map(archetype => (
                <button
                  key={archetype}
                  onClick={() => toggle(archetype, allowedArchetypes, setAllowedArchetypes)}
                  className={`px-4 py-1.5 rounded-full text-xs border transition-colors ${
                    allowedArchetypes.includes(archetype)
                      ? 'bg-[#f5f5f5] text-[#1c1c1c] border-[#f5f5f5]'
                      : 'bg-transparent text-[#b0b0b0] border-[#383838] hover:border-[#606060]'
                  }`}
                >
                  {archetype}
                </button>
              ))}
            </div>
          </div>

          {/* Sets */}
          <div className="bg-[#272727] border border-[#383838] rounded-lg p-5">
            <p className="text-[#f5f5f5] text-sm font-medium mb-3">Set</p>
            <input
              type="text"
              placeholder="Search sets..."
              value={setSearch}
              onChange={e => setSetSearch(e.target.value)}
              className="w-full px-4 py-2 bg-[#1c1c1c] border border-[#383838] rounded-lg text-[#f5f5f5] text-sm outline-none mb-3 placeholder-[#606060]"
            />
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {filteredSets.map(set => (
                <button
                  key={set}
                  onClick={() => toggle(set, allowedSets, setAllowedSets)}
                  className={`px-4 py-1.5 rounded-full text-xs border transition-colors ${
                    allowedSets.includes(set)
                      ? 'bg-[#f5f5f5] text-[#1c1c1c] border-[#f5f5f5]'
                      : 'bg-transparent text-[#b0b0b0] border-[#383838] hover:border-[#606060]'
                  }`}
                >
                  {set}
                </button>
              ))}
            </div>
          </div>

          {/* Start */}
          <div className="flex items-center justify-between">
            <p className="text-[#606060] text-sm">
              {matchingCards} card{matchingCards !== 1 ? 's' : ''} in pool
            </p>
            <button
              onClick={handleStart}
              disabled={matchingCards === 0}
              className="px-8 py-3 bg-[#f5f5f5] text-[#1c1c1c] rounded-lg text-xs tracking-widest uppercase font-medium hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Start
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}