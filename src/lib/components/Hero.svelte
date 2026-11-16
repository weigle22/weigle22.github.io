<script>
	import { onMount } from 'svelte';

	let { onTour } = $props();

	// The dashed "inspector" box measures the real headline, like dev tools would.
	let target = $state();
	let size = $state('');

	onMount(() => {
		const measure = () => {
			if (!target) return;
			const r = target.getBoundingClientRect();
			size = `${Math.round(r.width)} × ${Math.round(r.height)}`;
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(target);
		return () => ro.disconnect();
	});
</script>

<section id="top" class="hero">
	<div class="wrap">
		<p class="tag">&lt;Hero /&gt; · svelte</p>
		<h1>
			<span class="who">Emmanuel Otacan</span>
			builds the part of software
			<span class="inspect" bind:this={target}>
				you <em class="serif">never see.</em>
				{#if size}<span class="dims" aria-hidden="true">{size}</span>{/if}
			</span>
		</h1>
		<p class="lede">
			Screens get the attention. I spend mine on what decides them: the rules, the data and the
			hand-offs. .NET and SQL Server underneath, Angular on top, with side quests in post-quantum
			signatures and local AI.
		</p>
		<div class="cta">
			<button class="pill solid" onclick={onTour}>
				<span class="play" aria-hidden="true"></span> Take the tour
			</button>
			<a class="link" href="#work">or go straight to the work →</a>
		</div>
	</div>
</section>

<style>
	.hero {
		padding-top: clamp(56px, 9vw, 110px);
		padding-bottom: clamp(32px, 5vw, 56px);
		background:
			radial-gradient(60% 50% at 85% 0%, color-mix(in srgb, var(--accent) 9%, transparent), transparent 70%),
			linear-gradient(color-mix(in srgb, var(--line) 45%, transparent) 1px, transparent 1px) 0 0 / 100% 48px;
		background-blend-mode: normal;
		border-bottom: 1px solid var(--line);
	}
	h1 {
		font-size: clamp(40px, 8.2vw, 92px);
		line-height: 1;
		letter-spacing: -0.045em;
		font-weight: 600;
		max-width: 13ch;
	}
	.who {
		display: block;
		font-size: 0.34em;
		letter-spacing: -0.02em;
		font-weight: 500;
		color: var(--muted);
		margin-bottom: 0.5em;
	}
	.inspect {
		position: relative;
		display: inline-block;
		white-space: nowrap;
		outline: 1.5px dashed var(--inspect);
		outline-offset: 6px;
		border-radius: 2px;
	}
	.inspect em {
		background: linear-gradient(transparent 62%, color-mix(in srgb, var(--accent) 35%, transparent) 62%);
		padding: 0 0.06em;
	}
	.dims {
		position: absolute;
		left: -6px;
		top: calc(100% + 12px);
		font-family: var(--mono);
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0;
		line-height: 1;
		padding: 4px 6px;
		border-radius: 4px;
		background: var(--inspect);
		color: var(--surface);
	}
	.lede {
		margin-top: clamp(40px, 6vw, 56px);
		max-width: 52ch;
	}
	.cta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 18px 22px;
		margin-top: 30px;
	}
	.play {
		width: 0;
		height: 0;
		border-left: 9px solid currentColor;
		border-top: 6px solid transparent;
		border-bottom: 6px solid transparent;
	}
	.link {
		color: var(--accent);
		text-decoration: none;
		font-weight: 500;
	}
	.link:hover {
		text-decoration: underline;
	}
</style>
