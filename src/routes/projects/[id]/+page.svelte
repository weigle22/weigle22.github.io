<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Lock from '@lucide/svelte/icons/lock';
	import Star from '@lucide/svelte/icons/star';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Plate from '#lib/components/Plate.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import ArchitectureDiagram from '#lib/components/ArchitectureDiagram.svelte';
	import { site } from '#lib/data/site.ts';
	import { technologies } from '#lib/data/technologies.ts';
	import { rise, stagger } from '#lib/animations/scroll.ts';
	import { dayMonthYear, pad2 } from '#lib/utils/format.ts';

	let { data } = $props();
	const p = $derived(data.project);
	const cs = $derived(p.caseStudy ?? {});
	const tech = $derived(
		p.technologies.map((name) => technologies.find((t) => t.name === name) ?? { name, category: '', description: '', use: [] })
	);

	// Only sections with content are shown, numbered in the order they appear.
	const sections = $derived(
		[
			{ id: 'overview', title: 'Overview', show: !!cs.overview },
			{ id: 'problem', title: 'The problem', show: !!cs.problem },
			{ id: 'role', title: 'My role', show: !!cs.role },
			{ id: 'architecture', title: 'Architecture', show: !!cs.architecture },
			{ id: 'stack', title: 'Technology', show: true },
			{ id: 'build', title: 'What was built', show: p.highlights.length > 0 },
			{ id: 'decisions', title: 'Engineering decisions', show: !!cs.decisions?.length },
			{ id: 'challenges', title: 'Challenges and solutions', show: !!cs.challenges?.length },
			{ id: 'before-after', title: 'Before and after', show: !!cs.beforeAfter?.length },
			{ id: 'testing', title: 'Testing and validation', show: !!cs.testing?.length },
			{ id: 'results', title: 'Results', show: !!cs.results?.length },
			{ id: 'lessons', title: 'Lessons learned', show: !!cs.lessons?.length }
		]
			.filter((s) => s.show)
			.map((s, i) => ({ ...s, n: pad2(i + 1) }))
	);
	const num = (id: string) => sections.find((s) => s.id === id)?.n ?? '';

	const crumbs = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
			{ '@type': 'ListItem', position: 2, name: 'Work', item: `${site.url}/#work` },
			{ '@type': 'ListItem', position: 3, name: p.title, item: `${site.url}/projects/${p.id}/` }
		]
	});
</script>

<svelte:head>
	<title>{p.title} · Case study · {site.name}</title>
	<meta name="description" content={p.description} />
	<link rel="canonical" href="{site.url}/projects/{p.id}/" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content="{p.title} · {site.name}" />
	<meta property="og:description" content={p.description} />
	<meta property="og:url" content="{site.url}/projects/{p.id}/" />
	<meta property="og:image" content="{site.url}/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
	{@html `<script type="application/ld+json">${JSON.stringify(crumbs)}</` + `script>`}
</svelte:head>

{#key p.id}
	<main>
		<header class="dark top">
			<div class="wrap">
				<nav class="crumbs" aria-label="Breadcrumb">
					<ol>
						<li><a class="u" href="/">Home</a></li>
						<li aria-hidden="true"><ChevronRight size={13} /></li>
						<li><a class="u" href="/#project-{p.id}">Work</a></li>
						<li aria-hidden="true"><ChevronRight size={13} /></li>
						<li aria-current="page">{p.title}</li>
					</ol>
				</nav>
				<div class="eyebrow"><span>Case study ({pad2(data.index + 1)})</span><span>{p.category}{p.year ? ` · ©${p.year}` : ''}</span></div>
				<h1>{p.title}</h1>
				<p class="desc">{p.description}</p>
				<ul class="tags">
					<li class="ctx">{p.context}</li>
					<li>{p.repository ? 'Public repository' : 'Private work'}</li>
				</ul>
			</div>
		</header>

		<div class="light body">
			<div class="wrap">
				<div class="plate">
					{#if p.image}<img src={p.image} alt="{p.title} preview" />{:else}<Plate id={p.id} title={p.title} />{/if}
				</div>

				<dl class="facts">
					<div><dt>Context</dt><dd>{p.context}</dd></div>
					<div><dt>Category</dt><dd>{p.category}</dd></div>
					{#if p.github}
						<div><dt>Primary language</dt><dd>{p.github.language ?? '—'}</dd></div>
						<div><dt>Stars</dt><dd class="inline"><Star size={13} /> {p.github.stars}</dd></div>
						<div><dt>Last updated</dt><dd>{dayMonthYear(p.github.updatedAt)}</dd></div>
					{:else if p.repository}
						<div><dt>Repository</dt><dd>GitHub data unavailable</dd></div>
					{:else}
						<div><dt>Repository</dt><dd class="inline"><Lock size={13} /> Private</dd></div>
					{/if}
				</dl>

				<p class="surface" use:rise>“{p.surface}”</p>

				<nav class="toc" aria-label="On this page">
					{#each sections as s}<a href="#{s.id}"><span>{s.n}</span>{s.title}</a>{/each}
				</nav>

				{#if cs.overview}
					<section class="block" id="overview" use:rise>
						<h2><span>{num('overview')}</span>Overview</h2>
						<div><p class="lead">{cs.overview}</p></div>
					</section>
				{/if}

				{#if cs.problem}
					<section class="block" id="problem" use:rise>
						<h2><span>{num('problem')}</span>The problem</h2>
						<div><p class="lead">{cs.problem}</p></div>
					</section>
				{/if}

				{#if cs.role}
					<section class="block" id="role" use:rise>
						<h2><span>{num('role')}</span>My role</h2>
						<div>
							<p class="lead">{cs.role}</p>
						</div>
					</section>
				{/if}

				{#if cs.architecture}
					<section class="block wide" id="architecture">
						<h2><span>{num('architecture')}</span>Architecture</h2>
						<div use:rise>
							<ArchitectureDiagram nodes={cs.architecture.nodes} edges={cs.architecture.edges} caption={cs.architecture.caption} />
						</div>
					</section>
				{/if}

				<section class="block" id="stack">
					<h2><span>{num('stack')}</span>Technology</h2>
					<ul class="tech" use:stagger>
						{#each tech as t}
							<li><b>{t.name}</b>{#if t.description}<span>{t.description}</span>{/if}</li>
						{/each}
					</ul>
				</section>

				{#if p.highlights.length}
					<section class="block" id="build">
						<h2><span>{num('build')}</span>What was built</h2>
						<ol class="numbered" use:stagger>
							{#each p.highlights as h, i}<li><span>{pad2(i + 1)}</span>{h}</li>{/each}
						</ol>
					</section>
				{/if}

				{#if cs.decisions?.length}
					<section class="block" id="decisions">
						<h2><span>{num('decisions')}</span>Engineering decisions</h2>
						<div class="cards" use:stagger>
							{#each cs.decisions as d}
								<article><h3>{d.title}</h3><p>{d.text}</p></article>
							{/each}
						</div>
					</section>
				{/if}

				{#if cs.challenges?.length}
					<section class="block" id="challenges">
						<h2><span>{num('challenges')}</span>Challenges and solutions</h2>
						<div class="pairs" use:stagger>
							{#each cs.challenges as c}
								<div class="pair">
									<p><span class="label">Challenge</span>{c.challenge}</p>
									<p><span class="label">Solution</span>{c.solution}</p>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if cs.beforeAfter?.length}
					<section class="block" id="before-after">
						<h2><span>{num('before-after')}</span>Before and after</h2>
						<div class="ba" role="table" aria-label="Before and after the modernisation">
							<div class="ba-row head" role="row">
								<span role="columnheader">Aspect</span><span role="columnheader">Before</span><span role="columnheader">After</span>
							</div>
							{#each cs.beforeAfter as r}
								<div class="ba-row" role="row" use:rise>
									<span role="rowheader">{r.aspect}</span><span role="cell" class="before">{r.before}</span><span role="cell" class="after">{r.after}</span>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if cs.testing?.length}
					<section class="block" id="testing">
						<h2><span>{num('testing')}</span>Testing and validation</h2>
						<ul class="checks" use:stagger>{#each cs.testing as t}<li>{t}</li>{/each}</ul>
					</section>
				{/if}

				{#if cs.results?.length}
					<section class="block" id="results">
						<h2><span>{num('results')}</span>Results</h2>
						<ul class="checks" use:stagger>{#each cs.results as t}<li>{t}</li>{/each}</ul>
					</section>
				{/if}

				{#if cs.lessons?.length}
					<section class="block" id="lessons">
						<h2><span>{num('lessons')}</span>Lessons learned</h2>
						<ul class="checks" use:stagger>{#each cs.lessons as t}<li>{t}</li>{/each}</ul>
					</section>
				{/if}

				<div class="links">
					{#if p.github}
						<a class="pill solid" href={p.github.url} rel="noopener">View the code <ArrowUpRight size={16} /></a>
					{/if}
					{#if p.liveUrl}<a class="pill" href={p.liveUrl} rel="noopener">Live site <ArrowUpRight size={16} /></a>{/if}
					{#if p.github?.latestCommit}
						<p class="commit mono">Latest commit {p.github.latestCommit.sha} · {dayMonthYear(p.github.latestCommit.date)} · “{p.github.latestCommit.message}”</p>
					{:else if !p.repository}
						<p class="commit">Private work: described generically, with no code link, screenshots or real data.</p>
					{/if}
				</div>

				{#if data.related.length}
					<section class="related" aria-labelledby="related-h">
						<p class="label" id="related-h">Related projects</p>
						<div class="rel">
							{#each data.related as r}
								<a href="/projects/{r.id}/" data-cursor="View">
									<span class="thumb" aria-hidden="true"><Plate id={r.id} title={r.title} /></span>
									<b>{r.title}</b>
									<span class="why">{r.why}</span>
								</a>
							{/each}
						</div>
					</section>
				{/if}
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
		padding: 108px 0 clamp(40px, 6vw, 72px);
	}
	.crumbs ol {
		list-style: none;
		margin: 0 0 36px;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
	.crumbs li {
		display: inline-flex;
		color: var(--muted);
	}
	.crumbs [aria-current] {
		color: var(--ink);
	}
	h1 {
		font-family: var(--serif);
		font-weight: 780;
		font-size: clamp(52px, 11vw, 184px);
		line-height: 0.98;
		letter-spacing: -0.02em;
		overflow-wrap: anywhere;
	}
	.desc {
		margin-top: clamp(28px, 3vw, 44px);
		font-size: clamp(20px, 2.4vw, 32px);
		line-height: 1.2;
		letter-spacing: -0.02em;
		max-width: 30ch;
		text-wrap: balance;
	}
	.tags {
		list-style: none;
		margin: 24px 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.tags li {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 5px 10px;
		border-radius: 999px;
		border: 1px solid var(--line);
	}
	.tags .ctx {
		border-color: var(--accent);
		color: var(--accent);
	}
	.body {
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
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
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
	.surface {
		margin: clamp(48px, 7vw, 96px) 0 0;
		font-size: clamp(28px, 4vw, 56px);
		line-height: 1.04;
		letter-spacing: -0.04em;
		font-weight: 600;
		max-width: 24ch;
		text-wrap: balance;
	}
	.toc {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: clamp(32px, 4vw, 48px) 0 clamp(16px, 3vw, 32px);
	}
	.toc a {
		display: inline-flex;
		gap: 8px;
		align-items: baseline;
		padding: 7px 12px;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-size: 13.5px;
		text-decoration: none;
		transition: border-color 0.2s, color 0.2s;
	}
	.toc a:hover {
		border-color: var(--ink);
	}
	.toc span {
		font-family: var(--mono);
		font-size: 11px;
		color: var(--accent);
	}
	/* Each block: number and title on the left, content on the right. */
	.block {
		display: grid;
		grid-template-columns: minmax(0, 0.32fr) minmax(0, 1fr);
		gap: clamp(20px, 4vw, 64px);
		padding: clamp(36px, 5vw, 64px) 0;
		border-top: 1px solid var(--line);
		scroll-margin-top: 72px;
	}
	.block.wide {
		grid-template-columns: 1fr;
	}
	.block h2 {
		display: flex;
		flex-direction: column;
		gap: 10px;
		font-size: clamp(24px, 2.6vw, 36px);
		letter-spacing: -0.035em;
		line-height: 1.05;
	}
	.block h2 span {
		font-family: var(--mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0;
		color: var(--accent);
	}
	.lead {
		font-size: clamp(18px, 1.6vw, 22px);
		line-height: 1.5;
		max-width: 62ch;
		text-wrap: pretty;
	}
	.tech {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr));
		gap: 20px 28px;
	}
	.tech li {
		display: grid;
		gap: 4px;
		padding-top: 12px;
		border-top: 1px solid var(--line);
	}
	.tech span {
		color: var(--muted);
		font-size: 14.5px;
	}
	.numbered {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.numbered li {
		display: grid;
		grid-template-columns: 44px 1fr;
		padding: 14px 0;
		border-bottom: 1px solid var(--line);
		font-size: 18px;
		line-height: 1.4;
	}
	.numbered span {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--muted);
		padding-top: 4px;
	}
	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
		gap: 16px;
	}
	.cards article {
		padding: 20px;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--paper);
	}
	.cards h3 {
		font-size: 19px;
		letter-spacing: -0.02em;
		line-height: 1.2;
	}
	.cards p {
		margin-top: 8px;
		color: var(--muted);
		font-size: 15px;
		line-height: 1.5;
	}
	.pairs {
		display: grid;
		gap: 14px;
	}
	.pair {
		display: grid;
		grid-template-columns: 1fr 1fr;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		overflow: hidden;
	}
	.pair p {
		padding: 18px 20px;
		font-size: 16px;
		line-height: 1.45;
		display: grid;
		gap: 6px;
	}
	.pair p + p {
		background: var(--accent-soft);
		border-left: 1px solid var(--line);
	}
	.ba {
		display: grid;
		border-top: 1px solid var(--ink);
	}
	.ba-row {
		display: grid;
		grid-template-columns: 0.8fr 1fr 1.4fr;
		gap: 16px;
		padding: 14px 0;
		border-bottom: 1px solid var(--line);
		font-size: 15.5px;
		line-height: 1.4;
	}
	.ba-row.head {
		font-size: 11px;
		font-family: var(--mono);
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.ba-row [role='rowheader'] {
		font-weight: 600;
	}
	.before {
		color: var(--muted);
		text-decoration: line-through;
		text-decoration-color: color-mix(in srgb, var(--muted) 50%, transparent);
	}
	.after {
		position: relative;
		padding-left: 22px;
	}
	.after::before {
		content: '→';
		position: absolute;
		left: 0;
		color: var(--accent);
	}
	.checks {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 12px;
	}
	.checks li {
		position: relative;
		padding-left: 28px;
		font-size: 17px;
		line-height: 1.5;
		max-width: 64ch;
	}
	.checks li::before {
		content: '✓';
		position: absolute;
		left: 0;
		top: 0;
		color: var(--ok);
		font-weight: 700;
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 16px;
		margin-top: clamp(24px, 4vw, 48px);
		padding-top: clamp(24px, 4vw, 48px);
		border-top: 1px solid var(--line);
	}
	.commit {
		font-size: 12.5px;
		color: var(--muted);
		flex: 1 1 320px;
	}
	.related {
		margin-top: clamp(56px, 8vw, 104px);
	}
	.rel {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 18px;
		margin-top: 16px;
	}
	.rel a {
		display: grid;
		gap: 8px;
		text-decoration: none;
	}
	.thumb {
		display: block;
		aspect-ratio: 8 / 5;
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid var(--line);
	}
	.thumb :global(svg) {
		transition: transform 0.8s var(--ease);
	}
	.rel a:hover .thumb :global(svg) {
		transform: scale(1.05);
	}
	.rel b {
		font-family: var(--serif);
		font-weight: 780;
		font-size: 28px;
		line-height: 1;
	}
	.why {
		font-size: 13px;
		color: var(--muted);
	}
	.pager {
		border-bottom: 1px solid var(--line);
	}
	.pager .wrap {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
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
		font-weight: 780;
		font-size: clamp(24px, 5vw, 72px);
		line-height: 1;
		overflow-wrap: anywhere;
		transition: color 0.3s;
	}
	.pager a:hover b {
		color: var(--accent);
	}
	@media (max-width: 820px) {
		.block {
			grid-template-columns: 1fr;
		}
		.block h2 {
			flex-direction: row;
			align-items: baseline;
			gap: 12px;
		}
		.pair,
		.rel {
			grid-template-columns: 1fr;
		}
		.pair p + p {
			border-left: 0;
			border-top: 1px solid var(--line);
		}
		.ba-row {
			grid-template-columns: 1fr 1fr;
		}
		.ba-row [role='rowheader'] {
			grid-column: 1 / -1;
		}
		.ba-row.head span:first-child {
			display: none;
		}
	}
</style>
