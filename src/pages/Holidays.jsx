import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Container from '../components/Container'

const OH_BASE = 'https://openholidaysapi.org'
const NAGER_BASE = 'https://date.nager.at/api/v3'

export default function Holidays() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [country, setCountry] = useState('US') // try 'US', 'GB', 'DE', etc.
  const [lang, setLang] = useState('EN')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true); setError(''); setItems([])
    try {
      // 1) Try OpenHolidays (keyless) — JSON requested per docs
      const validFrom = `${year}-01-01`
      const validTo   = `${year}-12-31`
      const ohUrl = `${OH_BASE}/PublicHolidays?countryIsoCode=${encodeURIComponent(country)}&languageIsoCode=${encodeURIComponent(lang)}&validFrom=${validFrom}&validTo=${validTo}`
      const oh = await fetchJsonSafe(ohUrl, 'OpenHolidays')

      let normalized = Array.isArray(oh) ? oh.map(normalizeOpenHolidays(country, lang)) : []
      normalized = normalized.filter(Boolean)

      if (!normalized.length) {
        // 2) Fallback to Nager.Date (also free + CORS)
        const ngUrl = `${NAGER_BASE}/PublicHolidays/${year}/${encodeURIComponent(country)}`
        const ng = await fetchJsonSafe(ngUrl, 'Nager.Date')
        const ngNorm = Array.isArray(ng) ? ng.map(normalizeNager) : []
        if (!ngNorm.length) throw new Error('No holidays found from either source.')
        setItems(ngNorm)
      } else {
        setItems(normalized)
      }
    } catch (e) {
      setError(e.message || 'Failed to load holidays')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <Container className="flex-1 py-8">
        <h1 className="text-3xl font-bold mb-4">Public Holidays</h1>

        <div className="flex flex-wrap gap-2 mb-6 items-center">
          <label className="text-sm opacity-70">Year</label>
          <input
            type="number"
            className="px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 w-28"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
          <label className="text-sm opacity-70">Country (ISO-2)</label>
          <input
            className="px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 w-24"
            placeholder="e.g., US, GB, DE"
            value={country}
            onChange={(e) => setCountry(e.target.value.trim().toUpperCase())}
          />
          <label className="text-sm opacity-70">Lang</label>
          <input
            className="px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 w-20"
            value={lang}
            onChange={(e) => setLang(e.target.value.trim().toUpperCase())}
          />
          <button className="px-4 py-2 rounded-xl bg-sky-500 text-white" onClick={load} disabled={loading}>
            {loading ? 'Loading…' : 'Load'}
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="text-neutral-600 dark:text-neutral-400">No holidays found.</p>
        )}

        <div className="grid gap-3">
          {items.map((h) => (
            <div key={`${h.date}-${h.name}-${h.localName}`} className="rounded-2xl border border-black/10 dark:border-white/10 p-4 bg-white/60 dark:bg-neutral-900/60">
              <div className="font-semibold">{h.localName} <span className="opacity-60">({h.name})</span></div>
              <div className="text-sm opacity-80">
                {h.date} • {h.countryCode}
                {h.types?.length ? ` • ${h.types.join(', ')}` : ''}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-neutral-500">
          Source: OpenHolidays (keyless). Falls back to Nager.Date if unsupported or empty.
        </p>
      </Container>
      <Footer />
    </div>
  )
}

/** ===== Helpers ===== */

// Safer fetch: timeout, JSON content-type check, and clearer errors to avoid “Unexpected end of JSON input”
async function fetchJsonSafe(url, label, { timeoutMs = 12000 } = {}) {
  const ctrl = new AbortController()
  const id = setTimeout(() => ctrl.abort(), timeoutMs)
  let res
  try {
    res = await fetch(url, { headers: { accept: 'application/json, text/json' }, signal: ctrl.signal })
  } catch (e) {
    clearTimeout(id)
    throw new Error(`${label}: network error or blocked`)
  }
  clearTimeout(id)

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${label}: HTTP ${res.status}${text ? ` — ${text}` : ''}`)
  }

  const ct = (res.headers.get('content-type') || '').toLowerCase()
  if (!ct.includes('json')) {
    // Avoid JSON parse crash and provide hint
    const text = await res.text().catch(() => '')
    throw new Error(`${label}: unexpected response (not JSON)`)
  }

  return res.json()
}

// Normalize OpenHolidays objects to a common shape
function normalizeOpenHolidays(countryCode, lang) {
  return (item) => {
    if (!item) return null

    // Dates: some OH entries have startDate/endDate; treat single-day by startDate
    const date = item.date || item.startDate || item.validFrom || item.day || null

    // Names: OH often returns an array of { language, text }
    let localName = ''
    let englishName = ''

    if (Array.isArray(item.name)) {
      const byLang = Object.fromEntries(item.name.map(n => [n.language?.toUpperCase?.() || '', n.text || '']))
      englishName = byLang['EN'] || Object.values(byLang)[0] || ''
      localName = byLang[lang?.toUpperCase?.()] || englishName || ''
    } else if (item.name && typeof item.name === 'object' && item.name.text) {
      localName = item.name.text
      englishName = item.name.text
    } else if (typeof item.name === 'string') {
      localName = item.name
      englishName = item.name
    }

    const types = []
    if (item.type) types.push(String(item.type))
    if (Array.isArray(item.types)) item.types.forEach(t => types.push(String(t)))

    if (!date || !localName) return null
    return {
      date,
      localName,
      name: englishName || localName,
      countryCode: item.countryIsoCode || countryCode || '',
      types: [...new Set(types)],
    }
  }
}

// Normalize Nager.Date objects to the same shape
function normalizeNager(item) {
  return {
    date: item.date,
    localName: item.localName || item.name,
    name: item.name,
    countryCode: item.countryCode,
    types: item.types || (item.type ? [item.type] : []),
  }
}
