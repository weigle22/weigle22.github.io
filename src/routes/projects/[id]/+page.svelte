<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Lock from '@lucide/svelte/icons/lock';
	import Star from '@lucide/svelte/icons/star';
	import Plate from '#lib/components/Plate.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import { site } from '#lib/data/site.ts';
	import { technologies } from '#lib/data/technologies.ts';
	import { dayMonthYear, pad2 } from '#lib/utils/format.ts';

	let { data } = $props();
	const p = $derived(data.project);
	const tech = $derived(p.technologies.map((name) => technologies.find((t) => t.name === name) ?? { name, category: '', description: '' }));
</script>

<svelte:head>
	<title>{p.title} · {site.name}</title>
	<meta name="description" content={p.description} />
	<link rel="canonical" href="{site.url}/projects/{p.id}/" />
	<meta property="og:title" content="{p.title} · {site.name}" />
	<meta property="og:description" content={p.description} />
</svelte:head>

{#key p.id}
	<main>
		<header class="dark top">
			<div class="wrap">
				<a class="back u" href="/#project-{p.id}"><ArrowLeft size={14} /> All work</a>
				<div class="eyebrow"><span>Case study ({pad2(data.index + 1)})</span><span>{p.category}{p.year ? ` · ©${p.year}` : ''}</span></div>
				<h1>{p.title}</h1>
				<p class="desc">{p.description}</p>
			</div>
		</header>

		<div class="light">
			<div class="wrap">
				<div class="plate">
					{#if p.image}<img src={p.image} alt="{p.title} preview" />{:else}<Plate id={p.id} title={p.title} />{/if}
				</div>

				<dl class="facts">
					<div><dt>Category</dt><dd>{p.category}</dd></div>
					{#if p.github}
						<div><dt>Primary language</dt><dd>{p.github.language ?? '—'}</dd></div>
						<div><dt>Stars</dt><dd class="inline"><Star size={13} /> {p.github.stars}</dd></div>
						<div><dt>Last updated</dt><dd>{dayMonthYear(p.github.updatedAt)}</dd></div>
					{:else if p.repository}
						<div><dt>Repository</dt><dd>GitHub data unavailable</dd></div>
					{:else}
						<div><dt>Repository</dt><dd class="inline"><Lock size={13} /> Private work</dd></div>
					{/if}
				</dl>

				<div class="story">
					<div>
						<p class="label">The surface</p>
						<p class="quote">{p.surface}</p>
					</div>
					<div>
						<p class="label">Underneath</p>
						<ol>
							{#each p.highlights as h, i}
								<li><span>{pad2(i + 1)}</span>{h}</li>
							{/each}
						</ol>
					</div>
				</div>

				<div class="tech">
					<p class="label">Built with</p>
					<ul>
						{#each tech as t}
							<li><b>{t.name}</b><span>{t.description}</span></li>
						{/each}
					</ul>
				</div>

				<div class="links">
					{#if p.github}
						<a class="pill solid" href={p.github.url} rel="noopener">View the code <ArrowUpRight size={16} /></a>
					{/if}
					{#if p.liveUrl}<a class="pill" href={p.liveUrl} rel="noopener">Live site <ArrowUpRight size={16} /></a>{/if}
					{#if p.github?.latestCommit}
						<p class="commit mono">Latest commit {p.github.latestCommit.sha} · {dayMonthYear(p.github.latestCommit.date)} · “{p.github.latestCommit.message}”</p>
					{:else if !p.repository}
						<p class="commit">This is private work, so it is described generically and has no code link.</p>
					{/if}
				</div>
			</div>
		</div>

		<nav class="dark pager" aria-label="More projects">
			<div class="wrap">
				<a href="/projects/{data.prev.id}/"><span class="label"><ArrowLeft size={12} /> Previous</span><b>{data.prev.title}</b></a>
				<a class="next" href="/projects/{data.next.id}/" data-cursor="Next"><span class="label">Next <ArrowRight size={12} /></span><b>{data.next.title}</b></a>
			</div>
		</nav>
	</main>
{/key}
<Footer />

<style>
	.top {
		padding: 120px 0 clamp(40px, 6vw, 72px);
	}
	.back {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin-bottom: 40px;
	}
	h1 {
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(64px, 13vw, 220px);
		line-height: 0.88;
		letter-spacing: -0.02em;
	}
	.desc {
		margin-top: 28px;
		font-size: clamp(20px, 2.4vw, 32px);
		line-height: 1.2;
		letter-spacing: -0.02em;
		max-width: 28ch;
		text-wrap: balance;
	}
	.light {
		padding: clamp(24px, 4vw, 48px) 0 clamp(64px, 9vw, 120px);
	}
	.plate {
		aspect-ratio: 16 / 9;
		border-radius: var(--radius);
		overflow: hidden;
		border: 1px solid var(--line);
	}
	.plate img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.facts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 20px;
		margin: 28px 0 0;
		padding-bottom: 28px;
		border-bottom: 1px solid var(--line);
		font-size: 14px;
	}
	dt {
		color: var(--muted);
	}
	dd {
		margin: 4px 0 0;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}
	.inline {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.story {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: clamp(32px, 6vw, 96px);
		margin-top: clamp(48px, 7vw, 96px);
	}
	.quote {
		margin-top: 14px;
		font-size: clamp(26px, 3.4vw, 48px);
		line-height: 1.05;
		letter-spacing: -0.035em;
		font-weight: 600;
		text-wrap: balance;
	}
	ol {
		list-style: none;
		margin: 6px 0 0;
		padding: 0;
	}
	ol li {
		display: grid;
		grid-template-columns: 44px 1fr;
		padding: 16px 0;
		border-bottom: 1px solid var(--line);
		font-size: 18px;
		line-height: 1.35;
	}
	ol span {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--muted);
		padding-top: 4px;
	}
	.tech {
		margin-top: clamp(48px, 7vw, 96px);
	}
	.tech ul {
		list-style: none;
		margin: 14px 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
		gap: 22px 32px;
	}
	.tech li {
		display: grid;
		gap: 4px;
		padding-top: 14px;
		border-top: 1px solid var(--line);
	}
	.tech span {
		color: var(--muted);
		font-size: 14.5px;
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 16px;
		margin-top: clamp(40px, 6vw, 72px);
	}
	.commit {
		font-size: 12.5px;
		color: var(--muted);
		flex: 1 1 320px;
	}
	.pager {
		border-bottom: 1px solid var(--line);
	}
	.pager .wrap {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	.pager a {
		display: grid;
		gap: 10px;
		padding: clamp(32px, 6vw, 72px) 0;
		text-decoration: none;
	}
	.pager .next {
		text-align: right;
		border-left: 1px solid var(--line);
	}
	.pager .label {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.pager .next .label {
		justify-content: flex-end;
	}
	.pager b {
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(30px, 5vw, 72px);
		line-height: 1;
		transition: color 0.3s;
	}
	.pager a:hover b {
		color: var(--accent);
	}
	@media (max-width: 820px) {
		.story {
			grid-template-columns: 1fr;
		}
	}
</style>
