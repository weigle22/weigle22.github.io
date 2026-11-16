<script>
	import { onDestroy } from 'svelte';

	// A tiny web homage to Color Stroop: tap the colour of the ink, not the word.
	const COLORS = [
		{ name: 'RED', css: '#d93a2b' },
		{ name: 'BLUE', css: '#2f6fdd' },
		{ name: 'GREEN', css: '#1f9a5c' },
		{ name: 'PURPLE', css: '#8a4fd3' }
	];
	const ROUND = 20;

	let phase = $state('idle'); // idle | playing | done
	let word = $state(COLORS[0]);
	let ink = $state(COLORS[1]);
	let score = $state(0);
	let streak = $state(0);
	let best = $state(0);
	let left = $state(ROUND);
	let flash = $state('');
	let timer;

	const pick = (not) => {
		let c;
		do c = COLORS[Math.floor(Math.random() * COLORS.length)];
		while (c === not);
		return c;
	};

	function next() {
		word = pick();
		// Mismatch most of the time: that is the whole trick.
		ink = Math.random() < 0.8 ? pick(word) : word;
	}

	function start() {
		score = 0;
		streak = 0;
		left = ROUND;
		phase = 'playing';
		next();
		clearInterval(timer);
		timer = setInterval(() => {
			left -= 1;
			if (left <= 0) {
				clearInterval(timer);
				phase = 'done';
				best = Math.max(best, score);
			}
		}, 1000);
	}

	function answer(c) {
		if (phase !== 'playing') return;
		if (c === ink) {
			streak += 1;
			score += 1 + Math.floor(streak / 5);
			flash = 'ok';
		} else {
			streak = 0;
			flash = 'bad';
		}
		setTimeout(() => (flash = ''), 160);
		next();
	}

	onDestroy(() => clearInterval(timer));
</script>

<div class="game">
	<div class="hud mono">
		<span>score <b>{score}</b></span>
		<span>streak <b>{streak}</b></span>
		<span>time <b>{left}s</b></span>
	</div>

	<div class="board {flash}" aria-live="polite">
		{#if phase === 'playing'}
			<p class="word" style:color={ink.css}>{word.name}</p>
			<p class="hint">Tap the colour of the ink</p>
		{:else if phase === 'done'}
			<p class="result">{score} point{score === 1 ? '' : 's'}</p>
			<p class="hint">Best this visit: {best}</p>
			<button class="pill solid" onclick={start}>Play again</button>
		{:else}
			<p class="result">Ink, not word.</p>
			<p class="hint">20 seconds. Streaks of five score extra.</p>
			<button class="pill solid" onclick={start}>Start</button>
		{/if}
	</div>

	<div class="keys">
		{#each COLORS as c}
			<button style:--c={c.css} disabled={phase !== 'playing'} onclick={() => answer(c)}>
				<i aria-hidden="true"></i>{c.name.toLowerCase()}
			</button>
		{/each}
	</div>
</div>

<style>
	.game {
		display: grid;
		gap: 14px;
	}
	.hud {
		display: flex;
		gap: 18px;
		font-size: 12px;
		color: var(--muted);
	}
	.hud b {
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	.board {
		min-height: 210px;
		display: grid;
		place-content: center;
		justify-items: center;
		gap: 10px;
		text-align: center;
		border-radius: 16px;
		border: 1px solid var(--line);
		background: var(--paper);
		transition: border-color 0.15s, background 0.15s;
	}
	.board.ok {
		border-color: var(--ok);
	}
	.board.bad {
		border-color: var(--bad);
		background: var(--accent-soft);
	}
	.word {
		font-size: clamp(44px, 9vw, 72px);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1;
	}
	.result {
		font-size: 30px;
		font-weight: 600;
		letter-spacing: -0.03em;
	}
	.hint {
		font-size: 14px;
		color: var(--muted);
	}
	.keys {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 8px;
	}
	.keys button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 6px;
		border-radius: 12px;
		border: 1px solid var(--line);
		background: var(--paper);
		cursor: pointer;
		font-size: 14px;
	}
	.keys button:disabled {
		opacity: 0.45;
		cursor: default;
	}
	.keys button:not(:disabled):hover {
		border-color: var(--c);
	}
	.keys i {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--c);
	}
	@media (max-width: 480px) {
		.keys {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
