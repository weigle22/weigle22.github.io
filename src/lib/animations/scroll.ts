// Scroll-driven animation, as Svelte actions built on GSAP ScrollTrigger.
// Every action is a no-op when the visitor prefers reduced motion, and content is
// visible by default: nothing is hidden unless JavaScript is running and motion is allowed.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { finePointer, reduced } from '#lib/utils/motion.ts';

let ready = false;
function setup() {
	if (ready) return;
	gsap.registerPlugin(ScrollTrigger);
	ready = true;
}

const cleanup = (...tweens: (gsap.core.Animation | undefined)[]) => ({
	destroy() {
		for (const t of tweens) {
			t?.scrollTrigger?.kill();
			t?.kill();
		}
	}
});

/** Fade and slide an element up when it scrolls into view. */
export function rise(node: HTMLElement, opts: { delay?: number; y?: number } = {}) {
	if (reduced()) return;
	setup();
	return cleanup(
		gsap.from(node, {
			opacity: 0,
			y: opts.y ?? 32,
			duration: 0.9,
			delay: opts.delay ?? 0,
			ease: 'power3.out',
			scrollTrigger: { trigger: node, start: 'top 90%', once: true }
		})
	);
}

/** Reveal the direct children of an element one after another. */
export function stagger(node: HTMLElement, opts: { each?: number; y?: number } = {}) {
	if (reduced()) return;
	setup();
	return cleanup(
		gsap.from(node.children, {
			opacity: 0,
			y: opts.y ?? 24,
			duration: 0.8,
			stagger: opts.each ?? 0.08,
			ease: 'power3.out',
			scrollTrigger: { trigger: node, start: 'top 88%', once: true }
		})
	);
}

/** Headline reveal: each word slides up from behind a mask, staggered. */
export function words(node: HTMLElement, opts: { delay?: number; immediate?: boolean } = {}) {
	if (reduced()) return;
	setup();
	const label = node.textContent?.replace(/\s+/g, ' ').trim() ?? '';
	const inner: HTMLElement[] = [];
	const walk = (el: Node) => {
		for (const child of [...el.childNodes]) {
			if (child.nodeType === Node.TEXT_NODE) {
				const frag = document.createDocumentFragment();
				for (const part of (child.textContent ?? '').split(/(\s+)/)) {
					if (!part) continue;
					if (/^\s+$/.test(part)) {
						frag.append(' ');
						continue;
					}
					const mask = document.createElement('span');
					mask.className = 'w-mask';
					const word = document.createElement('span');
					word.className = 'w';
					word.textContent = part;
					mask.append(word);
					frag.append(mask);
					inner.push(word);
				}
				child.replaceWith(frag);
			} else if (child.nodeType === Node.ELEMENT_NODE) walk(child);
		}
	};
	walk(node);
	node.setAttribute('aria-label', label);
	return cleanup(
		gsap.from(inner, {
			yPercent: 115,
			duration: 1,
			delay: opts.delay ?? 0,
			stagger: 0.045,
			ease: 'power4.out',
			scrollTrigger: opts.immediate ? undefined : { trigger: node, start: 'top 90%', once: true }
		})
	);
}

/** Image reveal through a clipping mask, with the picture settling as it opens. */
export function unmask(node: HTMLElement) {
	if (reduced()) return;
	setup();
	const st = { trigger: node, start: 'top 88%', once: true };
	return cleanup(
		gsap.from(node, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut', scrollTrigger: st }),
		node.firstElementChild ? gsap.from(node.firstElementChild, { scale: 1.25, duration: 1.6, ease: 'power3.out', scrollTrigger: st }) : undefined
	);
}

/** Move an element at a different speed from the page while it is on screen. */
export function parallax(node: HTMLElement, speed = 60) {
	if (reduced()) return;
	setup();
	return cleanup(
		gsap.fromTo(node, { y: speed }, { y: -speed, ease: 'none', scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: true } })
	);
}

/** Grow a line from the top as its container scrolls past: used for the timeline. */
export function drawLine(node: HTMLElement) {
	if (reduced()) return;
	setup();
	return cleanup(
		gsap.fromTo(
			node,
			{ scaleY: 0 },
			{ scaleY: 1, ease: 'none', transformOrigin: 'top', scrollTrigger: { trigger: node.parentElement!, start: 'top 70%', end: 'bottom 70%', scrub: true } }
		)
	);
}

/** Buttons that lean toward the pointer. Mouse only. */
export function magnetic(node: HTMLElement, strength = 0.3) {
	if (reduced() || !finePointer()) return;
	const x = gsap.quickTo(node, 'x', { duration: 0.4, ease: 'power3.out' });
	const y = gsap.quickTo(node, 'y', { duration: 0.4, ease: 'power3.out' });
	const move = (e: PointerEvent) => {
		const r = node.getBoundingClientRect();
		x((e.clientX - (r.left + r.width / 2)) * strength);
		y((e.clientY - (r.top + r.height / 2)) * strength);
	};
	const leave = () => {
		x(0);
		y(0);
	};
	node.addEventListener('pointermove', move);
	node.addEventListener('pointerleave', leave);
	return {
		destroy() {
			node.removeEventListener('pointermove', move);
			node.removeEventListener('pointerleave', leave);
		}
	};
}

export function refreshScroll() {
	if (ready) ScrollTrigger.refresh();
}
