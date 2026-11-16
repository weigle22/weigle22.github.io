<script>
	import { person } from '#lib/data/content.js';
	import { reveal } from '#lib/motion.svelte.js';
</script>

<section id="contact">
	<div class="wrap" use:reveal>
		<p class="tag">contact · open</p>
		<h2>Have something that needs to work <em class="serif">underneath?</em></h2>
		<p class="lede">I’m easiest to reach on LinkedIn. The code is on GitHub.</p>
		<div class="links">
			{#each person.links as l, i}
				<a class="pill" class:solid={i === 1} href={l.url} rel="noopener">{l.label} →</a>
			{/each}
		</div>
	</div>
</section>

<footer>
	<div class="wrap">
		<span>© {new Date().getFullYear()} {person.name}</span>
		<span class="mono">SvelteKit shell · Angular inside · rebuilt automatically by GitHub Actions</span>
	</div>
</footer>

<style>
	h2 {
		max-width: 16ch;
	}
	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 30px;
	}
	footer {
		border-top: 1px solid var(--line);
		padding: 22px 0 96px;
		font-size: 13px;
		color: var(--muted);
	}
	footer .wrap {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 8px 20px;
	}
	footer .mono {
		font-size: 11px;
	}
</style>
