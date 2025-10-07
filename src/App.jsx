import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Container from './components/Container'
import Hero from './components/Hero'
import FeatureCard from './components/FeatureCard'


export default function App() {
const features = [
{ title: 'Weather', desc: 'Forecast powered by Open‑Meteo', to: '/weather', icon: '🌦️' },
{ title: 'Gold & Silver', desc: 'Live spot prices (USD)', to: '/metals', icon: '🪙' },
{ title: 'Movies', desc: 'Studio Ghibli films', to: '/movies', icon: '🎬' },
{ title: 'Quotes', desc: 'Random inspirational quotes', to: '/quotes', icon: '💬' },
{ title: 'Holidays', desc: 'Public holidays by country/year', to: '/holidays', icon: '📅' },
]


return (
<div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-neutral-950 dark:to-neutral-900 text-[--color-ink] dark:text-white">
<Navbar />
<main>
<Hero />
<Container>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
{features.map((f) => (
<FeatureCard key={f.to} {...f} />
))}
</div>
</Container>
</main>
<Footer />
</div>
)
}