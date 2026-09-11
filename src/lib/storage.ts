import type { ScanResult } from './types'

const KEY = 'vitalens.scans.v1'

export function loadHistory(): ScanResult[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ScanResult[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveScan(result: ScanResult) {
  const next = [result, ...loadHistory()].slice(0, 24)
  localStorage.setItem(KEY, JSON.stringify(next))
}

export function getScan(id: string): ScanResult | undefined {
  return loadHistory().find((s) => s.id === id)
}

export function clearHistory() {
  localStorage.removeItem(KEY)
}
