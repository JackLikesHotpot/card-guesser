import { useState, useEffect, useMemo } from 'react'
import { Reveal } from './components/Reveal/Reveal.tsx'
import { SearchBar } from './components/SearchBar/SearchBar.tsx'
import { GameHeader } from './components/GameHeader/GameHeader.tsx'
import { Controls } from './components/Controls/Controls.tsx'
import { WrongGuesses } from './components/WrongGuesses/WrongGuesses.tsx'
import { History } from './components/History/History.tsx'
import { GameOver } from './components/GameOver/GameOver.tsx'
import { Settings, type GameSettings } from './components/Settings/Settings.tsx'
import type { Card, RoundResult } from './types.ts'

const SCORE_BY_STEP: Record<number, number> = {
  0: 50,
  1: 35,
  2: 20,
  3: 10,
  4: 5,
}

const calculateScore = (steps: number, wrongs: number) => {
  const base = SCORE_BY_STEP[steps] ?? 5
  const wrongPenalty = steps < 4 ? wrongs * 2 : 0
  return Math.max(1, base - wrongPenalty)
}

const App = () => {
  const [data, setData] = useState<Card[]>([])

  useEffect(() => {
    fetch('./data/card_info.json')
      .then(r => r.json())
      .then(setData)
  }, [])

  const bucket_url = import.meta.env.VITE_BUCKET_URL

  const [gameStarted, setGameStarted] = useState(false)
  const [settings, setSettings] = useState<GameSettings | null>(null)

  const [name, setName] = useState('')
  const [cardId, setCardId] = useState('')
  const [step, setStep] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [lastScore, setLastScore] = useState<number | null>(null)
  const [history, setHistory] = useState<RoundResult[]>([])
  const [revealed, setRevealed] = useState<string | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [gameTimeLeft, setGameTimeLeft] = useState(0)
  const [cardKey, setCardKey] = useState(0)
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set())
  const [lastId, setLastId] = useState<string | null>(null)

  const pool = useMemo(() => {
    if (!settings) return data
    return data.filter(c => {
      if (!c.id) return false
      if (settings.allowedTypes.length && !settings.allowedTypes.includes(c.type)) return false
      if (settings.allowedArchetypes.length && !settings.allowedArchetypes.includes(c.archetype)) return false
      if (settings.allowedSets.length && !c.sets.some(s => settings.allowedSets.includes(s))) return false
      return true
    })
  }, [settings, data])

  const filtered = guess.trim().length > 0
    ? pool
        .map(c => c.name)
        .filter(n => n.toLowerCase().includes(guess.toLowerCase()))
        .filter(n => !wrongGuesses.includes(n))
        .slice(0, 8)
    : []

  useEffect(() => {
    if (!gameStarted || gameOver) return
    const interval = setInterval(() => {
      setGameTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); setGameOver(true); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [gameStarted, gameOver])

  useEffect(() => {
    if (!gameStarted || gameOver) return
    setTimeLeft(settings!.cardDuration)
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [cardKey, gameStarted, gameOver])

  useEffect(() => {
    if (timeLeft === 0 && gameStarted && !gameOver) {
      handleSkip()
    }
  }, [timeLeft])

  const pickRandomCard = (currentPool: Card[] = pool, excludeId: string | null = lastId) => {
    let available = currentPool.filter(c => c.id !== excludeId)

    if (!settings?.allowDuplicates) {
      available = available.filter(c => !seenIds.has(c.id))
    }

    if (available.length === 0) {
      setGameOver(true)
      return
    }

    const chosen = Math.floor(Math.random() * available.length)
    const card = available[chosen]
    setName(card.name)
    setCardId(card.id)
    setLastId(card.id)
    setSeenIds(prev => new Set([...prev, card.id]))
    setGuess('')
    setFeedback(null)
    setWrongGuesses([])
    setCardKey(k => k + 1)
  }

  const handleStart = (s: GameSettings) => {
    setSettings(s)
    setGameStarted(true)
    setGameTimeLeft(s.gameDuration)
    setHistory([])
    setScore(0)
    setLastScore(null)
    setStep(0)
    setGameOver(false)
    setSeenIds(new Set())
    setLastId(null)

    const filteredPool = data.filter(c => {
      if (!c.id) return false
      if (s.allowedTypes.length && !s.allowedTypes.includes(c.type)) return false
      if (s.allowedArchetypes.length && !s.allowedArchetypes.includes(c.archetype)) return false
      if (s.allowedSets.length && !c.sets.some(set => s.allowedSets.includes(set))) return false
      return true
    })
    pickRandomCard(filteredPool, null)
  }

  const handleNext = () => {
    if (disabled) return
    setStep(s => Math.min(s + 1, 4))
    setDisabled(true)
    setTimeout(() => setDisabled(false), 1000)
  }

  const handleSkip = () => {
    const currentName = name
    const currentId = cardId
    const earned = Math.max(0, calculateScore(step, wrongGuesses.length))
    setHistory(prev => {
      if (prev.some(r => r.name === currentName)) return prev
      return [...prev, { name: currentName, src: `${bucket_url}${currentId}.jpg`, steps: step, score: earned, skipped: true }]
    })
    setRevealed(currentName)
    setTimeout(() => { setRevealed(null); pickRandomCard(pool, currentId); setStep(0) }, 2000)
  }

  const handleGuess = (selected: string) => {
    if (feedback === 'correct') return
    const correct = selected.toLowerCase() === name.toLowerCase()
    if (correct) {
      const currentName = name
      const currentId = cardId
      const earned = calculateScore(step, wrongGuesses.length)
      setLastScore(earned)
      setScore(prev => prev + earned)
      setHistory(prev => [...prev, { name: currentName, src: `${bucket_url}${currentId}.jpg`, steps: step, score: earned, skipped: false }])
      setFeedback('correct')
      setTimeout(() => { pickRandomCard(); setStep(0) }, 1000)
    } else {
      setWrongGuesses(prev => [...prev, selected])
      setGuess('')
      setFeedback('wrong')
    }
  }

  const handlePlayAgain = () => {
    setGameStarted(false)
    setSettings(null)
    setGameOver(false)
    setHistory([])
    setScore(0)
    setLastScore(null)
    setStep(0)
    setSeenIds(new Set())
    setLastId(null)
  }

  if (!gameStarted) return <Settings data={data} onStart={handleStart} />

  if (gameOver) return (
    <GameOver score={score} history={history} onPlayAgain={handlePlayAgain} />
  )

  return (
    <div className="min-h-screen bg-[#1c1c1c] p-8 flex justify-center">
      <div className="w-1/2">

        <GameHeader gameTimeLeft={gameTimeLeft} score={score} lastScore={lastScore} />

        <div className="flex gap-5 items-start">

          {/* Left — card + controls */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0 w-[45%]">
            <div className="w-full aspect-square">
              <Reveal src={`${bucket_url}${cardId}.jpg`} step={step} />
            </div>
            <Controls
              timeLeft={timeLeft}
              revealed={revealed}
              cardKey={cardKey}
              onNext={handleNext}
              onSkip={handleSkip}
            />
          </div>

          {/* Right — search + wrong guesses + history */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <SearchBar
              guess={guess}
              feedback={feedback}
              filtered={filtered}
              onChange={setGuess}
              onGuess={handleGuess}
              onSelect={n => setGuess(n)}
            />
            <WrongGuesses guesses={wrongGuesses} />
            <History history={history} />
          </div>

        </div>
      </div>
    </div>
  )
}

export default App