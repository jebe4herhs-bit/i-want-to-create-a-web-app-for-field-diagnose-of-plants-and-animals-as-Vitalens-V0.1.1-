import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Droplets, HeartPulse, Leaf, ShieldAlert } from 'lucide-react'
import { getScan } from '../lib/storage'
import { COLOR_LABELS } from '../lib/analyzer'
import type { ColorKey, Finding, ScanResult, Urgency } from '../lib/types'

const URGENCY: Record<Urgency, { label: string; cls: string }> = {
  watch: { label: 'Watch', cls: 'text-watch border-watch/40 bg-watch/10' },
  act: { label: 'Act this week', cls: 'text-gold border-gold/40 bg-gold/10' },
  urgent: { label: 'Urgent', cls: 'text-urgent border-urgent/40 bg-urgent/10' },
}

function Meter({ colors }: { colors: ScanResult['analysis'] }) {
  if (!colors) return null
  const entries = (Object.entries(colors.colors) as [ColorKey, number][])
    .filter(([, v]) => v > 0.02)
    .sort((a, b) => b[1] - a[1])
  const palette: Record<ColorKey, string> = {
    green: '#4a8f62',
    yellow: '#e8c44a',
    brown: '#8c5430',
    white: '#efe6d4',
    orange: '#d67a34',
    red: '#c4483a',
    black: '#1c1816',
    purple: '#845ca8',
    pink: '#d68494',
    neutral: '#60706a',
  }
  return (
    <div>
      <p className="specimen-label mb-3">Chromatogram</p>
      <div className="flex h-3 overflow-hidden rounded-full border border-gold/20">
        {entries.map(([k, v]) => (
          <div key={k} style={{ width: `${v * 100}%`, background: palette[k] }} title={k} />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] text-ink-dim">
        {entries.slice(0, 6).map(([k, v]) => (
          <li key={k} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: palette[k] }} />
            {COLOR_LABELS[k]} · {Math.round(v * 100)}%
          </li>
        ))}
      </ul>
    </div>
  )
}

function FindingCard({ finding, open }: { finding: Finding; open?: boolean }) {
  const c = finding.condition
  return (
    <details
      open={open}
      className="group rounded-2xl border border-gold/15 bg-canopy/50 open:border-gold/35"
    >
      <summary className="flex cursor-pointer list-none items-center gap-4 p-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
          <img src={c.atlasImage} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="specimen-label">
            {c.type} · {finding.confidence}% match
          </p>
          <h3 className="display truncate text-xl">{c.name}</h3>
          <p className="truncate text-[13px] text-ink-dim">{c.commonName}</p>
        </div>
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/20 text-[13px] font-mono text-gold sm:flex">
          {finding.confidence}
        </div>
      </summary>
      <div className="space-y-6 border-t border-gold/10 px-5 pb-6 pt-4">
        <p className="text-[14.5px] leading-relaxed text-ink/85">{c.summary}</p>
        {finding.reasons.length > 0 && (
          <div>
            <p className="specimen-label mb-2">Why this ranked</p>
            <ul className="space-y-1 text-[13px] text-ink-dim">
              {finding.reasons.map((r) => (
                <li key={r}>— {r}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-forest/60 p-4">
            <p className="mb-2 flex items-center gap-2 text-[12px] tracking-wide text-copper">
              <Droplets className="h-3.5 w-3.5" /> What it lacks
            </p>
            <ul className="space-y-1.5 text-[13.5px] leading-relaxed">
              {c.lacks.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-forest/60 p-4">
            <p className="mb-2 flex items-center gap-2 text-[12px] tracking-wide text-chlorophyll">
              <HeartPulse className="h-3.5 w-3.5" /> What it needs
            </p>
            <ul className="space-y-1.5 text-[13.5px] leading-relaxed">
              {c.needs.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <p className="specimen-label mb-2">Protocol</p>
          <ol className="space-y-2 text-[14px] leading-relaxed text-ink/85">
            {c.protocol.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="font-mono text-[11px] text-gold">{String(i + 1).padStart(2, '0')}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="flex gap-2 rounded-xl border border-gold/10 bg-bark/40 p-3 text-[13px] leading-relaxed text-ink-dim">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          {c.professional}
        </p>
      </div>
    </details>
  )
}

export default function Result() {
  const { id } = useParams()
  const scan = id ? getScan(id) : undefined

  if (!scan) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="specimen-label">Missing specimen</p>
        <h1 className="display mt-3 text-4xl">This reading is not in the local log.</h1>
        <p className="mt-4 text-ink-dim">
          Readings live in this browser only. If you cleared storage, the file is gone.
        </p>
        <Link to="/examine" className="mt-8 inline-block rounded-full bg-gold px-5 py-2.5 text-[13px] text-forest">
          New reading
        </Link>
      </div>
    )
  }

  const u = URGENCY[scan.overallUrgency]
  const who = scan.input.species || (scan.input.kingdom === 'plant' ? 'Plant specimen' : 'Animal specimen')

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link to="/examine" className="inline-flex items-center gap-2 text-[13px] text-ink-dim hover:text-gold">
        <ArrowLeft className="h-4 w-4" /> Another reading
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          {scan.input.imageDataUrl ? (
            <div className="overflow-hidden rounded-[1.5rem] border border-gold/20">
              <img src={scan.input.imageDataUrl} alt="Submitted specimen" className="aspect-[4/3] w-full object-cover" />
            </div>
          ) : (
            <div className="grid aspect-[4/3] place-items-center rounded-[1.5rem] border border-gold/20 bg-canopy">
              <Leaf className="h-10 w-10 text-gold/40" />
            </div>
          )}
          {scan.analysis && (
            <div className="mt-4 overflow-hidden rounded-[1.2rem] border border-gold/15">
              <img src={scan.analysis.falseColorUrl} alt="False-color chromatogram" className="h-28 w-full object-cover" />
            </div>
          )}
          <div className="mt-6 rounded-2xl border border-gold/15 bg-canopy/40 p-5">
            <Meter colors={scan.analysis} />
            {scan.analysis && (
              <p className="mt-4 font-mono text-[12px] text-gold">
                Tissue vitality index · {scan.analysis.vitality}
                {scan.analysis.mottled ? ' · mottled' : ''}
                {scan.analysis.edgeScorch ? ' · margin scorch' : ''}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full border px-3 py-1 text-[11px] tracking-widest uppercase ${u.cls}`}>
              {u.label}
            </span>
            <span className="specimen-label">
              {scan.input.kingdom} · {scan.input.category}
            </span>
          </div>
          <h1 className="display mt-4 text-4xl font-light leading-tight md:text-5xl">{scan.headline}</h1>
          <p className="mt-2 text-[14px] text-gold/80">{who}</p>
          <p className="mt-5 text-[15px] leading-relaxed text-ink/85">{scan.narrative}</p>

          {scan.overallUrgency === 'urgent' && (
            <p className="mt-5 flex gap-2 rounded-xl border border-urgent/30 bg-urgent/10 p-3 text-[13.5px] text-ink">
              <AlertTriangle className="h-4 w-4 shrink-0 text-urgent" />
              High-urgency pattern. Do not wait on a home protocol if the organism is declining.
            </p>
          )}

          <div className="mt-10 space-y-3">
            <p className="specimen-label">Differential</p>
            {scan.findings.length === 0 && (
              <p className="text-ink-dim">No atlas entry crossed the confidence line. Try a closer crop and more specific notes.</p>
            )}
            {scan.findings.map((f, i) => (
              <FindingCard key={f.condition.id} finding={f} open={i === 0} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
