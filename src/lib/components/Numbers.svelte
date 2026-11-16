<script>
	import { reveal } from '#lib/motion.svelte.js';

	let { github } = $props();

	const repos = $derived(github.repos ?? []);
	const langs = $derived.by(() => {
		const count = {};
		for (const r of repos) if (r.language) count[r.language] = (count[r.language] ?? 0) + 1;
		const total = Object.values(count).reduce((a, b) => a + b, 0) || 1;
		return Object.entries(count)
			.sort((a, b) => b[1] - a[1])
			.map(([name, n]) => ({ name, n, pct: (n / total) * 100 }));
	});
	const latest = $derived(repos.slice(0, 4));
	const fmt = (iso) => new Date(iso).toLocaleDateString('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });
	const built = $derived(
		new Date(github.fetchedAt).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
	);
	// Shades of ink, not a rainbow: the label carries the meaning, not the colour.
	const shade = (i) => `color-mix(in srgb, var(--ink) ${Math.max(22, 92 - i * 22)}%, var(--surface))`;
</script>

<section id="numbers">
	<div class="wrap">
		<div use:reveal>
			<p class="tag">github · {github.live ? 'live at build' : 'snapshot'} · {built}</p>
			<h2>By the <em class="serif">numbers.</em></h2>
			<p class="lede">
				Pulled from my public GitHub each time this site rebuilds. Most of my work is private, so
				read these as a floor.
			</p>
		</div>

		<div class="grid" use:reveal>
			<div class="stat">
				<b>{repos.length}</b>
				<span>public repositories of my own</span>
			</div>
			<div class="stat">
				<b>{langs.length}</b>
				<span>primary languages across them</span>
			</div>
			<div class="stat">
				<b>{latest[0] ? fmt(latest[0].pushedAt) : '—'}</b>
				<span>latest public push</span>
			</div>
		</div>

		<div class="split" use:reveal>
			<div>
				<p class="mono label">LANGUAGES, BY REPOSITORY</p>
				<div class="bar" role="img" aria-label={langs.map((l) => `${l.name}: ${l.n}`).join(', ')}>
					{#each langs as l, i}
						<span style:flex={l.n} style:background={shade(i)}></span>
					{/each}
				</div>
				<ul class="legend">
					{#each langs as l, i}
						<li><i style:background={shade(i)}></i>{l.name} <span>{l.n}</span></li>
					{/each}
				</ul>
			</div>
			<div>
				<p class="mono label">RECENTLY PUSHED</p>
				<ul class="recent">
					{#each latest as r}
						<li>
							<a href={r.url} rel="noopener">{r.name}</a>
							<span class="mono">{fmt(r.pushedAt)}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
		gap: 14px;
		margin-top: 44px;
	}
	.stat {
		padding: 24px;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--paper);
		display: grid;
		gap: 6px;
	}
	.stat b {
		font-size: clamp(36px, 5vw, 48px);
		line-height: 1;
		font-weight: 600;
		letter-spacing: -0.04em;
		font-variant-numeric: tabular-nums;
	}
	.stat span {
		color: var(--muted);
		font-size: 14.5px;
	}
	.split {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
		margin-top: 40px;
	}
	.label {
		font-size: 11px;
		letter-spacing: 0.1em;
		color: var(--muted);
		margin-bottom: 14px;
	}
	.bar {
		display: flex;
		gap: 2px;
		height: 14px;
		border-radius: 4px;
		overflow: hidden;
	}
	.legend,
	.recent {
		list-style: none;
		padding: 0;
		margin: 14px 0 0;
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 18px;
		font-size: 14px;
	}
	.legend li {
		display: flex;
		align-items: center;
		gap: 7px;
	}
	.legend i {
		width: 10px;
		height: 10px;
		border-radius: 2px;
	}
	.legend span {
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}
	.recent {
		margin-top: 0;
	}
	.recent li {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 10px 0;
		border-bottom: 1px solid var(--line);
		font-size: 15px;
	}
	.recent a {
		text-decoration: none;
		font-weight: 500;
		overflow-wrap: anywhere;
	}
	.recent a:hover {
		color: var(--accent);
	}
	.recent span {
		font-size: 12px;
		color: var(--muted);
		white-space: nowrap;
	}
	@media (max-width: 720px) {
		.split {
			grid-template-columns: 1fr;
		}
	}
</style>
