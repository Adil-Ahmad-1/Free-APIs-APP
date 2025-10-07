import { Link } from 'react-router-dom'


export default function FeatureCard({ title, desc, to, icon }) {
return (
<Link to={to} className="group block">
<div className="rounded-2xl border border-black/10 dark:border-white/10 p-5 shadow-sm hover:shadow-md transition bg-white/60 dark:bg-neutral-900/60 backdrop-blur">
<div className="flex items-center gap-3">
<div className="size-10 rounded-xl grid place-items-center bg-sky-500/10 group-hover:bg-sky-500/15">
<span className="text-xl">{icon}</span>
</div>
<div>
<h3 className="font-semibold">{title}</h3>
<p className="text-sm text-neutral-600 dark:text-neutral-400">{desc}</p>
</div>
</div>
</div>
</Link>
)
}