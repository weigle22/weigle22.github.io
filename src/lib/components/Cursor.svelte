<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { finePointer, reduced } from '#lib/utils/motion.ts';

	// A ring that trails the real pointer. The system cursor stays visible, so nothing about
	// normal pointing or accessibility changes; touch devices and reduced-motion get no ring at all.
	let ring = $state<HTMLElement>();
	let enabled = $state(false);
	let mode = $state<'default' | 'link' | 'view'>('default');
	let label = $state('');
	let down = $state(false);
	let seen = $state(false);

	onMount(() => {
		if (!finePointer() || reduced()) return;
		enabled = true;
		let x: gsap.QuickToFunc, y: gsap.QuickToFunc;

		const move = (e: PointerEvent) => {
			if (!ring) return;
			if (!x) {
				gsap.set(ring, { x: e.clientX, y: e.clientY });
				x = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
				y = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
				seen = true;
			}
			x(e.clientX);
			y(e.clientY);

			const t = e.target as Element | null;
			const view = t?.closest<HTMLElement>('[data-cursor]');
			if (view) {
				mode = 'view';
				label = view.dataset.cursor ?? '';
			} else if (t?.closest('a, button, [role="button"], input, select, summary, label')) {
				mode = 'link';
			} else mode = 'default';
		};
		const press = () => (down = true);
		const release = () => (down = false);
		const leave = () => (seen = false);

		addEventListener('pointermove', move, { passive: true });
		addEventListener('pointerdown', press);
		addEventListener('pointerup', release);
		document.documentElement.addEventListener('pointerleave', leave);
		return () => {
			removeEventListener('pointermove', move);
			removeEventListener('pointerdown', press);
			removeEventListener('pointerup', release);
			document.documentElement.removeEventListener('pointerleave', leave);
		};
	});
</script>

{#if enabled}
	<div class="ring {mode}" class:down class:seen bind:this={ring} aria-hidden="true">
		<span>{label}</span>
	</div>
{/if}

<style>
	.ring {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 90;
		width: 34px;
		height: 34px;
		margin: -17px 0 0 -17px;
		border-radius: 50%;
		border: 1px solid #fff;
		mix-blend-mode: difference;
		pointer-events: none;
		opacity: 0;
		display: grid;
		place-items: center;
		transition: width 0.3s var(--ease), height 0.3s var(--ease), margin 0.3s var(--ease), background 0.3s, opacity 0.3s, scale 0.2s;
	}
	.ring.seen {
		opacity: 1;
	}
	.ring.link {
		width: 54px;
		height: 54px;
		margin: -27px 0 0 -27px;
		background: rgba(255, 255, 255, 0.12);
	}
	.ring.view {
		width: 92px;
		height: 92px;
		margin: -46px 0 0 -46px;
		background: #fff;
		mix-blend-mode: normal;
	}
	.ring.down {
		scale: 0.82;
	}
	span {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #050506;
		opacity: 0;
		transition: opacity 0.2s;
	}
	.ring.view span {
		opacity: 1;
	}
</style>
