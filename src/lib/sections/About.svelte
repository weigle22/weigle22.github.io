<script lang="ts">
	import { about, site } from '#lib/data/site.ts';
	import Altitude from '#lib/components/Altitude.svelte';
	import { parallax, rise, stagger, words } from '#lib/animations/scroll.ts';
	import { pad2 } from '#lib/utils/format.ts';
</script>

<section id="about" class="dark">
	<div class="wrap">
		<div class="eyebrow"><span>About {site.name.split(' ')[0]}</span><span>(02)</span></div>

		<h2 use:words>{about.headline[0]} <em class="serif">{about.headline[1]}</em></h2>

		<div class="split">
			<div class="visual" use:rise>
				{#if site.profileImage}
					<img src={site.profileImage} alt={site.name} loading="lazy" use:parallax={24} />
				{/if}
				<p class="label">One request, four altitudes</p>
				<Altitude />
			</div>

			<ol class="blocks" use:stagger>
				{#each about.blocks as b, i}
					<li>
						<span class="label">({pad2(i + 1)}) {b.label}</span>
						<h3>{b.title}</h3>
						<p>{b.text}</p>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>

<style>
	h2 {
		max-width: 16ch;
	}
	.split {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: clamp(32px, 6vw, 96px);
		margin-top: clamp(48px, 7vw, 96px);
		align-items: start;
	}
	.visual {
		position: sticky;
		top: 96px;
	}
	.visual > .label {
		margin-bottom: 12px;
	}
	img {
		width: 100%;
		border-radius: var(--radius);
		margin-bottom: 24px;
	}
	.blocks {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.blocks li {
		padding: 28px 0 34px;
		border-top: 1px solid var(--line);
	}
	.blocks li:last-child {
		border-bottom: 1px solid var(--line);
	}
	h3 {
		margin: 14px 0 12px;
		font-size: clamp(24px, 2.8vw, 40px);
		line-height: 1.05;
		letter-spacing: -0.035em;
		font-weight: 600;
		text-wrap: balance;
	}
	.blocks p {
		color: var(--muted);
		max-width: 52ch;
		font-size: 17px;
		text-wrap: pretty;
	}
	@media (max-width: 900px) {
		.split {
			grid-template-columns: 1fr;
		}
		.visual {
			position: static;
		}
	}
</style>
