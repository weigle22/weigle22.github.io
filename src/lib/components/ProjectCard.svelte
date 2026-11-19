<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Star from '@lucide/svelte/icons/star';
	import Lock from '@lucide/svelte/icons/lock';
	import Plate from './Plate.svelte';
	import { unmask } from '#lib/animations/scroll.ts';
	import { monthYear, pad2 } from '#lib/utils/format.ts';
	import type { ProjectWithMeta } from '#lib/services/github.ts';

	let { project: p, index }: { project: ProjectWithMeta; index: number } = $props();
	let open = $state(false);
	const href = $derived(`/projects/${p.id}/`);
</script>

<article id="project-{p.id}">
	<div class="frame" use:unmask>
		<a class="art" {href} data-cursor="View" aria-label="{p.title}: read the case study" tabindex="-1">
			{#if p.image}
				<img src={p.image} alt="{p.title} preview" loading="lazy" decoding="async" />
			{:else}
				<Plate id={p.id} title={p.title} />
			{/if}
		</a>
		<div class="under dark" class:show={open} inert={!open} data-lenis-prevent>
			<p class="label">Underneath</p>
			<ul>
				{#each p.highlights as h}<li>{h}</li>{/each}
			</ul>
		</div>
	</div>

	<div class="title">
		<h3><a {href}>{p.title}</a></h3>
		<span>({pad2(index + 1)})</span>
	</div>
	<p class="desc">{p.description}</p>
	<p class="ctx" class:work={p.context === 'Professional'}>{p.context}{p.repository ? '' : ' · private'}</p>

	<dl>
		<div><dt>Category</dt><dd>{p.category}</dd></div>
		{#if p.github}
			<div><dt>Language</dt><dd>{p.github.language ?? '—'}</dd></div>
			<div><dt>Stars</dt><dd class="stars"><Star size={12} /> {p.github.stars}</dd></div>
			<div><dt>Updated</dt><dd>{monthYear(p.github.updatedAt)}</dd></div>
		{:else if p.repository}
			<div class="wide"><dt>Repository</dt><dd>GitHub data unavailable</dd></div>
		{:else}
			<div class="wide"><dt>Repository</dt><dd class="stars"><Lock size={12} /> Private work</dd></div>
		{/if}
	</dl>

	<ul class="tech">
		{#each p.technologies.slice(0, 5) as t}<li>{t}</li>{/each}
		{#if p.technologies.length > 5}<li>+{p.technologies.length - 5}</li>{/if}
	</ul>

	<div class="actions">
		<button onclick={() => (open = !open)} aria-expanded={open}>→ {open ? 'Back to the surface' : 'What’s underneath'}</button>
		<span class="links">
			<a class="u" {href}>Case study</a>
			{#if p.github}<a class="u" href={p.github.url} rel="noopener">Code <ArrowUpRight size={13} /></a>{/if}
			{#if p.liveUrl}<a class="u" href={p.liveUrl} rel="noopener">Live <ArrowUpRight size={13} /></a>{/if}
		</span>
	</div>
</article>

<style>
	.frame {
		position: relative;
		aspect-ratio: 8 / 5;
		border-radius: var(--radius);
		overflow: hidden;
		border: 1px solid var(--line);
	}
	.art {
		display: block;
		width: 100%;
		height: 100%;
		transition: transform 1.2s var(--ease);
	}
	.frame:hover .art {
		transform: scale(1.04);
	}
	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.under {
		position: absolute;
		inset: 0;
		padding: clamp(18px, 3vw, 32px);
		overflow: auto;
		background: color-mix(in srgb, #050506 90%, transparent);
		backdrop-filter: blur(10px);
		clip-path: inset(100% 0 0 0);
		transition: clip-path 0.6s cubic-bezier(0.7, 0, 0.2, 1);
	}
	.under.show {
		clip-path: inset(0);
	}
	.under ul {
		list-style: none;
		margin: 14px 0 0;
		padding: 0;
		display: grid;
		gap: 10px;
		font-size: clamp(13.5px, 1.2vw, 16px);
		line-height: 1.35;
		max-width: 54ch;
	}
	.under li {
		padding-left: 22px;
		position: relative;
	}
	.under li::before {
		content: '→';
		position: absolute;
		left: 0;
		color: var(--accent);
	}
	.title {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		margin-top: 18px;
	}
	h3 {
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(34px, 3.8vw, 54px);
		line-height: 1;
		letter-spacing: -0.015em;
	}
	h3 a {
		text-decoration: none;
	}
	.title span {
		font-size: 13px;
		font-weight: 500;
	}
	.desc {
		margin-top: 10px;
		color: var(--muted);
		font-size: 15px;
		max-width: 56ch;
		text-wrap: pretty;
	}
	.ctx {
		display: inline-block;
		margin-top: 12px;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 4px 9px;
		border-radius: 999px;
		border: 1px solid var(--line);
		color: var(--muted);
	}
	.ctx.work {
		border-color: var(--accent);
		color: var(--accent);
	}
	dl {
		display: grid;
		grid-template-columns: 1.4fr 1fr 0.7fr auto;
		gap: 16px;
		margin: 24px 0 0;
		font-size: 13px;
	}
	dt {
		color: var(--muted);
	}
	dd {
		margin: 2px 0 0;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}
	.stars {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}
	.wide {
		grid-column: 2 / -1;
	}
	dl div:last-child {
		text-align: right;
	}
	dl div:last-child .stars {
		justify-content: flex-end;
	}
	.tech {
		list-style: none;
		padding: 0;
		margin: 18px 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.tech li {
		font-family: var(--mono);
		font-size: 11px;
		padding: 4px 9px;
		border: 1px solid var(--line);
		border-radius: 999px;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 10px 16px;
		margin-top: 18px;
		padding-top: 14px;
		border-top: 1px solid var(--line);
		font-size: 13px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.actions button {
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
		font: inherit;
		text-transform: inherit;
		letter-spacing: inherit;
		text-align: left;
		transition: color 0.3s;
	}
	.actions button:hover {
		color: var(--accent);
	}
	.links {
		display: flex;
		gap: 18px;
	}
	.links a {
		display: inline-flex;
		align-items: center;
		gap: 3px;
	}
</style>
