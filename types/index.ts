export interface Property {
  id: string
  title: string
  location: string
  image: string
  price: string
  roi?: string
  investors?: number
  shares?: number
}

export interface Investment {
  id: string
  property: string
  shares: number
  value: string
  roi: string
  status: string
}

export interface Royalty {
  id: string
  property: string
  amount: string
  date: string
  status: string
}
