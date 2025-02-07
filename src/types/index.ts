export type Preset = {
  id: string
  name: string
  seconds: number
}

export type Summary = {
  id: string
  date: Date
  setCount: number
  totalTime: number
  sets: {
    setNumber: number
    time: number
  }[]
}