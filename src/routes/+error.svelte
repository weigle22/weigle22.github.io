<script lang="ts">
	import { page } from '$app/state';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import { portfolio } from '#lib/services/github.ts';
	import { site } from '#lib/data/site.ts';

	const missing = $derived(page.status === 404);
	const suggestions = portfolio.filter((p) => p.featured).slice(0, 4);
</script>

<svelte:head>
	<title>{missing ? 'Page not found' : 'Something went wrong'} · {site.name}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="dark err">
	<div class="glow" aria-hidden="true"></div>
	<div class="wrap">
		<p class="code">{page.status}</p>
		<h1>{#if missing}This page is <em class="serif">underneath</em> something else.{:else}Something broke <em class="serif">underneath.</em>{/if}</h1>
		<p class="lede">
			{#if missing}The address doesn’t match anything on this site. It may have moved, or there may be a typo in the link.{:else}{page.error?.message ?? 'An unexpected error occurred.'}{/if}
		</p>
		<div class="cta">
			<a class="pill solid" href="/"><ArrowLeft size={16} /> Back to the home page</a>
			<a class="pill" href="/#work">See the work</a>
		</div>
		{#if missing}
			<p class="label">Or open a case study</p>
			<ul>
				{#each suggestions as p}<li><a class="u" href="/projects/{p.id}/">{p.title}</a></li>{/each}
			</ul>
		{/if}
	</div>
</main>

<style>
	.err {
		position: relative;
		min-height: 100svh;
		display: flex;
		align-items: center;
		overflow: hidden;
		isolation: isolate;
		padding: 120px 0 80px;
	}
	.glow {
		position: absolute;
		z-index: -1;
		left: 10%;
		right: 10%;
		bottom: -45vw;
		height: 60vw;
		border-radius: 50%;
		background: radial-gradient(closest-side, var(--glow-c), var(--glow-b) 30%, var(--glow-a) 62%, transparent);
		filter: blur(50px);
	}
	.code {
		font-family: var(--mono);
		font-size: 14px;
		color: var(--accent);
		margin-bottom: 16px;
	}
	h1 {
		font-size: clamp(44px, 8vw, 120px);
		line-height: 0.95;
		letter-spacing: -0.045em;
		font-weight: 600;
		max-width: 14ch;
	}
	.cta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin: 32px 0 48px;
	}
	ul {
		list-style: none;
		margin: 12px 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 10px 28px;
		font-family: var(--serif);
		font-weight: 780;
		font-size: 28px;
	}
</style>
