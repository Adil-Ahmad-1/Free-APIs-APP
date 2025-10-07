// src/pages/Metals.jsx
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Container from '../components/Container'

const OUNCES_TO_GRAMS = 31.1034768
const TOLA_GRAMS = 11.6638038
const KARAT_22_FACTOR = 22 / 24

// Use env if available; falls back to the key you provided
const FOREX_API_KEY =
  import.meta.env.VITE_FOREXRATE_API_KEY || 'aca7f5636c8d5b46f92dee0707837a97'

export default function Metals() {
  const [goldPKR, setGoldPKR] = useState(null)     // PKR per ounce
  const [silverPKR, setSilverPKR] = useState(null) // PKR per ounce
  const [updatedAt, setUpdatedAt] = useState(null) // ISO (from gold-api)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true); setError('')

      // 1) Gold & Silver in USD/oz from gold-api.com (no key required)
      const [xauResp, xagResp] = await Promise.all([
        fetch('https://api.gold-api.com/price/XAU'),
        fetch('https://api.gold-api.com/price/XAG'),
      ])
      if (!xauResp.ok || !xagResp.ok) throw new Error('Metal price request failed')

      const [xauJson, xagJson] = await Promise.all([xauResp.json(), xagResp.json()])
      const usdPerOzGold = Number(xauJson?.price)
      const usdPerOzSilver = Number(xagJson?.price)
      if (!usdPerOzGold || !usdPerOzSilver) throw new Error('Missing USD prices')

      // 2) USD→PKR from ForexRateAPI (needs your API key)
      const fxUrl = `https://api.forexrateapi.com/v1/latest?api_key=${encodeURIComponent(
        FOREX_API_KEY
      )}&base=USD&currencies=PKR`
      const fxResp = await fetch(fxUrl)
      if (!fxResp.ok) throw new Error('FX request failed')
      const fxJson = await fxResp.json()
      if (!fxJson?.success) throw new Error('FX response not successful')
      const usdToPkr = Number(fxJson?.rates?.PKR)
      if (!usdToPkr) throw new Error('Missing PKR FX rate')

      // 3) Convert to PKR per oz
      setGoldPKR(usdPerOzGold * usdToPkr)
      setSilverPKR(usdPerOzSilver * usdToPkr)

      // Use the freshest metals timestamp if present
      setUpdatedAt(xauJson?.updatedAt || xagJson?.updatedAt || null)
    } catch (e) {
      setError(e.message || 'Could not fetch metals — try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <Container className="flex-1 py-8">
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <h1 className="text-3xl font-bold">Gold & Silver (PKR)</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              USD/oz via gold-api.com → converted to PKR using ForexRateAPI
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-xl bg-sky-500 text-white"
            onClick={load}
            disabled={loading}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="grid gap-6 md:grid-cols-2">
          <MetalCard title="Gold (XAU)" pkrPerOz={goldPKR} updatedAt={updatedAt} />
          <MetalCard title="Silver (XAG)" pkrPerOz={silverPKR} updatedAt={updatedAt} />
        </div>

        <p className="mt-6 text-xs text-neutral-500">
          * 1 tola ≈ 11.6638 g; 24K is pure; 22K is common jewelry purity.
        </p>
      </Container>
      <Footer />
    </div>
  )
}

function MetalCard({ title, pkrPerOz, updatedAt }) {
  if (!pkrPerOz) {
    return (
      <div className="rounded-2xl border border-black/10 dark:border-white/10 p-5">
        <h2 className="font-semibold text-lg mb-2">{title}</h2>
        <p className="opacity-70">No data</p>
      </div>
    )
  }

  const pkrPerGram = pkrPerOz / OUNCES_TO_GRAMS
  const pkrPerTola = pkrPerGram * TOLA_GRAMS
  const pkrPerGram22k = pkrPerGram * KARAT_22_FACTOR
  const pkrPerTola22k = pkrPerTola * KARAT_22_FACTOR

  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-5 bg-white/60 dark:bg-neutral-900/60">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">{title}</h2>
        <div className="text-xs opacity-70">
          {updatedAt ? `Updated: ${new Date(updatedAt).toLocaleString()}` : ''}
        </div>
      </div>

      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        <Stat label="Per Ounce (24K)" value={fmtPKR(pkrPerOz)} />
        <Stat label="Per Gram (24K)" value={fmtPKR(pkrPerGram)} />
        <Stat label="Per Tola (24K)" value={fmtPKR(pkrPerTola)} />
      </div>

      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        <Stat label="Per Gram (22K)" value={fmtPKR(pkrPerGram22k)} />
        <Stat label="Per Tola (22K)" value={fmtPKR(pkrPerTola22k)} />
        <Stat label="10g (24K)" value={fmtPKR(pkrPerGram * 10)} />
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 p-4">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  )
}

function fmtPKR(n) {
  if (n == null || Number.isNaN(n)) return '—'
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(n)
}
