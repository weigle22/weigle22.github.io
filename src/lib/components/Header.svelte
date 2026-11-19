<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import { site } from '#lib/data/site.ts';
	import { lockScroll } from '#lib/utils/smooth.ts';

	const links = [
		{ id: 'work', label: 'Work' },
		{ id: 'about', label: 'About' },
		{ id: 'experience', label: 'Experience' },
		{ id: 'education', label: 'Education' },
		{ id: 'stack', label: 'Tech Stack' },
		{ id: 'contact', label: 'Contact' }
	];
	const github = `https://github.com/${site.githubUsername}`;

	let active = $state('');
	let open = $state(false);
	let hidden = $state(false);
	const home = $derived(page.url.pathname === '/');

	onMount(() => {
		// Which section is under the middle of the screen?
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) if (e.isIntersecting) active = e.target.id;
			},
			{ rootMargin: '-45% 0px -50% 0px' }
		);
		const watch = () => {
			io.disconnect();
			for (const id of ['top', ...links.map((l) => l.id)]) {
				const el = document.getElementById(id);
				if (el) io.observe(el);
			}
		};
		watch();
		const mo = new MutationObserver(watch);
		mo.observe(document.getElementById('main')!, { childList: true });

		// Slide the bar away when scrolling down, bring it back when scrolling up.
		let last = scrollY;
		const onScroll = () => {
			hidden = scrollY > last && scrollY > 400 && !open;
			last = scrollY;
		};
		addEventListener('scroll', onScroll, { passive: true });
		return () => {
			io.disconnect();
			mo.disconnect();
			removeEventListener('scroll', onScroll);
		};
	});

	$effect(() => {
		document.documentElement.style.overflow = open ? 'hidden' : '';
		lockScroll(open);
	});
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (open = false)} />

<header class:hidden>
	<a class="mark" href="/#top" aria-label="{site.monogram}: {site.name}, home">{site.monogram}</a>
	<nav aria-label="Sections">
		{#each links as l}
			<a href="/#{l.id}" class:active={home && active === l.id} aria-current={home && active === l.id ? 'true' : undefined}>{l.label}</a>
		{/each}
		<a class="gh" href={github} rel="noopener">GitHub <ArrowUpRight size={14} /></a>
	</nav>
	<button class="burger" onclick={() => (open = !open)} aria-expanded={open} aria-controls="menu" aria-label={open ? 'Close menu' : 'Open menu'}>
		{#if open}<X size={22} />{:else}<Menu size={22} />{/if}
	</button>
</header>

<div id="menu" class="menu dark" class:open inert={!open} data-lenis-prevent>
	<nav aria-label="Menu">
		{#each links as l, i}
			<a href="/#{l.id}" onclick={() => (open = false)} style:--i={i}><span>0{i + 1}</span>{l.label}</a>
		{/each}
		<a href={github} rel="noopener" style:--i={links.length}><span>↗</span>GitHub</a>
	</nav>
</div>

<style>
	/* White text with difference blending stays readable over dark and light bands alike. */
	header {
		position: fixed;
		inset: 0 0 auto 0;
		z-index: 50;
		display: flex;
		align-items: center;
		height: 64px;
		padding: 0 var(--gutter);
		color: #fff;
		mix-blend-mode: difference;
		transition: transform 0.5s var(--ease);
	}
	header.hidden {
		transform: translateY(-100%);
	}
	.mark {
		font-weight: 700;
		font-size: 18px;
		letter-spacing: -0.02em;
		text-decoration: none;
		margin-right: auto;
	}
	nav {
		display: flex;
		gap: clamp(16px, 1.8vw, 26px);
		font-size: 13px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
	header nav a {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		text-decoration: none;
		opacity: 0.6;
		padding: 6px 0;
		transition: opacity 0.3s;
	}
	header nav a::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 1px;
		background: currentColor;
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.4s var(--ease);
	}
	header nav a:hover,
	header nav a.active {
		opacity: 1;
	}
	header nav a:hover::after,
	header nav a.active::after {
		transform: scaleX(1);
	}
	.burger {
		display: none;
		background: none;
		border: 0;
		padding: 8px;
		margin-right: -8px;
		cursor: pointer;
	}
	.menu {
		position: fixed;
		inset: 0;
		z-index: 45;
		display: grid;
		align-items: end;
		padding: 96px var(--gutter) 48px;
		clip-path: inset(0 0 100% 0);
		transition: clip-path 0.6s cubic-bezier(0.7, 0, 0.2, 1);
	}
	.menu.open {
		clip-path: inset(0);
	}
	.menu nav {
		flex-direction: column;
		gap: 0;
		text-transform: none;
		letter-spacing: -0.04em;
	}
	.menu a {
		display: flex;
		align-items: baseline;
		gap: 16px;
		font-size: clamp(30px, 9vw, 60px);
		font-weight: 600;
		line-height: 1.15;
		text-decoration: none;
		padding: 8px 0;
		border-top: 1px solid var(--line);
		opacity: 0;
		transform: translateY(24px);
		transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
	}
	.menu.open a {
		opacity: 1;
		transform: none;
		transition-delay: calc(0.15s + var(--i) * 0.05s);
	}
	.menu span {
		font-family: var(--mono);
		font-size: 12px;
		letter-spacing: 0;
		color: var(--muted);
		width: 24px;
	}
	@media (max-width: 1040px) {
		header nav {
			display: none;
		}
		.burger {
			display: inline-flex;
		}
	}
</style>
