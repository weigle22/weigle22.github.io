<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fade, scale } from 'svelte/transition';
	import Search from '@lucide/svelte/icons/search';
	import ProjectCard from '#lib/components/ProjectCard.svelte';
	import { portfolio } from '#lib/services/github.ts';
	import { rise, words } from '#lib/animations/scroll.ts';
	import { reduced } from '#lib/utils/motion.ts';
	import { pad2 } from '#lib/utils/format.ts';

	const categories = ['All', ...new Set(portfolio.map((p) => p.category))];
	const contexts = [...new Set(portfolio.map((p) => p.context))];
	const techs = [...new Set(portfolio.flatMap((p) => p.technologies))].sort((a, b) => a.localeCompare(b));

	let category = $state('All');
	let tech = $state('');
	let context = $state('');
	let query = $state('');

	const shown = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return portfolio.filter(
			(p) =>
				(category === 'All' || p.category === category) &&
				(!tech || p.technologies.includes(tech)) &&
				(!context || p.context === context) &&
				(!q || [p.title, p.description, p.category, p.context, p.surface, ...p.technologies, ...p.highlights].join(' ').toLowerCase().includes(q))
		);
	});
	const filtered = $derived(category !== 'All' || !!tech || !!context || !!query.trim());
	const ms = (n: number) => (reduced() ? 0 : n);

	function reset() {
		category = 'All';
		tech = '';
		context = '';
		query = '';
	}
</script>

<section id="work" class="light">
	<div class="wrap">
		<div class="eyebrow"><span>Selected works</span><span>({pad2(portfolio.length)})</span></div>
		<h2 use:words>Work with a surface and an <em class="serif">underneath</em></h2>
	</div>

	<div class="marquee" aria-hidden="true">
		<div>
			{#each [0, 1] as _}{#each portfolio as p}<span>{p.title}</span>{/each}{/each}
		</div>
	</div>

	<div class="wrap">
		<div class="explorer" use:rise>
			<div class="chips" role="group" aria-label="Filter by category">
				{#each categories as c}
					<button class:on={category === c} aria-pressed={category === c} onclick={() => (category = c)}>{c}</button>
				{/each}
			</div>
			<div class="tools">
				<label class="select">
					<span class="sr">Filter by technology</span>
					<select bind:value={tech}>
						<option value="">Any technology</option>
						{#each techs as t}<option>{t}</option>{/each}
					</select>
				</label>
				<label class="select">
					<span class="sr">Filter by context</span>
					<select bind:value={context}>
						<option value="">Any context</option>
						{#each contexts as c}<option>{c}</option>{/each}
					</select>
				</label>
				<label class="search">
					<Search size={16} />
					<span class="sr">Search projects</span>
					<input type="search" placeholder="Search projects" bind:value={query} />
				</label>
			</div>
		</div>
		<p class="count" aria-live="polite">
			Showing {shown.length} of {portfolio.length}
			{#if filtered}<button class="u" onclick={reset}>Clear filters</button>{/if}
		</p>

		<div class="grid">
			{#each shown as p, i (p.id)}
				<div animate:flip={{ duration: ms(550) }} in:scale={{ start: 0.96, duration: ms(400) }} out:fade={{ duration: ms(200) }}>
					<ProjectCard project={p} index={portfolio.indexOf(p)} />
				</div>
			{:else}
				<p class="empty">Nothing matches that. <button class="u" onclick={reset}>Show everything</button></p>
			{/each}
		</div>
	</div>
</section>

<style>
	h2 {
		max-width: 14ch;
	}
	.marquee {
		overflow: hidden;
		margin: clamp(36px, 5vw, 64px) 0;
		border-block: 1px solid var(--line);
		padding: 12px 0;
	}
	.marquee div {
		display: flex;
		gap: 48px;
		width: max-content;
		animation: slide 36s linear infinite;
	}
	.marquee span {
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		white-space: nowrap;
	}
	.marquee span::after {
		content: '✳';
		margin-left: 48px;
		color: var(--accent);
	}
	@keyframes slide {
		to {
			transform: translateX(-50%);
		}
	}
	.explorer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 14px 24px;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.chips button {
		padding: 9px 16px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: transparent;
		font-size: 14px;
		cursor: pointer;
		transition: background 0.3s var(--ease), color 0.3s var(--ease), border-color 0.3s;
	}
	.chips button:hover {
		border-color: var(--ink);
	}
	.chips button.on {
		background: var(--ink);
		color: var(--surface);
		border-color: var(--ink);
	}
	.tools {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	select,
	.search {
		height: 40px;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--paper);
		font: inherit;
		font-size: 14px;
		color: inherit;
	}
	select {
		padding: 0 14px;
	}
	.search {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 0 14px;
		color: var(--muted);
	}
	.search:focus-within {
		border-color: var(--ink);
	}
	input {
		border: 0;
		background: none;
		font: inherit;
		color: var(--ink);
		width: 170px;
		outline: none;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}
	.count {
		margin: 18px 0 clamp(28px, 4vw, 44px);
		font-size: 13px;
		color: var(--muted);
		display: flex;
		gap: 14px;
	}
	.count button,
	.empty button {
		border: 0;
		padding: 0 0 2px;
		cursor: pointer;
		color: var(--ink);
		font: inherit;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(56px, 6vw, 88px) clamp(20px, 2.4vw, 32px);
	}
	.empty {
		grid-column: 1 / -1;
		padding: 60px 0;
		font-size: 20px;
		color: var(--muted);
	}
	@media (max-width: 820px) {
		.grid {
			grid-template-columns: 1fr;
		}
		.tools,
		.select,
		select,
		.search {
			width: 100%;
		}
		input {
			width: 100%;
		}
	}
</style>
