import Container from './Container'


export default function Footer() {
return (
<footer className="mt-16 border-t border-black/10 dark:border-white/10 py-8">
<Container className="text-sm text-neutral-600 dark:text-neutral-400 flex flex-col md:flex-row items-center justify-between gap-4">
<p>© {new Date().getFullYear()} MyProject. All rights reserved.</p>
<p className="opacity-80">Built with React • Vite • Tailwind v4</p>
</Container>
</footer>
)
}