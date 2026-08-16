export interface Dealership {
  id: number
  city: string
  state: string
  st: string
  address: string
  zip: string
  lat: number
  long: number
  short_name: string
  full_name: string
}

export type Sentiment = 'positive' | 'negative' | 'neutral'

export interface Review {
  _id: string
  name: string
  dealership: number
  review: string
  purchase: boolean
  purchase_date: string | null
  car_make: string | null
  car_model: string | null
  car_year: number | null
  sentiment: Sentiment | null
  createdAt?: string
  updatedAt?: string
}

export interface CarMake {
  id: number
  name: string
}

export interface TokenPair {
  access: string
  refresh: string
}

export interface LoginResponse extends TokenPair {}

export interface RegisterPayload {
  username: string
  first_name: string
  last_name: string
  password: string
}

export interface RegisterResponse {
  username: string
  first_name: string
  last_name: string
  tokens: TokenPair
}

export interface ReviewPayload {
  name: string
  dealership: number
  review: string
  purchase: boolean
  purchase_date: string | null
  car_make: string | null
  car_model: string | null
  car_year: number | null
}
