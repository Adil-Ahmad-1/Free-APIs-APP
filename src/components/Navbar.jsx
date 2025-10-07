import { Link, NavLink } from 'react-router-dom'


export default function Navbar() {
const navItem = (to, label) => (
<NavLink
to={to}
className={({ isActive }) =>
`px-3 py-2 rounded-xl text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/10 ${
isActive ? 'bg-black/10 dark:bg-white/15' : ''
}`
}
>{label}</NavLink>
)


return (
<header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/50 dark:bg-neutral-900/50 border-b border-black/10 dark:border-white/10">
<nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
<Link to="/" className="font-bold tracking-tight text-lg">
<span className="text-sky-500">My</span>Project
</Link>
<div className="hidden md:flex items-center gap-1">
{navItem('/weather', 'Weather')}
{navItem('/metals', 'Metals')}
{navItem('/movies', 'Movies')}
{navItem('/quotes', 'Quotes')}
{navItem('/holidays', 'Holidays')}
</div>
</nav>
</header>
)
}