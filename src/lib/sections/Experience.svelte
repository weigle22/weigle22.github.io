<script lang="ts">
	import { journey } from '#lib/data/site.ts';
	import { drawLine, rise, words } from '#lib/animations/scroll.ts';
</script>

<section id="experience" class="light">
	<div class="wrap">
		<div class="eyebrow"><span>Experience and journey</span><span>(03)</span></div>
		<h2 use:words>A game, a career, then <em class="serif">side quests</em></h2>

		<div class="timeline">
			<span class="track" aria-hidden="true"><i use:drawLine></i></span>
			<ol>
				{#each journey as m}
					<li use:rise>
						<span class="when" class:long={m.when.length > 5}>{m.when}</span>
						<span class="dot" aria-hidden="true"></span>
						<div>
							<span class="label">{m.kind}</span>
							<h3>{m.title}</h3>
							{#if m.note}<p>{m.note}</p>{/if}
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>

<style>
	h2 {
		max-width: 15ch;
	}
	.timeline {
		position: relative;
		margin-top: clamp(48px, 7vw, 96px);
	}
	.track {
		position: absolute;
		left: calc(22% + 5px);
		top: 0;
		bottom: 0;
		width: 1px;
		background: var(--line);
	}
	.track i {
		position: absolute;
		inset: 0;
		background: var(--ink);
	}
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	li {
		display: grid;
		grid-template-columns: 22% 11px 1fr;
		gap: 0 clamp(20px, 4vw, 56px);
		padding: clamp(24px, 3.4vw, 44px) 0;
		align-items: start;
	}
	.when {
		font-size: clamp(28px, 4.4vw, 64px);
		line-height: 1;
		font-weight: 600;
		letter-spacing: -0.05em;
		text-align: right;
	}
	.when.long {
		font-size: clamp(22px, 2.8vw, 40px);
		letter-spacing: -0.04em;
	}
	.dot {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: var(--surface);
		border: 2px solid var(--ink);
		margin-top: clamp(8px, 1.6vw, 24px);
		position: relative;
	}
	h3 {
		margin: 8px 0 8px;
		font-family: var(--serif);
		font-weight: 400;
		font-size: clamp(28px, 3.2vw, 44px);
		line-height: 1.02;
	}
	p {
		color: var(--muted);
		max-width: 52ch;
		font-size: 17px;
	}
	@media (max-width: 640px) {
		.track {
			left: 5px;
		}
		li {
			grid-template-columns: 11px 1fr;
			gap: 0 20px;
		}
		.when {
			grid-column: 2;
			text-align: left;
			margin-bottom: 8px;
		}
		.dot {
			grid-row: 1 / span 2;
			margin-top: 10px;
		}
		li > div {
			grid-column: 2;
		}
	}
</style>
