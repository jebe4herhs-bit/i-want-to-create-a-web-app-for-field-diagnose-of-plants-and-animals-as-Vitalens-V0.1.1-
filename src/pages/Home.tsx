import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Camera, Feather, Leaf, ShieldAlert } from 'lucide-react'

const CASES = [
  {
    img: '/images/plant-yellow.jpg',
    kicker: 'Plant · chlorosis',
    title: 'When green goes gold',
    copy: 'Uniform fade on older leaves is often nitrogen. A green-vein net on new leaves is iron locked by pH.',
  },
  {
    img: '/images/vet-dog.jpg',
    kicker: 'Animal · integument',
    title: 'Itch has an address',
    copy: 'Rump and tail-base chewing points to fleas. Paws and face, season after season, is more often atopy.',
  },
  {
    img: '/images/leaf-spots.jpg',
    kicker: 'Plant · pathogen',
    title: 'Spots are not all equal',
    copy: 'Bullseyes climb from the soil. Greasy collapse in cool rain is late blight — a different urgency entirely.',
  },
]

export default function Home() {
  return (
    <div className="relative">
      <section className="relative min-h-dvh overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-leaf.jpg"
        >
          <source src="/videos/hero-leaves.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-forest/40 via-forest/55 to-forest" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#07110c_78%)]" />

        <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:pb-24">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="specimen-label mb-6"
          >
            A pocket laboratory for chlorophyll & keratin
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="display max-w-3xl text-[46px] font-light leading-[0.95] tracking-tight text-ink md:text-[82px]"
          >
            Read the skin
            <br />
            <em className="italic text-gold">of a living thing.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink/80 md:text-[18px]"
          >
            Snapshot a leaf, a muzzle, a pad, a scale. Add what you have noticed.
            VitaLens maps likely deficiencies, pests, and pathogens — then names
            what the organism lacks, and what it needs to recover.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/examine"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-[14px] font-medium text-forest hover:bg-ink"
            >
              Open the lens <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/atlas"
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-6 py-3 text-[14px] text-ink hover:border-gold"
            >
              Browse the atlas
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="specimen-label mb-4">How a reading works</p>
        <h2 className="display max-w-2xl text-4xl font-light leading-tight md:text-5xl">
          Color, pattern, and the words you bring.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Camera,
              title: 'Chromatogram',
              body: 'Your snapshot is sampled into a false-color map — chlorosis, necrosis, rust, powder, erythema — so the eye and the algorithm look at the same pigments.',
            },
            {
              icon: Feather,
              title: 'Field notes',
              body: 'Where it started, how fast, which leaves or which limb. Language is half the diagnosis: “green veins on new growth” is not the same as “old leaves pale.”',
            },
            {
              icon: Leaf,
              title: 'Lack & need',
              body: 'Each match names the deficit (nitrogen, zinc, airflow, a mite-free coat) and a protocol — what to give, what to stop, when a professional is the next step.',
            },
          ].map((s) => (
            <article key={s.title} className="rounded-3xl border border-gold/15 bg-canopy/60 p-7">
              <s.icon className="mb-6 h-6 w-6 text-gold" strokeWidth={1.4} />
              <h3 className="display text-2xl font-medium">{s.title}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-dim">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="overflow-hidden rounded-[2rem] border border-gold/15">
          <img src="/images/brand-lens.png" alt="Brass lens over a botanical specimen" className="h-[42vh] w-full object-cover md:h-[56vh]" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="specimen-label mb-4">From the case drawer</p>
            <h2 className="display text-4xl font-light md:text-5xl">Three patterns worth knowing.</h2>
          </div>
          <Link to="/atlas" className="hidden text-[13px] tracking-wide text-gold md:inline">
            Full atlas →
          </Link>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {CASES.map((c) => (
            <article key={c.title} className="group">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={c.img}
                  alt=""
                  className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <p className="specimen-label mt-5">{c.kicker}</p>
              <h3 className="display mt-2 text-2xl">{c.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-dim">{c.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-gold/20 bg-bark">
          <img
            src="/images/greenhouse.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="relative grid gap-10 p-8 md:grid-cols-[1.4fr_1fr] md:p-14">
            <div>
              <p className="specimen-label mb-4">Honest limits</p>
              <h2 className="display text-4xl font-light leading-tight md:text-5xl">
                A reading is a hypothesis you can act on.
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink/80">
                VitaLens does not replace a veterinarian, plant pathologist, or extension agent.
                It organizes what the snapshot and your notes already contain, against an atlas of
                well-described deficiencies, pests, and diseases.
              </p>
            </div>
            <div className="flex flex-col justify-end gap-4">
              <div className="flex items-start gap-3 rounded-2xl bg-forest/70 p-4">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-copper" />
                <p className="text-[13.5px] leading-relaxed text-ink/80">
                  Pain, collapse, greasy blight on nightshades, open sores, or anything zoonotic
                  (ringworm, scabies) belongs with a licensed professional the same day.
                </p>
              </div>
              <Link
                to="/examine"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-gold px-5 py-3 text-[13px] font-medium text-forest"
              >
                Take a reading <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
