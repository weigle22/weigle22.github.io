<script>
	import { path } from '#lib/data/content.js';
	import { reveal } from '#lib/motion.svelte.js';
</script>

<section id="path">
	<div class="wrap">
		<div use:reveal>
			<p class="tag">path · {path.length} stops</p>
			<h2>The <em class="serif">path.</em></h2>
			<p class="lede">A game, a career in business systems, then cryptography and AI. The tools change. The habit of looking underneath doesn’t.</p>
		</div>
		<ol>
			{#each path as p}
				<li use:reveal>
					<span class="when mono">{p.when}</span>
					<div>
						<h3>{p.what}</h3>
						<p>{p.note}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	ol {
		list-style: none;
		margin: 48px 0 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}
	li {
		display: grid;
		grid-template-columns: 110px 1fr;
		gap: 16px;
		padding: 22px 0;
		border-bottom: 1px solid var(--line);
		align-items: baseline;
	}
	.when {
		font-size: 13px;
		color: var(--inspect);
	}
	h3 {
		font-size: 22px;
		font-weight: 550;
		letter-spacing: -0.02em;
	}
	p {
		color: var(--muted);
		margin-top: 4px;
		max-width: 60ch;
	}
	@media (max-width: 560px) {
		li {
			grid-template-columns: 1fr;
			gap: 4px;
		}
	}
</style>
