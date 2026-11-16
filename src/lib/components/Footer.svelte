<script lang="ts">
	import { site } from '#lib/data/site.ts';
</script>

<footer class="dark">
	<div class="wrap">
		<span>©{new Date().getFullYear()} {site.name}</span>
		<span class="mono">SvelteKit shell · Angular inside · rebuilt nightly by GitHub Actions</span>
		<a class="u" href="#top">Back to top ↑</a>
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--line);
		padding: 22px 0 28px;
		font-size: 13px;
		color: var(--muted);
	}
	.wrap {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 8px 20px;
	}
	.mono {
		font-size: 11px;
	}
</style>
