// src/pages/Weather.jsx
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Container from '../components/Container'

export default function Weather() {
  const [query, setQuery] = useState('Lahore')            // <- controlled input
  const [city, setCity] = useState('Lahore')              // what we show
  const [coords, setCoords] = useState({ lat: 31.5204, lon: 74.3587 })
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchWeather()
    // re-fetch whenever coordinates change
  }, [coords.lat, coords.lon])

  async function fetchWeather() {
    try {
      setLoading(true); setError('')
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}` +
        `&hourly=temperature_2m,relative_humidity_2m&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch weather')
      const json = await res.json()
      setData(json)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function geocode(q) {
    if (!q?.trim()) { setError('Please enter a city'); return }
    try {
      setLoading(true); setError('')
      // Nominatim free geocoding
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`
      )
      if (!res.ok) throw new Error('Geocoding failed')
      const [hit] = await res.json()
      if (hit) {
        // Prefer the first part of display_name as city label
        const label = hit.display_name?.split(',')[0] || q
        setCity(label)
        setCoords({ lat: Number(hit.lat), lon: Number(hit.lon) }) // <- triggers fetchWeather via useEffect
      } else {
        setError('City not found')
      }
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <Container className="flex-1 py-8">
        <h1 className="text-3xl font-bold mb-4">Weather</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          <input
            className="px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 min-w-56"
            placeholder="Search city (e.g., Gujranwala)"
            value={query}                                 // <- controlled
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') geocode(query) }}
          />
          <button
            className="px-4 py-2 rounded-xl bg-sky-500 text-white"
            onClick={() => geocode(query)}                // <- uses current input
          >
            Search
          </button>
        </div>

        {loading && <p>Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {data?.current && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="City" value={city} />
            <Stat label="Temp (°C)" value={data.current.temperature_2m} />
            <Stat label="Humidity (%)" value={data.current.relative_humidity_2m} />
            <Stat label="Wind (m/s)" value={data.current.wind_speed_10m} />
            <Stat label="Lat" value={coords.lat.toFixed(4)} />
            <Stat label="Lon" value={coords.lon.toFixed(4)} />
          </div>
        )}
      </Container>
      <Footer />
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
      <div className="text-sm text-neutral-500">{label}</div>
      <div className="text-2xl font-semibold">{String(value)}</div>
    </div>
  )
}
