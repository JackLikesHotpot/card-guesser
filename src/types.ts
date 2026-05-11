export interface Card {
  name: string
  image_url: string
  tag: string
  sets: string[]
  id: string
  archetype: string
  type: string
  humanReadableCardType: string
  race: string
}

export interface CardSet {
  set_name: string
  set_code: string
  num_of_cards: number
  tcg_date: string
};

export interface RoundResult {
  name: string
  src: string
  steps: number
  score: number
  skipped: boolean
}

