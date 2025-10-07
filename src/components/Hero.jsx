import Container from './Container'


export default function Hero() {
return (
<section className="relative overflow-hidden">
<div className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(70%_50%_at_50%_0%,black,transparent)]">
<div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[28rem] w-[80rem] rounded-full bg-gradient-to-b from-sky-400/30 to-transparent blur-3xl"></div>
</div>
<Container className="py-16 sm:py-24">
<div className="text-center">
<h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
API Playground for <span className="text-sky-500">Real‑Time</span> Data
</h1>
<p className="mt-4 text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
Explore weather, live metals, films, quotes, and global holidays — all in a clean, modern React + Tailwind v4 app.
</p>
</div>
</Container>
</section>
)
}