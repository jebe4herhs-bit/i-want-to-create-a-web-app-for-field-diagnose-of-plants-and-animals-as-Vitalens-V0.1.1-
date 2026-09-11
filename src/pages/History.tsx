import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { clearHistory, loadHistory } from '../lib/storage'

function when(iso: string) {
  try {
    return new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function History() {
  const [tick, setTick] = useState(0)
  const rows = useMemo(() => loadHistory(), [tick])

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="specimen-label">Local log</p>
          <h1 className="display mt-2 text-4xl font-light md:text-5xl">Readings in this browser.</h1>
        </div>
        {rows.length > 0 && (
          <button
            type="button"
            onClick={() => {
              clearHistory()
              setTick((n) => n + 1)
            }}
            className="text-[12px] tracking-wide text-ink-dim hover:text-urgent"
          >
            Clear log
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="mt-16 rounded-[1.6rem] border border-dashed border-gold/25 px-6 py-16 text-center">
          <p className="text-ink-dim">No specimens yet. The log never leaves this device.</p>
          <Link to="/examine" className="mt-5 inline-block rounded-full bg-gold px-5 py-2.5 text-[13px] text-forest">
            Take a first reading
          </Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {rows.map((s) => (
            <li key={s.id}>
              <Link
                to={`/reading/${s.id}`}
                className="flex gap-4 overflow-hidden rounded-2xl border border-gold/15 bg-canopy/40 hover:border-gold/40"
              >
                <div className="h-28 w-28 shrink-0 bg-bark">
                  {s.input.imageDataUrl ? (
                    <img src={s.input.imageDataUrl} alt="" className="h-full w-full object-cover" />
                  ) : s.analysis ? (
                    <img src={s.analysis.falseColorUrl} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 py-4 pr-4">
                  <p className="specimen-label">{when(s.createdAt)} · {s.input.kingdom}</p>
                  <h2 className="display mt-1 truncate text-xl">{s.headline}</h2>
                  <p className="mt-1 line-clamp-2 text-[13px] text-ink-dim">
                    {s.input.species || s.input.category} — {s.input.notes || 'Notes omitted'}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
