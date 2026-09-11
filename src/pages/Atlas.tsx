import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONDITIONS, CATEGORY_LABELS } from '../lib/conditions'
import type { ConditionType, Kingdom } from '../lib/types'

const TYPES: { id: 'all' | ConditionType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'deficiency', label: 'Deficiency' },
  { id: 'pathogen', label: 'Pathogen' },
  { id: 'pest', label: 'Pest' },
  { id: 'parasite', label: 'Parasite' },
  { id: 'allergy', label: 'Allergy' },
  { id: 'environment', label: 'Environment' },
  { id: 'injury', label: 'Injury' },
  { id: 'excess', label: 'Excess' },
]

export default function Atlas() {
  const [kingdom, setKingdom] = useState<Kingdom | 'all'>('all')
  const [type, setType] = useState<(typeof TYPES)[number]['id']>('all')
  const [q, setQ] = useState('')

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    return CONDITIONS.filter((c) => {
      if (kingdom !== 'all' && c.kingdom !== kingdom) return false
      if (type !== 'all' && c.type !== type) return false
      if (!query) return true
      const blob = [c.name, c.commonName, c.summary, ...c.visualSigns, ...c.keywords].join(' ').toLowerCase()
      return blob.includes(query)
    })
  }, [kingdom, type, q])

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <p className="specimen-label">Illustrated atlas</p>
      <h1 className="display mt-2 text-4xl font-light md:text-6xl">An atlas of lack and lesion.</h1>
      <p className="mt-4 max-w-2xl text-[15px] text-ink-dim">
        Deficiencies, fungi, mites, and management wounds — the vocabulary VitaLens uses when it
        reads a snapshot. Browse, then take a specimen of your own.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {(['all', 'plant', 'animal'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setKingdom(k)}
            className={`rounded-full px-4 py-1.5 text-[12px] tracking-wide ${
              kingdom === k ? 'bg-gold text-forest' : 'border border-gold/20 text-ink-dim'
            }`}
          >
            {k === 'all' ? 'Both kingdoms' : k}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={`rounded-full px-3 py-1 text-[11px] tracking-wide ${
              type === t.id ? 'bg-gold/20 text-gold' : 'text-ink-dim hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search yellow veins, fleas, zinc, mildew…"
        className="mt-6 w-full max-w-md rounded-full border border-gold/20 bg-bark px-4 py-2.5 text-[14px] outline-none placeholder:text-ink-dim/50 focus:border-gold"
      />

      <p className="mt-8 font-mono text-[11px] tracking-widest text-gold/60">{rows.length} plates</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((c) => (
          <article key={c.id} className="overflow-hidden rounded-2xl border border-gold/15 bg-canopy/40">
            <div className="relative h-44 overflow-hidden">
              <img src={c.atlasImage} alt="" className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-forest/80 px-2 py-1 specimen-label text-[9px]">
                {c.kingdom} · {c.type}
              </span>
            </div>
            <div className="p-5">
              <h2 className="display text-xl leading-tight">{c.name}</h2>
              <p className="mt-1 text-[13px] text-gold/80">{c.commonName}</p>
              <p className="mt-3 line-clamp-3 text-[13.5px] leading-relaxed text-ink-dim">{c.summary}</p>
              <p className="mt-3 text-[11px] text-ink-dim/80">
                {c.categories.map((x) => CATEGORY_LABELS[x]).join(' · ')}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.lacks.slice(0, 2).map((l) => (
                  <span key={l} className="rounded-full bg-bark px-2 py-0.5 text-[10px] text-copper">
                    lacks {l.split('(')[0].trim().slice(0, 28)}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-gold/15 p-6 text-center">
        <p className="text-ink-dim">Have a specimen in hand?</p>
        <Link to="/examine" className="mt-3 inline-block rounded-full bg-gold px-5 py-2.5 text-[13px] text-forest">
          Take a reading
        </Link>
      </div>
    </div>
  )
}
