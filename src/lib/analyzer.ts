import { CONDITIONS } from './conditions'
import type {
  ColorKey,
  ColorMap,
  Finding,
  ImageAnalysis,
  ScanInput,
  ScanResult,
  Urgency,
} from './types'

const EMPTY_COLORS: ColorMap = {
  green: 0,
  yellow: 0,
  brown: 0,
  white: 0,
  orange: 0,
  red: 0,
  black: 0,
  purple: 0,
  pink: 0,
  neutral: 0,
}

function hueSatLight(r: number, g: number, b: number) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  const d = max - min
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  let h = 0
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6
    else if (max === gn) h = (bn - rn) / d + 2
    else h = (rn - gn) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s, l }
}

function classify(r: number, g: number, b: number): ColorKey {
  const { h, s, l } = hueSatLight(r, g, b)
  if (l < 0.1) return 'black'
  if (s < 0.12) {
    if (l > 0.78) return 'white'
    return 'neutral'
  }
  if (h >= 75 && h < 165) return 'green'
  if (h >= 48 && h < 75) return 'yellow'
  if (h >= 28 && h < 48) return 'orange'
  if (h >= 12 && h < 28) {
    if (l < 0.38) return 'brown'
    return 'orange'
  }
  if (h >= 330 || h < 12) {
    if (l < 0.28) return 'brown'
    if (l > 0.72 && s < 0.45) return 'pink'
    return 'red'
  }
  if (h >= 300 && h < 330) return 'pink'
  if (h >= 250 && h < 300) return 'purple'
  if (h >= 165 && h < 250) {
    if (l > 0.75) return 'white'
    return 'neutral'
  }
  if (l < 0.35 && s < 0.55) return 'brown'
  return 'neutral'
}

const FALSE_COLOR: Record<ColorKey, [number, number, number]> = {
  green: [62, 140, 86],
  yellow: [232, 196, 74],
  brown: [140, 84, 48],
  white: [236, 232, 220],
  orange: [214, 122, 52],
  red: [196, 72, 58],
  black: [28, 24, 22],
  purple: [132, 92, 168],
  pink: [214, 132, 148],
  neutral: [96, 108, 98],
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v | 0)).toString(16).padStart(2, '0'))
      .join('')
  )
}

export async function analyzeImage(dataUrl: string): Promise<ImageAnalysis> {
  const img = await loadImage(dataUrl)
  const size = 96
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('Canvas unavailable')
  ctx.drawImage(img, 0, 0, size, size)
  const { data } = ctx.getImageData(0, 0, size, size)

  const colors: ColorMap = { ...EMPTY_COLORS }
  const buckets = new Map<string, number>()
  const falseMap = ctx.createImageData(size, size)
  let edgeScorchHits = 0
  let edgeTotal = 0
  const grid: ColorKey[] = new Array(size * size)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]
      if (a < 40) {
        grid[y * size + x] = 'neutral'
        continue
      }
      const key = classify(r, g, b)
      grid[y * size + x] = key
      colors[key] += 1
      const q = rgbToHex(r & ~15, g & ~15, b & ~15)
      buckets.set(q, (buckets.get(q) || 0) + 1)
      const fc = FALSE_COLOR[key]
      falseMap.data[i] = fc[0]
      falseMap.data[i + 1] = fc[1]
      falseMap.data[i + 2] = fc[2]
      falseMap.data[i + 3] = 255

      const edge = x < 6 || y < 6 || x >= size - 6 || y >= size - 6
      if (edge) {
        edgeTotal++
        if (key === 'brown' || key === 'orange' || key === 'white') edgeScorchHits++
      }
    }
  }

  const counted = Object.values(colors).reduce((a, b) => a + b, 0) || 1
  ;(Object.keys(colors) as ColorKey[]).forEach((k) => {
    colors[k] = colors[k] / counted
  })

  const dominant = [...buckets.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([hex, n]) => ({ hex, share: n / counted }))

  let transitions = 0
  for (let y = 1; y < size; y++) {
    for (let x = 1; x < size; x++) {
      const here = grid[y * size + x]
      if (here !== grid[y * size + x - 1] || here !== grid[(y - 1) * size + x]) {
        transitions++
      }
    }
  }
  const mottled = transitions / (size * size) > 0.28
  const edgeScorch = edgeTotal > 0 && edgeScorchHits / edgeTotal > 0.22

  ctx.putImageData(falseMap, 0, 0)
  const falseColorUrl = canvas.toDataURL('image/png')

  const vitality = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        colors.green * 100 +
          colors.neutral * 25 -
          colors.yellow * 35 -
          colors.brown * 50 -
          colors.black * 40 -
          colors.white * 15 -
          colors.red * 30,
      ),
    ),
  )

  return { colors, dominant, mottled, edgeScorch, falseColorUrl, vitality }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not read the snapshot'))
    img.src = src
  })
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1)
}

function phraseHits(notes: string, phrases: string[]): string[] {
  const n = notes.toLowerCase()
  return phrases.filter((p) => n.includes(p.toLowerCase()))
}

function colorScore(cond: (typeof CONDITIONS)[number], colors: ColorMap | null) {
  if (!colors) return 0
  let s = 0
  let w = 0
  for (const [key, weight] of Object.entries(cond.colorHints) as [ColorKey, number][]) {
    s += (colors[key] || 0) * weight
    w += Math.abs(weight)
  }
  if (w === 0) return 0
  return (s / w) * 100
}

function buildNarrative(input: ScanInput, findings: Finding[], analysis: ImageAnalysis | null) {
  const top = findings[0]
  const who = input.species.trim() || (input.kingdom === 'plant' ? 'this plant' : 'this animal')
  if (!top) {
    return `The snapshot and notes on ${who} did not line up cleanly with a known pattern in the atlas. That can mean the tissue is largely healthy, the photo is too distant, or the signs are early. Capture a closer, well-lit image of the affected patch and add where on the body it started.`
  }
  const second = findings[1]
  let text = `The strongest reading for ${who} is ${top.condition.name.toLowerCase()} (${top.condition.commonName.toLowerCase()}). ${top.condition.summary}`
  if (second && second.confidence > 38) {
    text += ` A secondary pattern — ${second.condition.name.toLowerCase()} — is also in range and should be weighed, because living tissue often stacks stresses.`
  }
  if (analysis) {
    const c = analysis.colors
    const notable = (Object.entries(c) as [ColorKey, number][])
      .filter(([, v]) => v > 0.08)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => `${k} ${Math.round(v * 100)}%`)
    if (notable.length) {
      text += ` Chromatogram of the snapshot: ${notable.join(', ')}.`
    }
  }
  text +=
    ' This is a field reading, not a laboratory diagnosis. If the organism is in pain, collapsing, or the pattern is spreading fast, contact a veterinarian, agronomist, or extension service.'
  return text
}

function urgencyOf(findings: Finding[]): Urgency {
  if (findings.some((f) => f.condition.urgency === 'urgent' && f.confidence >= 42)) return 'urgent'
  if (findings.some((f) => f.condition.urgency === 'act' && f.confidence >= 40)) return 'act'
  return 'watch'
}

export async function runScan(input: ScanInput): Promise<ScanResult> {
  const analysis = input.imageDataUrl ? await analyzeImage(input.imageDataUrl) : null
  const notes = [input.notes, input.duration, input.environment, input.species]
    .filter(Boolean)
    .join(' ')
  const tokens = new Set(tokenize(notes))
  const findings: Finding[] = []

  for (const cond of CONDITIONS) {
    if (cond.kingdom !== input.kingdom) continue
    if (input.category && !cond.categories.includes(input.category)) {
      // still allow, but cheaper
    }

    const reasons: string[] = []
    let score = 8

    const hits = phraseHits(notes, cond.keywords)
    if (hits.length) {
      score += Math.min(38, hits.length * 9)
      reasons.push(`Notes mention ${hits.slice(0, 4).join(', ')}`)
    } else {
      // token overlap
      let tHits = 0
      for (const kw of cond.keywords) {
        const parts = tokenize(kw)
        if (parts.every((p) => tokens.has(p))) tHits++
      }
      if (tHits) {
        score += Math.min(22, tHits * 6)
        reasons.push('Partial keyword overlap with the field notes')
      }
    }

    if (cond.categories.includes(input.category)) {
      score += 10
      reasons.push(`Common in ${input.category.replace('-', ' ')} subjects`)
    }

    const species = input.species.toLowerCase()
    if (species && cond.keywords.some((k) => species.includes(k) || k.includes(species))) {
      score += 6
    }

    if (analysis) {
      const cs = colorScore(cond, analysis.colors)
      score += cs * 0.55
      if (cs > 12) {
        const topHint = Object.entries(cond.colorHints).sort((a, b) => (b[1] || 0) - (a[1] || 0))[0]
        if (topHint) {
          reasons.push(
            `Snapshot chromatogram shows ${(topHint[0] as string)} tissue (${Math.round((analysis.colors[topHint[0] as ColorKey] || 0) * 100)}%)`,
          )
        }
      }
      if (cond.mottled && analysis.mottled) {
        score += 8
        reasons.push('Mottled / patchy pigment rather than a uniform fade')
      }
      if (cond.edgeBias && analysis.edgeScorch) {
        score += 8
        reasons.push('Margins and tips carry more scorch than the leaf centre')
      }
      if (cond.kingdom === 'plant' && analysis.colors.green > 0.55 && cond.type === 'deficiency') {
        score -= 6
      }
    }

    if (input.duration.toLowerCase().includes('sudden') || input.duration.toLowerCase().includes('hours')) {
      if (cond.urgency === 'urgent') score += 6
    }
    if (input.duration.toLowerCase().includes('week') || input.duration.toLowerCase().includes('month')) {
      if (cond.type === 'deficiency' || cond.type === 'allergy') score += 4
    }

    const confidence = Math.max(0, Math.min(96, Math.round(score)))
    if (confidence >= 22) {
      if (!reasons.length) reasons.push('Pattern is plausible for this kingdom and subject class')
      findings.push({ condition: cond, confidence, reasons })
    }
  }

  findings.sort((a, b) => b.confidence - a.confidence)
  const top = findings.slice(0, 5)

  // renormalize a touch so the leader is readable
  if (top[0]) {
    const peak = top[0].confidence
    for (const f of top) {
      f.confidence = Math.round((f.confidence / peak) * Math.min(94, peak))
    }
  }

  const overallUrgency = urgencyOf(top)
  const headline = top[0]
    ? top[0].confidence >= 55
      ? `Likely ${top[0].condition.name.toLowerCase()}`
      : `Possible ${top[0].condition.name.toLowerCase()}`
    : 'No strong match — tissue may be vital, or the sample is unclear'

  return {
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `scan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    input,
    analysis,
    findings: top,
    overallUrgency,
    headline,
    narrative: buildNarrative(input, top, analysis),
  }
}

export const COLOR_LABELS: Record<ColorKey, string> = {
  green: 'Chlorophyll / healthy',
  yellow: 'Chlorosis / pale',
  brown: 'Necrosis / crust',
  white: 'Bloom / flake / powder',
  orange: 'Rust / pustule',
  red: 'Inflammation / blood',
  black: 'Char / flea dirt',
  purple: 'Anthocyanin / P-sign',
  pink: 'Erythema',
  neutral: 'Fur / soil / bark',
}
