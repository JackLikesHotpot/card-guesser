export interface Card {
  name: string
  image_url: string
  tag: string
  sets: string[]
}

export interface RoundResult {
  name: string
  src: string
  steps: number
  score: number
  skipped: boolean
}
