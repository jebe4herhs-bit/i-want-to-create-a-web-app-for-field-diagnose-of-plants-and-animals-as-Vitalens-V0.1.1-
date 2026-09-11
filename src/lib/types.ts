export type Kingdom = 'plant' | 'animal'

export type Category =
  | 'houseplant'
  | 'crop'
  | 'tree'
  | 'ornamental'
  | 'dog'
  | 'cat'
  | 'livestock'
  | 'equine'
  | 'bird'
  | 'reptile'
  | 'small-mammal'

export type ConditionType =
  | 'deficiency'
  | 'excess'
  | 'pathogen'
  | 'pest'
  | 'environment'
  | 'allergy'
  | 'parasite'
  | 'injury'

export type Urgency = 'watch' | 'act' | 'urgent'

export type ColorKey =
  | 'green'
  | 'yellow'
  | 'brown'
  | 'white'
  | 'orange'
  | 'red'
  | 'black'
  | 'purple'
  | 'pink'
  | 'neutral'

export interface Condition {
  id: string
  name: string
  commonName: string
  kingdom: Kingdom
  categories: Category[]
  type: ConditionType
  summary: string
  visualSigns: string[]
  keywords: string[]
  colorHints: Partial<Record<ColorKey, number>>
  mottled?: boolean
  edgeBias?: boolean
  youngGrowth?: boolean
  oldGrowth?: boolean
  lacks: string[]
  needs: string[]
  protocol: string[]
  prevent: string[]
  urgency: Urgency
  professional: string
  atlasImage: string
}

export interface ColorMap {
  green: number
  yellow: number
  brown: number
  white: number
  orange: number
  red: number
  black: number
  purple: number
  pink: number
  neutral: number
}

export interface ImageAnalysis {
  colors: ColorMap
  dominant: { hex: string; share: number }[]
  mottled: boolean
  edgeScorch: boolean
  falseColorUrl: string
  vitality: number
}

export interface ScanInput {
  kingdom: Kingdom
  category: Category
  species: string
  notes: string
  duration: string
  environment: string
  imageDataUrl?: string
}

export interface Finding {
  condition: Condition
  confidence: number
  reasons: string[]
}

export interface ScanResult {
  id: string
  createdAt: string
  input: ScanInput
  analysis: ImageAnalysis | null
  findings: Finding[]
  overallUrgency: Urgency
  headline: string
  narrative: string
}
