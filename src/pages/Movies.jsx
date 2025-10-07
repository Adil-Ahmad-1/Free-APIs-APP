import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Container from '../components/Container'

const FALLBACK_POSTER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="system-ui, -apple-system, Segoe UI, Roboto" font-size="20" fill="#6b7280">
        No Image
      </text>
    </svg>`
  )

export default function Movies() {
  const [films, setFilms] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true); setError('')
      const res = await fetch('https://ghibliapi.vercel.app/films')
      if (!res.ok) throw new Error('Failed to fetch films')
      setFilms(await res.json())
    } catch (e) {
      setError(e.message || 'Failed to load movies')
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return s ? films.filter(f => f.title.toLowerCase().includes(s)) : films
  }, [films, q])

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <Container className="flex-1 py-8">
        <div className="flex items-end justify-between gap-3 mb-4">
          <h1 className="text-3xl font-bold">Movies (Studio Ghibli)</h1>
          <div className="flex gap-2">
            <input
              className="px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 min-w-56"
              placeholder="Search title…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="px-4 py-2 rounded-xl bg-sky-500 text-white" onClick={load}>
              Reload
            </button>
          </div>
        </div>

        {loading && <p>Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(f => (
            <article key={f.id}
              className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60">
              {/* Banner */}
              <div className="h-28 w-full bg-cover bg-center"
                   style={{ backgroundImage: `url('${f.movie_banner || ''}')` }} />
              {/* Body */}
              <div className="p-4 flex gap-4">
                <img
                  src={f.image || FALLBACK_POSTER}
                  onError={(e) => { e.currentTarget.src = FALLBACK_POSTER }}
                  alt={f.title}
                  className="w-24 h-36 object-cover rounded-lg border border-black/10 dark:border-white/10 flex-shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg truncate" title={f.title}>{f.title}</h3>
                  <div className="text-sm opacity-80 mb-2">
                    Year: {f.release_date} • Score: {f.rt_score}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-4">
                    {f.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loading && !error && filtered.length === 0 && (
          <p className="mt-6 text-neutral-600 dark:text-neutral-400">No movies match “{q}”.</p>
        )}
      </Container>
      <Footer />
    </div>
  )
}
