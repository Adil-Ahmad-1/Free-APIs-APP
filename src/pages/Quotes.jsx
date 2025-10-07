import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Container from '../components/Container'

const FALLBACK_QUOTES = [
  { content: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { content: 'Well begun is half done.', author: 'Aristotle' },
  { content: 'The only way out is through.', author: 'Robert Frost' },
  { content: 'Action is the foundational key to all success.', author: 'Pablo Picasso' },
]

export default function Quotes() {
  const [quote, setQuote] = useState(null) // {content, author}
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true); setError('')
    try {
      // 1) Primary: DummyJSON (random)
      const r1 = await fetch('https://dummyjson.com/quotes/random')
      if (r1.ok) {
        const j = await r1.json()
        setQuote({ content: j.quote, author: j.author || 'Unknown' })
        return
      }

      // 2) Fallback: type.fit big JSON list -> pick random
      const r2 = await fetch('https://type.fit/api/quotes')
      if (r2.ok) {
        const arr = await r2.json()
        if (Array.isArray(arr) && arr.length) {
          const pick = arr[Math.floor(Math.random() * arr.length)]
          setQuote({ content: pick.text, author: pick.author || 'Unknown' })
          return
        }
      }

      // 3) Final fallback: local list
      const pick = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
      setQuote(pick)
    } catch (e) {
      // still show a local fallback so UI never breaks
      const pick = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
      setQuote(pick)
      setError('Online quote sources unreachable. Showing a local quote.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <Container className="flex-1 py-8">
        <div className="flex items-end justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold">Quotes</h1>
          <button
            className="px-4 py-2 rounded-xl bg-sky-500 text-white"
            onClick={load}
            disabled={loading}
          >
            {loading ? 'Loading…' : 'New Quote'}
          </button>
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        {quote && (
          <div className="rounded-2xl border border-black/10 dark:border-white/10 p-6 bg-white/60 dark:bg-neutral-900/60">
            <blockquote className="text-xl leading-relaxed">“{quote.content}”</blockquote>
            <div className="mt-3 text-sm opacity-80">— {quote.author}</div>
          </div>
        )}
      </Container>
      <Footer />
    </div>
  )
}
