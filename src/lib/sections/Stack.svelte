<script lang="ts">
	import { onMount } from 'svelte';
	import { technologies } from '#lib/data/technologies.ts';
	import { projects } from '#lib/data/projects.ts';
	import { loadAngularWidgets } from '#lib/utils/angular.ts';
	import { rise, words } from '#lib/animations/scroll.ts';

	const categories = [...new Set(technologies.map((t) => t.category))];
	const data = { technologies, projects: projects.map(({ id, title, technologies }) => ({ id, title, technologies })) };
	const USE: Record<string, string> = { Production: 'Built new at work', Maintenance: 'Maintained at work', Independent: 'Independent projects' };
	const usedIn = (name: string) => projects.filter((p) => p.technologies.includes(name));

	let host = $state<HTMLElement>();
	let widget = $state<HTMLElement & { data?: typeof data }>();
	let status = $state<'idle' | 'loading' | 'ready' | 'failed'>('idle');

	// Fetch the Angular bundle only when the section is about to scroll into view.
	onMount(() => {
		const io = new IntersectionObserver(
			([e]) => {
				if (!e.isIntersecting) return;
				io.disconnect();
				status = 'loading';
				loadAngularWidgets('tech-constellation')
					.then(() => {
						if (widget) widget.data = data;
						status = 'ready';
					})
					.catch(() => (status = 'failed'));
			},
			{ rootMargin: '600px' }
		);
		if (host) io.observe(host);
		return () => io.disconnect();
	});
</script>

<section id="stack" class="dark" bind:this={host}>
	<div class="wrap">
		<div class="eyebrow"><span>Technical expertise</span><span>(05)</span></div>
		<div class="head">
			<h2 use:words>A constellation, not a <em class="serif">skills bar</em></h2>
			<p class="lede" use:rise>
				{technologies.length} technologies in {categories.length} groups. A line joins two that worked together in a real project. Each one is
				marked by how I’ve used it: building new systems at work, maintaining existing ones, or in independent projects, so nothing here
				claims more than it should.
			</p>
		</div>

		<div class="sky" use:rise>
			{#if status !== 'failed'}
				<tech-constellation bind:this={widget} class:ready={status === 'ready'}></tech-constellation>
			{/if}
			{#if status === 'loading' || status === 'idle'}<p class="label status">Loading the constellation…</p>{/if}
			<p class="label built">Built with Angular 22 · embedded as a custom element</p>
		</div>

		<!-- The same information as plain text: for screen readers, small screens, and when scripts are off. -->
		<details open={status === 'failed'}>
			<summary>View as a list</summary>
			<div class="list">
				{#each categories as c}
					<div>
						<h3>{c}</h3>
						<ul>
							{#each technologies.filter((t) => t.category === c) as t}
								<li>
									<b>{t.name}</b>
									<span>{t.description}</span>
									<small>{t.use.map((u) => USE[u]).join(' · ')} · Used in: {usedIn(t.name).map((p) => p.title).join(', ')}</small>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</details>
	</div>
</section>

<style>
	.head {
		display: grid;
		grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
		gap: 32px;
		align-items: end;
	}
	.head .lede {
		margin: 0 0 8px;
	}
	.sky {
		margin-top: clamp(40px, 6vw, 72px);
		min-height: 320px;
	}
	tech-constellation {
		display: block;
		opacity: 0;
		transition: opacity 0.8s var(--ease);
	}
	tech-constellation.ready {
		opacity: 1;
	}
	.status {
		padding: 120px 0;
		text-align: center;
	}
	.built {
		margin-top: 18px;
		color: var(--accent);
	}
	details {
		margin-top: 28px;
		border-top: 1px solid var(--line);
	}
	summary {
		cursor: pointer;
		padding: 16px 0;
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
		gap: 32px;
		padding: 12px 0 8px;
	}
	.list h3 {
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 10px;
	}
	.list ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 14px;
	}
	.list li {
		display: grid;
		gap: 2px;
		font-size: 14.5px;
	}
	.list span,
	.list small {
		color: var(--muted);
	}
	@media (max-width: 820px) {
		.head {
			grid-template-columns: 1fr;
		}
	}
</style>
