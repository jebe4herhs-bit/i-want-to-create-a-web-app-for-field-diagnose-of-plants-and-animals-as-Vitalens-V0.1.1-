import { Camera, Focus, SunMedium, NotebookPen, Stethoscope, Trees } from 'lucide-react'

const SHOTS = [
  {
    img: '/images/hero-leaf.jpg',
    title: 'Fill the frame',
    body: 'The lesion should occupy most of the photograph. A garden-from-the-gate shot starves the chromatogram of pigment.',
  },
  {
    img: '/images/leaf-spots.jpg',
    title: 'Include the margin',
    body: 'Edge scorch versus centre spots changes the reading. Photograph the whole leaflet, then a tight crop of the worst patch.',
  },
  {
    img: '/images/vet-dog.jpg',
    title: 'Daylight, not flash',
    body: 'Tungsten and phone flash shift yellow into orange and hide erythema. Open shade or a north window is kinder.',
  },
]

export default function Guide() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <p className="specimen-label">Field notes</p>
      <h1 className="display mt-2 max-w-3xl text-4xl font-light leading-tight md:text-6xl">
        How to look, so the lens has something true to read.
      </h1>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {SHOTS.map((s) => (
          <figure key={s.title}>
            <img src={s.img} alt="" className="aspect-[4/5] w-full rounded-2xl object-cover" />
            <figcaption className="mt-4">
              <h2 className="display text-2xl">{s.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">{s.body}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <section className="mt-20 grid gap-10 md:grid-cols-2">
        <div className="rounded-[1.6rem] border border-gold/15 bg-canopy/50 p-8">
          <Trees className="h-6 w-6 text-gold" />
          <h2 className="display mt-5 text-3xl">Reading a plant</h2>
          <ul className="mt-5 space-y-4 text-[14.5px] leading-relaxed text-ink/85">
            <li>
              <strong className="text-gold">Which leaves first?</strong> Old growth yellowing → mobile nutrients (N, Mg, K, P). New growth pale → immobile (Fe, Ca, S, Zn, B).
            </li>
            <li>
              <strong className="text-gold">Uniform or veined?</strong> Even fade is often nitrogen or sulfur. A green net on yellow cloth is iron or magnesium, depending on age.
            </li>
            <li>
              <strong className="text-gold">Edge or island?</strong> Crispy rims are potassium, salt, or drought. Discrete spots with halos are usually infectious.
            </li>
            <li>
              <strong className="text-gold">Powder, rust, grease?</strong> White flour on top = powdery mildew. Orange pustules = rust. Greasy, fast, cool rain on tomato = late blight. Stop and call extension.
            </li>
            <li>
              <strong className="text-gold">Check the pot weight.</strong> Many “deficiencies” are drowning roots. If it wilts wet, it is not thirsty.
            </li>
          </ul>
        </div>
        <div className="rounded-[1.6rem] border border-gold/15 bg-canopy/50 p-8">
          <Stethoscope className="h-6 w-6 text-gold" />
          <h2 className="display mt-5 text-3xl">Reading an animal</h2>
          <ul className="mt-5 space-y-4 text-[14.5px] leading-relaxed text-ink/85">
            <li>
              <strong className="text-gold">Where is the itch?</strong> Rump and tail base → fleas until proven otherwise. Paws, face, ears → allergy. Ear edges and elbows → scabies until a vet says no.
            </li>
            <li>
              <strong className="text-gold">Round and scaly</strong> on a kitten, calf, or lamb is ringworm until stained otherwise. It jumps to people.
            </li>
            <li>
              <strong className="text-gold">Smell</strong> is data. Corn-chip grease is yeast. Sour pustules are bacteria. Necrotic hoof cleft is foot rot.
            </li>
            <li>
              <strong className="text-gold">Coat quality</strong> is a ration. Dull, thin, slow-healing skin is protein, fat, zinc, or parasites stealing them.
            </li>
            <li>
              <strong className="text-gold">Do not be brave with pain.</strong> Hot spots, lameness, open scale rot, and swollen bird feet are veterinary medicine, not internet cream.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          {
            icon: Camera,
            title: 'Two photographs',
            body: 'One establishing (which organ, which side of the plant or animal) and one lesion-tight. VitaLens reads the tight one; you need the establishing one to remember context.',
          },
          {
            icon: Focus,
            title: 'Write the timeline',
            body: 'Hours versus weeks splits infection from deficiency. “Started on the lowest leaves” is worth more than a paragraph of worry.',
          },
          {
            icon: SunMedium,
            title: 'Name the environment',
            body: 'Saucers of water, a new south window, a muddy lot, a seed-only diet, winter barn crowding — management is most of dermatology, plant or animal.',
          },
        ].map((x) => (
          <article key={x.title} className="rounded-2xl border border-gold/10 p-6">
            <x.icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
            <h3 className="display mt-4 text-xl">{x.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-dim">{x.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-16 overflow-hidden rounded-[2rem] border border-gold/15">
        <div className="grid md:grid-cols-2">
          <img src="/images/garden.jpg" alt="Garden plants" className="h-64 w-full object-cover md:h-full" />
          <div className="bg-bark p-8 md:p-12">
            <NotebookPen className="h-6 w-6 text-gold" />
            <h2 className="display mt-4 text-3xl">A sentence that helps</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/85">
              “Monstera, indoor pot, new leaves yellow with green veins, soil stays wet, two weeks.”
              Or: “Terrier, chewing rump a week, black specks on a wet paper towel turn red, other dog not itchy yet.”
            </p>
            <p className="mt-4 text-[14px] text-ink-dim">
              Species, setting, which tissue, color and pattern, time. That is a complete field note.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
