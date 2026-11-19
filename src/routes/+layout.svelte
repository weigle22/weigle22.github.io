<script lang="ts">
	import '@fontsource-variable/fraunces/soft.css';
	import '@fontsource-variable/fraunces/soft-italic.css';
	import '@fontsource-variable/jetbrains-mono';
	import '../app.css';
	// Preload the faces visible above the fold so the hero doesn't reflow when fonts arrive.
	import serifItalic from '@fontsource-variable/fraunces/files/fraunces-latin-soft-italic.woff2?url';

	import { onMount } from 'svelte';
	import { afterNavigate, onNavigate } from '$app/navigation';
	import { scrollToElement, startSmoothScroll, syncSmoothScroll } from '#lib/utils/smooth.ts';
	import Header from '#lib/components/Header.svelte';
	import Cursor from '#lib/components/Cursor.svelte';
	import { refreshScroll } from '#lib/animations/scroll.ts';
	import { site } from '#lib/data/site.ts';

	let { children } = $props();

	onMount(() => {
		// Scroll positions are measured before web fonts settle; measure again once they have.
		document.fonts?.ready.then(refreshScroll);
		const stopSmooth = startSmoothScroll();

		// Glide to in-page sections instead of jumping. Runs before SvelteKit's own link handling.
		const glide = (e: MouseEvent) => {
			if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
			const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
			if (!a || a.target || a.origin !== location.origin || a.pathname !== location.pathname || !a.hash) return;
			const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
			if (!target) return;
			e.preventDefault();
			scrollToElement(target);
			history.pushState(history.state, '', a.hash);
		};
		document.addEventListener('click', glide, true);
		return () => {
			document.removeEventListener('click', glide, true);
			stopSmooth();
		};
	});

	afterNavigate(() => syncSmoothScroll());

	// Cross-fade between the home page and case studies.
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="preload" href="/fonts/tex-gyre-adventor-bold.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href="/fonts/tex-gyre-adventor-regular.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={serifItalic} as="font" type="font/woff2" crossorigin="anonymous" />
	<meta name="theme-color" content="#050506" />
</svelte:head>

<div class="curtain" aria-hidden="true"><span>{site.monogram}</span></div>
<a class="skip" href="#main">Skip to content</a>
<Header />
<Cursor />
<div id="main">{@render children()}</div>

<style>
	.skip {
		position: fixed;
		left: 12px;
		top: -60px;
		z-index: 60;
		padding: 10px 14px;
		border-radius: 8px;
		background: #fff;
		color: #000;
		transition: top 0.2s;
	}
	.skip:focus {
		top: 12px;
	}
</style>
