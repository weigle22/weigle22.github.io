<script lang="ts">
	import Stroop from '#lib/components/Stroop.svelte';
	import SignDemo from '#lib/components/SignDemo.svelte';
	import SqlDemo from '#lib/components/SqlDemo.svelte';
	import { loadAngularWidgets } from '#lib/utils/angular.ts';
	import { rise, words } from '#lib/animations/scroll.ts';

	const tabs = [
		{ id: 'stroop', label: 'Play Stroop', built: 'Svelte 5', blurb: 'A 20-second homage to the Android game I wrote in 2016.' },
		{ id: 'sign', label: 'Sign & tamper', built: 'Web Crypto', blurb: 'What a digital signature actually promises, in three clicks.' },
		{ id: 'leave', label: 'Approve a leave', built: 'Angular 22', blurb: 'Walk one leave request through all five desks, or send it back. Every status change is logged.' },
		{ id: 'sql', label: 'Query the data', built: 'Svelte 5 · mock data', blurb: 'Filter, sort, join and group mock HR records. The SQL writes itself as you click.' }
	];
	let active = $state('stroop');
	const tab = $derived(tabs.find((t) => t.id === active)!);

	let angular = $state<'idle' | 'loading' | 'ready' | 'failed'>('idle');
	$effect(() => {
		if (active !== 'leave' || angular !== 'idle') return;
		angular = 'loading';
		loadAngularWidgets('leave-demo')
			.then(() => (angular = 'ready'))
			.catch(() => (angular = 'failed'));
	});

	function onKey(e: KeyboardEvent & { currentTarget: HTMLElement }) {
		const i = tabs.findIndex((t) => t.id === active);
		const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
		if (!d) return;
		active = tabs[(i + d + tabs.length) % tabs.length].id;
		e.currentTarget.querySelector<HTMLElement>(`[data-id="${active}"]`)?.focus();
	}
</script>

<section id="playground" class="light">
	<div class="wrap grid">
		<div>
			<div class="eyebrow"><span>Playground</span><span>(06)</span></div>
			<h2 use:words>Don’t read it. <em class="serif">Use it.</em></h2>
			<p class="lede" use:rise>Four small working things, all running in your browser with sample data. One is a real Angular component dropped into this Svelte page.</p>
		</div>

		<div class="bench" use:rise>
			<div class="tabs" role="tablist" aria-label="Demos" onkeydown={onKey} tabindex="-1">
				{#each tabs as t}
					<button role="tab" data-id={t.id} aria-selected={t.id === active} tabindex={t.id === active ? 0 : -1} class:on={t.id === active} onclick={() => (active = t.id)}>
						{t.label}
					</button>
				{/each}
			</div>

			<div class="panel" role="tabpanel">
				<div class="meta">
					<p>{tab.blurb}</p>
					<span class="label built">{tab.built}</span>
				</div>

				{#if active === 'stroop'}
					<Stroop />
				{:else if active === 'sign'}
					<SignDemo />
				{:else if active === 'sql'}
					<SqlDemo />
				{:else}
					{#if angular === 'failed'}
						<p class="label">The Angular demo didn’t load.</p>
					{:else if angular !== 'ready'}
						<p class="label">Loading Angular…</p>
					{/if}
					<leave-demo></leave-demo>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
		gap: clamp(32px, 5vw, 80px);
		align-items: start;
	}
	h2 {
		font-size: clamp(40px, 5.6vw, 84px);
	}
	.tabs {
		display: flex;
		gap: 6px;
		overflow-x: auto;
	}
	.tabs button {
		flex: none;
		padding: 10px 16px;
		border-radius: 12px 12px 0 0;
		border: 1px solid transparent;
		border-bottom: 0;
		background: transparent;
		color: var(--muted);
		font-size: 15px;
		cursor: pointer;
	}
	.tabs button.on {
		background: var(--paper);
		border-color: var(--line);
		color: var(--ink);
		font-weight: 550;
	}
	.panel {
		min-width: 0;
		margin-top: -1px;
		padding: clamp(18px, 3vw, 28px);
		border: 1px solid var(--line);
		border-radius: 0 var(--radius) var(--radius) var(--radius);
		background: var(--paper);
		min-height: 430px;
		--surface: #f3f2ee;
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: baseline;
		gap: 8px 16px;
		margin-bottom: 20px;
		font-size: 15px;
	}
	.built {
		color: var(--accent);
		padding: 3px 8px;
		border: 1px solid currentColor;
		border-radius: 6px;
		white-space: nowrap;
	}
	@media (max-width: 900px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 480px) {
		.tabs button {
			padding: 9px 10px;
			font-size: 13.5px;
		}
	}
</style>
