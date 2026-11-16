<script>
	import { asset } from '$app/paths';
	import { reveal } from '#lib/motion.svelte.js';
	import Stroop from './Stroop.svelte';
	import SignDemo from './SignDemo.svelte';

	const tabs = [
		{ id: 'stroop', label: 'Play Stroop', built: 'svelte 5', blurb: 'A 20-second homage to the Android game I wrote in 2016.' },
		{ id: 'sign', label: 'Sign & tamper', built: 'web crypto', blurb: 'What a digital signature actually promises, in three clicks.' },
		{ id: 'leave', label: 'Approve a leave', built: 'angular 22', blurb: 'Walk one leave request through every desk it has to cross.' }
	];
	let active = $state('stroop');
	const tab = $derived(tabs.find((t) => t.id === active));

	// The Angular bundle is only fetched when someone opens its tab.
	let angular = $state('idle'); // idle | loading | ready | failed
	$effect(() => {
		if (active !== 'leave' || angular !== 'idle') return;
		angular = 'loading';
		const s = document.createElement('script');
		s.type = 'module';
		s.src = asset('/angular/leave-demo.js');
		s.onerror = () => (angular = 'failed');
		document.head.append(s);
		customElements.whenDefined('leave-demo').then(() => (angular = 'ready'));
	});

	function onKey(e) {
		const i = tabs.findIndex((t) => t.id === active);
		const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
		if (!d) return;
		active = tabs[(i + d + tabs.length) % tabs.length].id;
		e.currentTarget.querySelector(`[data-id="${active}"]`)?.focus();
	}
</script>

<section id="demos">
	<div class="wrap">
		<div use:reveal>
			<p class="tag">demos · try them</p>
			<h2>Don’t read it. <em class="serif">Use it.</em></h2>
			<p class="lede">
				Three small working things. Two are Svelte. The third is a real Angular component, dropped
				into this page as a custom element.
			</p>
		</div>

		<div class="bench" use:reveal>
			<div class="tabs" role="tablist" aria-label="Demos" onkeydown={onKey} tabindex="-1">
				{#each tabs as t}
					<button
						role="tab"
						data-id={t.id}
						aria-selected={t.id === active}
						tabindex={t.id === active ? 0 : -1}
						class:on={t.id === active}
						onclick={() => (active = t.id)}
					>
						{t.label}
					</button>
				{/each}
			</div>

			<div class="panel" role="tabpanel">
				<div class="meta">
					<p>{tab.blurb}</p>
					<span class="mono built">built with {tab.built}</span>
				</div>

				{#if active === 'stroop'}
					<Stroop />
				{:else if active === 'sign'}
					<SignDemo />
				{:else}
					{#if angular === 'failed'}
						<p class="status">The Angular demo didn’t load. Run <code>npm run build:angular</code> and rebuild.</p>
					{:else if angular !== 'ready'}
						<p class="status mono">loading angular…</p>
					{/if}
					<leave-demo></leave-demo>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	section {
		background: color-mix(in srgb, var(--paper) 55%, var(--surface));
		border-block: 1px solid var(--line);
	}
	.bench {
		margin-top: 44px;
		max-width: 760px;
	}
	.tabs {
		display: flex;
		gap: 6px;
		overflow-x: auto;
		padding-bottom: 2px;
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
		background: var(--surface);
		border-color: var(--line);
		color: var(--ink);
		font-weight: 550;
	}
	.panel {
		margin-top: -1px;
		padding: clamp(18px, 3vw, 28px);
		border: 1px solid var(--line);
		border-radius: 0 var(--radius) var(--radius) var(--radius);
		background: var(--surface);
		min-height: 420px;
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
		font-size: 11px;
		color: var(--inspect);
		padding: 3px 8px;
		border: 1px solid currentColor;
		border-radius: 6px;
		white-space: nowrap;
	}
	.status {
		font-size: 13px;
		color: var(--muted);
	}
	code {
		font-family: var(--mono);
		font-size: 0.9em;
	}
	@media (max-width: 480px) {
		.tabs button {
			padding: 9px 10px;
			font-size: 13.5px;
		}
	}
</style>
