// Smooth wheel scrolling (Lenis), kept in step with GSAP ScrollTrigger.
// Mouse and trackpad only: touch screens keep their native momentum, and visitors who
// prefer reduced motion get ordinary scrolling.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { finePointer, reduced } from './motion.ts';

let lenis: Lenis | null = null;

export function startSmoothScroll() {
	if (lenis || reduced() || !finePointer()) return () => {};
	gsap.registerPlugin(ScrollTrigger);
	lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, anchors: false });
	lenis.on('scroll', ScrollTrigger.update);
	const tick = (time: number) => lenis?.raf(time * 1000);
	gsap.ticker.add(tick);
	gsap.ticker.lagSmoothing(0);
	return () => {
		gsap.ticker.remove(tick);
		lenis?.destroy();
		lenis = null;
	};
}

/** Glide to an element (or jump, when motion is reduced). */
export function scrollToElement(el: HTMLElement, offset = 0) {
	if (lenis) lenis.scrollTo(el, { offset, duration: 1.2 });
	else el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
}

/** After a route change the page is a different height and starts somewhere else. */
export function syncSmoothScroll() {
	lenis?.resize();
	lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
}

/** Freeze page scrolling while an overlay (the mobile menu) is open. */
export function lockScroll(locked: boolean) {
	if (locked) lenis?.stop();
	else lenis?.start();
}
