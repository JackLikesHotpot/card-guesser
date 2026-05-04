import { useState, useEffect } from 'react'
import raw from '../data/card_info.json'
import { Reveal } from './components/Reveal/Reveal.tsx'
import { SearchBar } from './components/SearchBar/SearchBar.tsx'
import { GameHeader } from './components/GameHeader/GameHeader.tsx'
import { Controls } from './components/Controls/Controls.tsx'
import { WrongGuesses } from './components/WrongGuesses/WrongGuesses.tsx'
import { History } from './components/History/History.tsx'
import { GameOver } from './components/GameOver.tsx/GameOver.tsx'
import type { Card, RoundResult } from './types.ts'

const SCORE_BY_STEP: Record<number, number> = {
  0: 50,
  1: 35,
  2: 20,
  3: 10,
  4: 5,
}

const GAME_DURATION = 3 * 60

const calculateScore = (steps: number, wrongs: number) =>
  Math.max(1, (SCORE_BY_STEP[steps] ?? 5) - wrongs * 2)

const App = () => {
  const data = raw as Card[]
  const bucket_url = import.meta.env.VITE_BUCKET_URL

  const [name, setName] = useState('')
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
  const [gameTimeLeft, setGameTimeLeft] = useState(GAME_DURATION)
  const [cardKey, setCardKey] = useState(0)

  const filtered = guess.trim().length > 0
    ? data
        .map(c => c.name.replace(/[^a-zA-Z0-9 \-'!,&★☆.]/g, ''))
        .filter(n => n.toLowerCase().includes(guess.toLowerCase()))
        .filter(n => !wrongGuesses.includes(n))
        .slice(0, 8)
    : []

  useEffect(() => { pickRandomCard() }, [])

  useEffect(() => {
    if (gameOver) return
    const interval = setInterval(() => {
      setGameTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); setGameOver(true); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [gameOver])

  useEffect(() => {
    if (gameOver) return
    setTimeLeft(60)
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); handleSkip(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [cardKey, gameOver])

  const pickRandomCard = () => {
    const chosen = Math.floor(Math.random() * data.length)
    setName(data[chosen].name.replace(/[^a-zA-Z0-9 \-'!,&★☆.]/g, ''))
    setGuess('')
    setFeedback(null)
    setWrongGuesses([])
    setCardKey(k => k + 1)
  }

  const handleNext = () => {
    if (disabled) return
    setStep(s => Math.min(s + 1, 4))
    setDisabled(true)
    setTimeout(() => setDisabled(false), 1000)
  }

  const handleSkip = () => {
    setHistory(prev => {
      if (prev.some(r => r.name === name)) return prev
      return [...prev, { name, src: `${bucket_url}${name}.jpg`, steps: step, score: 0, skipped: true }]
    })
    setRevealed(name)
    setTimeout(() => { setRevealed(null); pickRandomCard(); setStep(0) }, 2000)
  }

  const handleGuess = (selected: string) => {
    if (feedback === 'correct') return
    const correct = selected.toLowerCase() === name.toLowerCase()
    if (correct) {
      const earned = calculateScore(step, wrongGuesses.length)
      setLastScore(earned)
      setScore(prev => prev + earned)
      setHistory(prev => [...prev, { name, src: `${bucket_url}${name}.jpg`, steps: step, score: earned, skipped: false }])
      setFeedback('correct')
      setTimeout(() => { pickRandomCard(); setStep(0) }, 1000)
    } else {
      setWrongGuesses(prev => [...prev, selected])
      setGuess('')
      setFeedback('wrong')
    }
  }

  const handlePlayAgain = () => {
    setGameOver(false)
    setHistory([])
    setScore(0)
    setLastScore(null)
    setGameTimeLeft(GAME_DURATION)
    pickRandomCard()
    setStep(0)
  }

  if (gameOver) return (
    <GameOver score={score} history={history} onPlayAgain={handlePlayAgain} />
  )

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <GameHeader gameTimeLeft={gameTimeLeft} score={score} lastScore={lastScore} />
      <div style={{ width: 500, height: 500 }}>
        <Reveal src={`${bucket_url}${name}.jpg`} step={step} />
      </div>      
      <Controls timeLeft={timeLeft} revealed={revealed} onNext={handleNext} onSkip={handleSkip} />
      <SearchBar guess={guess} feedback={feedback} filtered={filtered} onChange={setGuess} onGuess={handleGuess} onSelect={n => setGuess(n)} />
      <WrongGuesses guesses={wrongGuesses} />
      <History history={history} />
    </div>
  )
}

export default App