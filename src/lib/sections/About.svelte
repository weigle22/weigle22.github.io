<script lang="ts">
	import { about, site } from '#lib/data/site.ts';
	import Altitude from '#lib/components/Altitude.svelte';
	import ResumeButton from '#lib/components/ResumeButton.svelte';
	import { parallax, rise, stagger, unmask, words } from '#lib/animations/scroll.ts';
	import { pad2 } from '#lib/utils/format.ts';
</script>

<section id="about" class="dark">
	<div class="wrap">
		<div class="eyebrow"><span>About {site.name.split(' ')[0]}</span><span>(02)</span></div>

		<h2 use:words>{about.headline[0]} <em class="serif">{about.headline[1]}</em></h2>

		<div class="split">
			<div class="visual">
				{#if site.profileImage}
					<figure use:unmask>
						<div class="photo"><img
								src={site.profileImage}
								srcset={site.profileImage.endsWith('.webp')
									? `${site.profileImage.replace('.webp', '-480.webp')} 480w, ${site.profileImage.replace('.webp', '-800.webp')} 800w, ${site.profileImage} 1100w`
									: undefined}
								sizes="(max-width: 900px) 92vw, 40vw"
								alt="{site.name} in graduation regalia for his master’s degree"
								width="1100"
								height="1653"
								loading="lazy"
								decoding="async"
								use:parallax={28}
							/></div>
					</figure>
					<p class="caption"><span class="label">Education</span>{site.profileCaption}</p>
				{/if}
				<div class="resume"><ResumeButton variant="link" label="Download my résumé" /></div>
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

		<div class="how">
			<div use:rise>
				<p class="label">How I think</p>
				<h3 class="big">One request, <em class="serif">four altitudes.</em></h3>
				<p class="note">A leave request looks like a form. Slide down a level and it becomes a contract, then a rule, then a row. I work on all four, and care most about the bottom two.</p>
			</div>
			<div use:rise><Altitude /></div>
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
	figure {
		margin: 0;
		border-radius: var(--radius);
		overflow: hidden;
	}
	.photo {
		aspect-ratio: 4 / 5;
		overflow: hidden;
	}
	img {
		display: block;
		width: 100%;
		height: 116%;
		margin-top: -8%;
		object-fit: cover;
		object-position: 50% 12%;
	}
	.caption {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		margin-top: 14px;
		padding-top: 12px;
		border-top: 1px solid var(--line);
		font-size: 15px;
		font-weight: 500;
	}
	.resume {
		margin-top: 16px;
	}
	.resume:empty {
		display: none;
	}
	.how {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: clamp(32px, 6vw, 96px);
		align-items: center;
		margin-top: clamp(64px, 9vw, 130px);
		padding-top: clamp(40px, 5vw, 64px);
		border-top: 1px solid var(--line);
	}
	.big {
		font-size: clamp(34px, 5vw, 72px);
		line-height: 0.98;
		letter-spacing: -0.045em;
	}
	.note {
		margin-top: 18px;
		color: var(--muted);
		max-width: 46ch;
		font-size: 17px;
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
		.split,
		.how {
			grid-template-columns: 1fr;
		}
		.visual {
			position: static;
		}
	}
</style>
