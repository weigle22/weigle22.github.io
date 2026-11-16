<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Mail from '@lucide/svelte/icons/mail';
	import { site } from '#lib/data/site.ts';
	import { magnetic, rise, words } from '#lib/animations/scroll.ts';

	const github = `https://github.com/${site.githubUsername}`;
	// Email is the main call to action when one is set; otherwise LinkedIn takes its place.
	const primary = site.email ? { label: 'Email me', url: `mailto:${site.email}` } : { label: 'Message me on LinkedIn', url: site.linkedin };
	const others = [
		...(site.email ? [{ label: 'LinkedIn', url: site.linkedin }] : []),
		{ label: 'GitHub', url: github },
		...site.links
	];
</script>

<section id="contact" class="dark">
	<div class="wrap">
		<div class="eyebrow"><span>Contact</span><span>{site.availability || 'Say hello'}</span></div>
		<h2 use:words>Have something that needs to work <em class="serif">underneath?</em></h2>

		<div class="row" use:rise>
			<a class="big" href={primary.url} rel="noopener" use:magnetic={0.18} data-cursor="Go">
				{#if site.email}<Mail size={22} />{/if}
				{primary.label}
				<span class="arrow"><ArrowUpRight size={26} /></span>
			</a>
			<ul>
				{#each others as l}
					<li><a class="u" href={l.url} rel="noopener">{l.label} <ArrowUpRight size={14} /></a></li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	section {
		position: relative;
		overflow: hidden;
		isolation: isolate;
		padding-bottom: clamp(140px, 24vw, 340px);
	}
	/* The hero's light comes back to close the page. */
	section::after {
		content: '';
		position: absolute;
		z-index: -1;
		left: 8%;
		right: 8%;
		bottom: -40vw;
		height: 58vw;
		border-radius: 50%;
		background: radial-gradient(closest-side, #fff 0, var(--glow-b) 30%, var(--glow-a) 62%, transparent 100%);
		filter: blur(50px);
	}
	h2 {
		max-width: 13ch;
		font-size: clamp(44px, 9vw, 150px);
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 28px 40px;
		margin-top: clamp(40px, 6vw, 80px);
	}
	.big {
		display: inline-flex;
		align-items: center;
		gap: 14px;
		padding: 20px 22px 20px 30px;
		border-radius: 999px;
		background: var(--ink);
		color: var(--surface);
		text-decoration: none;
		font-size: clamp(18px, 2vw, 24px);
		font-weight: 600;
		letter-spacing: -0.02em;
	}
	.arrow {
		display: grid;
		place-items: center;
		width: 46px;
		height: 46px;
		border-radius: 50%;
		background: var(--surface);
		color: var(--ink);
		transition: transform 0.5s var(--ease), background 0.3s;
	}
	.big:hover .arrow {
		transform: rotate(45deg);
		background: var(--glow-a);
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 10px 28px;
		font-size: 15px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	ul a {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
</style>
