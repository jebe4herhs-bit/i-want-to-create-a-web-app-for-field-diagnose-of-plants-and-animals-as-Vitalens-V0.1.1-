import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, ImagePlus, Leaf, PawPrint, Sparkles, X } from 'lucide-react'
import { ANIMAL_CATEGORIES, CATEGORY_LABELS, PLANT_CATEGORIES } from '../lib/conditions'
import { runScan } from '../lib/analyzer'
import { saveScan } from '../lib/storage'
import type { Category, Kingdom } from '../lib/types'

const DURATIONS = ['Hours', '1–3 days', 'About a week', 'Several weeks', 'A month or more', 'Sudden overnight']
const ENV_PLANT = ['Indoor pot', 'Greenhouse', 'Garden bed', 'Field / orchard', 'Hydro / soilless']
const ENV_ANIMAL = ['House companion', 'Yard / kennel', 'Pasture', 'Barn / flock', 'Vivarium']

export default function Examine() {
  const nav = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [kingdom, setKingdom] = useState<Kingdom>('plant')
  const [category, setCategory] = useState<Category>('houseplant')
  const [species, setSpecies] = useState('')
  const [notes, setNotes] = useState('')
  const [duration, setDuration] = useState('About a week')
  const [environment, setEnvironment] = useState('Indoor pot')
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const cats = kingdom === 'plant' ? PLANT_CATEGORIES : ANIMAL_CATEGORIES
  const envs = kingdom === 'plant' ? ENV_PLANT : ENV_ANIMAL

  const canRun = useMemo(
    () => Boolean(preview || notes.trim().length > 12),
    [preview, notes],
  )

  function onKingdom(k: Kingdom) {
    setKingdom(k)
    if (k === 'plant') {
      setCategory('houseplant')
      setEnvironment('Indoor pot')
    } else {
      setCategory('dog')
      setEnvironment('House companion')
    }
  }

  function onFile(file?: File) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose a photograph.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setPreview(String(reader.result))
    reader.readAsDataURL(file)
    setError('')
  }

  async function loadSample(
    k: Kingdom,
    src: string,
    cat: Category,
    name: string,
    description: string,
  ) {
    onKingdom(k)
    setCategory(cat)
    setSpecies(name)
    setNotes(description)
    setDuration('About a week')
    try {
      const res = await fetch(src)
      const blob = await res.blob()
      const reader = new FileReader()
      reader.onload = () => setPreview(String(reader.result))
      reader.readAsDataURL(blob)
      setError('')
    } catch {
      setError('Could not load the sample plate.')
    }
  }

  async function submit() {
    if (!canRun) {
      setError('Add a snapshot, or at least a sentence of description.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const result = await runScan({
        kingdom,
        category,
        species,
        notes,
        duration,
        environment,
        imageDataUrl: preview ?? undefined,
      })
      saveScan(result)
      nav(`/reading/${result.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The reading failed. Try another image.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <p className="specimen-label">New specimen</p>
      <h1 className="display mt-2 max-w-2xl text-4xl font-light leading-tight md:text-6xl">
        Photograph the affected tissue. Tell us what you see.
      </h1>
      <p className="mt-4 max-w-xl text-[15px] text-ink-dim">
        Close, daylight, fill the frame with the lesion — not the whole garden or the whole dog.
        Notes matter as much as pixels.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          {preview ? (
            <div className="relative overflow-hidden rounded-[1.6rem] border border-gold/20">
              <img src={preview} alt="Specimen snapshot" className="aspect-[4/3] w-full object-cover" />
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-forest/80 text-ink"
                aria-label="Remove snapshot"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="absolute bottom-3 left-3 specimen-label bg-forest/70 px-2 py-1">Snapshot loaded</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                onFile(e.dataTransfer.files?.[0])
              }}
              className={`flex aspect-[4/3] w-full flex-col items-center justify-center gap-4 rounded-[1.6rem] border border-dashed bg-canopy/50 text-ink-dim hover:border-gold hover:text-ink ${
                dragOver ? 'border-gold text-ink' : 'border-gold/30'
              }`}
            >
              <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/30">
                <ImagePlus className="h-6 w-6 text-gold" />
              </span>
              <span className="text-center">
                <span className="block text-[15px] text-ink">Drop a snapshot or tap to capture</span>
                <span className="mt-1 block text-[12px]">JPG, PNG, HEIC · close crop of the lesion</span>
              </span>
            </button>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full border border-gold/25 px-4 py-2 text-[12px] tracking-wide text-ink-dim hover:text-ink"
            >
              <Camera className="h-3.5 w-3.5" /> {preview ? 'Replace image' : 'Choose file'}
            </button>
            <button
              type="button"
              onClick={() =>
                loadSample(
                  'plant',
                  '/images/leaf-spots.jpg',
                  'houseplant',
                  'Monstera deliciosa',
                  'Older leaves with brown spots and yellow halos. Some crispy edges. Indoor pot, soil often stays wet.',
                )
              }
              className="rounded-full border border-gold/25 px-4 py-2 text-[12px] tracking-wide text-ink-dim hover:text-ink"
            >
              Sample leaf
            </button>
            <button
              type="button"
              onClick={() =>
                loadSample(
                  'animal',
                  '/images/vet-dog.jpg',
                  'dog',
                  'Terrier mix',
                  'Chewing the rump and tail base for a week. Black specks in the coat. Red irritated skin, restless at night.',
                )
              }
              className="rounded-full border border-gold/25 px-4 py-2 text-[12px] tracking-wide text-ink-dim hover:text-ink"
            >
              Sample coat
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="specimen-label mb-3">Kingdom</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onKingdom('plant')}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left ${
                  kingdom === 'plant' ? 'border-gold bg-gold/10' : 'border-gold/15 bg-canopy/40'
                }`}
              >
                <Leaf className="h-4 w-4 text-gold" />
                <span>
                  <span className="block text-[14px]">Plant</span>
                  <span className="text-[11px] text-ink-dim">Leaf, stem, fruit</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => onKingdom('animal')}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left ${
                  kingdom === 'animal' ? 'border-gold bg-gold/10' : 'border-gold/15 bg-canopy/40'
                }`}
              >
                <PawPrint className="h-4 w-4 text-gold" />
                <span>
                  <span className="block text-[14px]">Animal</span>
                  <span className="text-[11px] text-ink-dim">Skin, coat, scale</span>
                </span>
              </button>
            </div>
          </div>

          <label className="block">
            <span className="specimen-label">Subject class</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="mt-2 w-full rounded-xl border border-gold/20 bg-bark px-3 py-2.5 text-[14px] outline-none focus:border-gold"
            >
              {cats.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="specimen-label">Species or variety (optional)</span>
            <input
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              placeholder={kingdom === 'plant' ? 'e.g. tomato, monstera, citrus' : 'e.g. husky, calf, cockatiel'}
              className="mt-2 w-full rounded-xl border border-gold/20 bg-bark px-3 py-2.5 text-[14px] outline-none placeholder:text-ink-dim/50 focus:border-gold"
            />
          </label>

          <label className="block">
            <span className="specimen-label">What do you see</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Older leaves turning yellow while veins stay green. Started at the bottom. Soil stays wet. Or: dog chewing the rump, black specks in the coat, worse this week…"
              className="mt-2 w-full resize-y rounded-xl border border-gold/20 bg-bark px-3 py-2.5 text-[14px] leading-relaxed outline-none placeholder:text-ink-dim/50 focus:border-gold"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="specimen-label">How long</span>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gold/20 bg-bark px-3 py-2.5 text-[14px] outline-none focus:border-gold"
              >
                {DURATIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="specimen-label">Setting</span>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gold/20 bg-bark px-3 py-2.5 text-[14px] outline-none focus:border-gold"
              >
                {envs.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
          </div>

          {error && <p className="text-[13px] text-urgent">{error}</p>}

          <button
            type="button"
            disabled={busy}
            onClick={submit}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3.5 text-[14px] font-medium text-forest disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {busy ? 'Reading pigments & notes…' : 'Take the reading'}
          </button>
          <p className="text-center text-[11px] leading-relaxed text-ink-dim">
            On-device chromatogram · no account · stored only in this browser
          </p>
        </div>
      </div>
    </div>
  )
}
