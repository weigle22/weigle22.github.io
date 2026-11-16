<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { site } from '#lib/data/site.ts';
	import { magnetic } from '#lib/animations/scroll.ts';
	import { reduced } from '#lib/utils/motion.ts';

	// The name "decrypts" itself on load: random glyphs settle into letters, left to right.
	const LINES = site.name.toUpperCase().split(' ');
	const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>';
	let shown = $state([...LINES]);
	let hero = $state<HTMLElement>();

	function decrypt(delay: number) {
		const total = 28;
		let frame = 0;
		const tick = () => {
			frame += 1;
			shown = LINES.map((line) =>
				[...line].map((ch, i) => (frame / total > (i + 1) / line.length ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join('')
			);
			if (frame < total) setTimeout(tick, 45);
			else shown = [...LINES];
		};
		setTimeout(tick, delay);
	}

	onMount(() => {
		if (reduced() || !hero) return;
		// Entrance, timed to follow the opening curtain.
		const tl = gsap.timeline({ delay: 0.75, defaults: { ease: 'power4.out' } });
		tl.from(hero.querySelectorAll('.name .line > span'), { yPercent: 100, duration: 1.1, stagger: 0.1 })
			.from(hero.querySelectorAll('[data-in]'), { opacity: 0, y: 24, duration: 0.8, stagger: 0.07 }, '-=0.7')
			.from(hero.querySelector('.glow'), { opacity: 0, duration: 1.6 }, 0);
		decrypt(800);

		// The glow leans toward the pointer.
		const move = (e: PointerEvent) => {
			const r = hero!.getBoundingClientRect();
			hero!.style.setProperty('--px', `${((e.clientX - r.left) / r.width) * 100}%`);
			hero!.style.setProperty('--py', `${Math.min(100, Math.max(40, ((e.clientY - r.top) / r.height) * 100))}%`);
		};
		addEventListener('pointermove', move, { passive: true });
		return () => {
			removeEventListener('pointermove', move);
			tl.kill();
		};
	});
</script>

<section id="top" class="hero dark" bind:this={hero}>
	<div class="glow" aria-hidden="true"><i></i><i></i><i></i></div>
	<div class="rules" aria-hidden="true"></div>

	<div class="inner">
		<div class="intro">
			<p class="role" data-in>
				{site.title}
				{#if site.availability}<span class="avail"><i></i>{site.availability}</span>{/if}
			</p>
			<h1 data-in>Building the part of software you <em class="serif">never see.</em></h1>
			<p class="sub" data-in>{site.intro}</p>
			<div class="cta" data-in>
				<a class="pill solid" href="#work" use:magnetic>Explore my work <ArrowDown size={16} /></a>
				<a class="pill" href="https://github.com/{site.githubUsername}" rel="noopener" use:magnetic>View GitHub <ArrowUpRight size={16} /></a>
			</div>
		</div>

		<div class="bottom">
			<div class="meta" data-in>
				<span>Portfolio ©{new Date().getFullYear()}</span>
				<span>{site.stackLine}</span>
				<span>{site.location || 'Scroll to explore'}</span>
			</div>
			<p class="name">
				<span class="sr">{site.name}</span>
				{#each shown as line}<span class="line" aria-hidden="true"><span>{line}</span></span>{/each}
			</p>
		</div>
	</div>
</section>

<style>
	.hero {
		--px: 50%;
		--py: 80%;
		position: relative;
		min-height: 100svh;
		padding: 0;
		overflow: hidden;
		display: flex;
		isolation: isolate;
	}
	.glow {
		position: absolute;
		inset: 0;
		z-index: -2;
		filter: blur(60px);
	}
	.glow i {
		position: absolute;
		border-radius: 50%;
		transition: left 1.4s var(--ease), top 1.4s var(--ease);
	}
	.glow i:nth-child(1) {
		left: calc(var(--px) - 45vw);
		top: calc(var(--py) - 6vh);
		width: 90vw;
		height: 70vh;
		background: var(--glow-a);
		animation: drift 14s ease-in-out infinite alternate;
	}
	.glow i:nth-child(2) {
		left: calc(var(--px) - 30vw);
		top: calc(var(--py) + 8vh);
		width: 60vw;
		height: 60vh;
		background: var(--glow-b);
		animation: drift 11s ease-in-out infinite alternate-reverse;
	}
	.glow i:nth-child(3) {
		left: calc(var(--px) - 18vw);
		top: calc(var(--py) + 24vh);
		width: 36vw;
		height: 50vh;
		background: #fff;
	}
	@keyframes drift {
		to {
			transform: translate(6vw, -4vh) scale(1.08);
		}
	}
	/* Thin vertical rules, like columns on a drafting sheet. */
	.rules {
		position: absolute;
		inset: 0;
		z-index: -1;
		background: repeating-linear-gradient(90deg, transparent 0 calc(20% - 1px), rgba(255, 255, 255, 0.09) calc(20% - 1px) 20%);
	}
	.inner {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 40px;
		padding: 112px var(--gutter) 0;
		min-width: 0;
	}
	.intro {
		max-width: 640px;
	}
	.role {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 18px;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 18px;
	}
	.avail {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		color: var(--ink);
	}
	.avail i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--ok);
	}
	h1 {
		font-size: clamp(30px, 4vw, 52px);
		line-height: 1.04;
		letter-spacing: -0.035em;
		font-weight: 600;
		text-wrap: balance;
	}
	.sub {
		margin-top: 18px;
		max-width: 46ch;
		color: color-mix(in srgb, var(--ink) 70%, transparent);
	}
	.cta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 28px;
	}
	.cta .pill:not(.solid) {
		border-color: rgba(255, 255, 255, 0.3);
	}
	.meta {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding-bottom: 10px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.35);
	}
	.name {
		display: flex;
		flex-direction: column;
		font-size: clamp(60px, 17vw, 330px);
		line-height: 0.82;
		font-weight: 700;
		letter-spacing: -0.06em;
		margin: 0.07em 0 0.02em -0.04em;
		color: #fff;
		mix-blend-mode: difference;
		white-space: nowrap;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}
	.line {
		display: block;
		overflow: hidden;
		padding-right: 0.1em;
	}
	.line span {
		display: block;
	}
	@media (max-width: 560px) {
		.meta span:nth-child(2) {
			display: none;
		}
	}
</style>
