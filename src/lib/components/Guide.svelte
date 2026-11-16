<script lang="ts">
	import { onMount } from 'svelte';
	import { tour } from '#lib/data/site.ts';
	import { reduced } from '#lib/utils/motion.ts';

	const motion = { get on() { return !reduced(); } };

	let { touring = $bindable(false) } = $props();

	let current = $state(0);
	let open = $state(true);
	let eye = $state({ x: 0, y: 0 });
	let blink = $state(false);
	let bot = $state<HTMLElement>();
	let muted = $state(false); // set when the visitor hides the guide on purpose
	let timer: ReturnType<typeof setTimeout>;
	let hideTimer: ReturnType<typeof setTimeout>;

	const line = $derived(tour[current].say);

	onMount(() => {
		// On small screens the bubble would cover the name, so start with just the eyes.
		if (innerWidth < 700) {
			open = false;
			muted = true;
		}

		// Track which section is in view so the guide can comment on it.
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting && !touring) {
						const i = tour.findIndex((t) => t.id === e.target.id);
						if (i >= 0 && i !== current) {
							current = i;
							speak();
						}
					}
				}
			},
			{ rootMargin: '-45% 0px -45% 0px' }
		);
		for (const t of tour) {
			const el = document.getElementById(t.id);
			if (el) io.observe(el);
		}

		// Eyes follow the pointer.
		const move = (e: PointerEvent) => {
			if (!bot || !motion.on) return;
			const r = bot.getBoundingClientRect();
			const dx = e.clientX - (r.left + r.width / 2);
			const dy = e.clientY - (r.top + r.height / 2);
			const d = Math.hypot(dx, dy) || 1;
			const reach = Math.min(1, d / 220) * 3.2;
			eye = { x: (dx / d) * reach, y: (dy / d) * reach };
		};
		addEventListener('pointermove', move, { passive: true });

		const blinker = setInterval(() => {
			if (!motion.on) return;
			blink = true;
			setTimeout(() => (blink = false), 140);
		}, 4200);

		return () => {
			io.disconnect();
			removeEventListener('pointermove', move);
			clearInterval(blinker);
			clearTimeout(timer);
			clearTimeout(hideTimer);
		};
	});

	// Say the line for a few seconds, then get out of the way.
	function speak(ms = 6500) {
		if (muted) return;
		open = true;
		clearTimeout(hideTimer);
		if (!touring) hideTimer = setTimeout(() => (open = false), ms);
	}

	function toggle() {
		open = !open;
		muted = !open;
		clearTimeout(hideTimer);
	}

	function go(i: number) {
		current = i;
		open = true;
		clearTimeout(hideTimer);
		document.getElementById(tour[i].id)?.scrollIntoView({ behavior: motion.on ? 'smooth' : 'auto', block: 'start' });
	}

	function step() {
		if (current >= tour.length - 1) {
			touring = false;
			return;
		}
		go(current + 1);
		timer = setTimeout(step, 5200);
	}

	// Start or stop the tour whenever `touring` flips (the hero button flips it too).
	$effect(() => {
		clearTimeout(timer);
		if (touring) {
			muted = false;
			go(0);
			timer = setTimeout(step, 3600);
		} else if (open) {
			hideTimer = setTimeout(() => (open = false), 9000);
		}
	});
</script>

<aside class="guide" aria-label="Site guide">
	{#if open}
		<div class="bubble">
			<p aria-live="polite">{line}</p>
			<div class="actions">
				{#if touring}
					<span class="mono">{current + 1}/{tour.length}</span>
					<button onclick={() => (touring = false)}>Stop</button>
				{:else}
					<button class="go" onclick={() => (touring = true)}>▶ Take the tour</button>
					<button onclick={toggle}>Hide</button>
				{/if}
			</div>
		</div>
	{/if}
	<button class="bot" bind:this={bot} onclick={toggle} aria-label={open ? 'Hide the guide' : 'Show the guide'} aria-expanded={open}>
		{#each [0, 1] as _}
			<span class="eye" class:blink>
				<i style:transform="translate({eye.x}px, {eye.y}px)"></i>
			</span>
		{/each}
	</button>
</aside>

<style>
	.guide {
		position: fixed;
		right: max(16px, env(safe-area-inset-right));
		bottom: max(16px, env(safe-area-inset-bottom));
		z-index: 40;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 10px;
		pointer-events: none;
	}
	.guide > :global(*) {
		pointer-events: auto;
	}
	.bubble {
		width: min(290px, calc(100vw - 32px));
		padding: 14px 16px;
		border-radius: 18px 18px 4px 18px;
		background: #17181c;
		border: 1px solid #3a3b42;
		color: #f3f2ed;
		font-size: 14.5px;
		line-height: 1.4;
		box-shadow: 0 16px 40px -18px rgba(0, 0, 0, 0.55);
		animation: rise 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}
	.actions {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 12px;
	}
	.actions span {
		font-size: 11px;
		color: #a3a5ae;
		margin-right: auto;
	}
	.actions button {
		padding: 6px 12px;
		border-radius: 999px;
		border: 1px solid #3a3b42;
		background: transparent;
		color: inherit;
		font-size: 13px;
		cursor: pointer;
	}
	.actions .go {
		background: #f3f2ed;
		color: #17181c;
		border-color: #f3f2ed;
		font-weight: 550;
	}
	.bot {
		display: flex;
		gap: 6px;
		align-items: center;
		padding: 12px 14px;
		border-radius: 999px;
		border: 1px solid #3a3b42;
		background: #17181c;
		cursor: pointer;
		box-shadow: 0 10px 28px -12px rgba(0, 0, 0, 0.6);
	}
	.eye {
		width: 16px;
		height: 18px;
		border-radius: 50%;
		background: #f3f2ed;
		display: grid;
		place-items: center;
		transition: transform 0.1s;
	}
	.eye.blink {
		transform: scaleY(0.1);
	}
	.eye i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--accent);
	}
</style>
