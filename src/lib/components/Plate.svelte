<script lang="ts">
	// Every project picture is drawn in code: no stock mock-ups, no screenshots of private systems.
	let { id, title = '' }: { id: string; title?: string } = $props();
	const initials = $derived(title.split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase());

	const lattice: { x: number; y: number }[] = [];
	for (let r = 0; r < 9; r++) for (let c = 0; c < 15; c++) lattice.push({ x: 70 + c * 47 + r * 14, y: 60 + r * 46 });
	const lanes = ['Employee', 'Recommending', 'Processor', 'Certifying', 'Approving'];
	const guests = [true, true, false, true, false, false];
	const cloud = Array.from({ length: 70 }, (_, i) => {
		const a = i * 2.399963;
		const d = 14 + Math.sqrt(i) * 19;
		return { x: 560 + Math.cos(a) * d, y: 250 + Math.sin(a) * d * 0.8, hot: i % 9 === 0 };
	});
	const words = [
		{ t: 'RED', c: '#2f6fdd', x: 90, y: 170, s: 110 },
		{ t: 'BLUE', c: '#1f9a5c', x: 330, y: 290, s: 150 },
		{ t: 'GREEN', c: '#d93a2b', x: 110, y: 420, s: 120 },
		{ t: 'PURPLE', c: '#e0a100', x: 470, y: 150, s: 70 }
	];
</script>

<svg class="plate {id}" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration for this project">
	{#if id === 'falcon'}
		<defs>
			<radialGradient id="fg" cx="50%" cy="110%" r="90%">
				<stop offset="0" stop-color="#38d6ff" /><stop offset="0.45" stop-color="#1b3cff" /><stop offset="1" stop-color="#03040a" />
			</radialGradient>
		</defs>
		<rect width="800" height="500" fill="url(#fg)" />
		{#each lattice as p}<circle cx={p.x} cy={p.y} r="2.2" fill="#fff" opacity="0.5" />{/each}
		<path class="draw" d="M164 152 L319 244 L272 198 L474 290 L441 244 L629 336" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" />
		{#each [[164, 152], [319, 244], [474, 290], [629, 336]] as [x, y]}<circle cx={x} cy={y} r="7" fill="#fff" />{/each}
		<text x="60" y="455" class="mono" fill="#fff" opacity="0.8">shortest vector · NTRU lattice</text>
	{:else if id === 'leave-workflow'}
		<rect width="800" height="500" fill="#e9e7e1" />
		{#each lanes as l, i}
			<line x1="40" x2="760" y1={90 + i * 80} y2={90 + i * 80} stroke="#0a0a0c" stroke-opacity="0.18" stroke-dasharray="3 7" />
			<text x="40" y={78 + i * 80} class="mono" fill="#0a0a0c" opacity="0.55">{l}</text>
			<circle cx={190 + i * 125} cy={90 + i * 80} r="11" fill="#0a0a0c" />
		{/each}
		<path class="draw" d="M190 90 C260 90 250 170 315 170 S380 250 440 250 S500 330 565 330 S625 410 690 410" fill="none" stroke="#1740e0" stroke-width="4" />
		<circle class="token" r="9" fill="#1740e0"><animateMotion dur="6s" repeatCount="indefinite" path="M190 90 C260 90 250 170 315 170 S380 250 440 250 S500 330 565 330 S625 410 690 410" /></circle>
	{:else if id === 'event-attendance'}
		<rect width="800" height="500" fill="#0b1f17" />
		{#each guests as here, i}
			<rect x="150" y={62 + i * 66} width="500" height="50" rx="10" fill={here ? '#143a2a' : '#10261c'} stroke="#2c6a4c" stroke-opacity={here ? 1 : 0.35} />
			<rect x="172" y={80 + i * 66} width={150 + ((i * 53) % 110)} height="14" rx="7" fill="#eafff3" opacity={here ? 0.9 : 0.3} />
			{#if here}
				<circle cx="616" cy={87 + i * 66} r="13" fill="#4ec78f" />
				<path d="M609 {87 + i * 66} l5 5 l9 -10" fill="none" stroke="#0b1f17" stroke-width="3" stroke-linecap="round" />
			{:else}
				<circle cx="616" cy={87 + i * 66} r="12" fill="none" stroke="#4ec78f" stroke-opacity="0.4" stroke-dasharray="3 4" />
			{/if}
		{/each}
	{:else if id === 'spiritwind'}
		<rect width="800" height="500" fill="#efe6d6" />
		<rect x="120" y="70" width="330" height="390" rx="14" fill="#fffaf0" stroke="#2a2118" stroke-opacity="0.2" />
		<rect x="150" y="104" width="150" height="16" rx="8" fill="#2a2118" />
		<rect x="150" y="140" width="270" height="110" rx="8" fill="#d9c7a6" />
		{#each [0, 1, 2, 3] as i}<rect x="150" y={276 + i * 26} width={250 - i * 34} height="10" rx="5" fill="#2a2118" opacity="0.25" />{/each}
		<g class="mono" fill="#2a2118">
			<rect x="490" y="120" width="230" height="230" rx="14" fill="#2a2118" />
			<text x="514" y="164" fill="#efe6d6">{'{'}</text>
			<text x="534" y="198" fill="#f2b56b">"event":</text>
			<text x="534" y="228" fill="#efe6d6">"Sunday",</text>
			<text x="534" y="262" fill="#f2b56b">"time":</text>
			<text x="534" y="292" fill="#efe6d6">"9:00"</text>
			<text x="514" y="326" fill="#efe6d6">{'}'}</text>
		</g>
		<path class="draw" d="M490 235 H452" stroke="#2a2118" stroke-width="3" fill="none" />
	{:else if id === 'local-rag'}
		<rect width="800" height="500" fill="#08060f" />
		{#each [0, 1, 2, 3, 4] as i}
			<rect x={90 + i * 14} y={120 + i * 22} width="210" height="150" rx="10" fill="#17122b" stroke="#6b54e0" stroke-opacity={0.25 + i * 0.18} />
		{/each}
		{#each [0, 1, 2, 3] as i}<rect x="170" y={236 + i * 22} width={150 - i * 26} height="8" rx="4" fill="#cfc6ff" opacity="0.7" />{/each}
		<path class="draw" d="M370 250 H470" stroke="#8f7bff" stroke-width="3" fill="none" stroke-dasharray="2 9" stroke-linecap="round" />
		{#each cloud as p}<circle cx={p.x} cy={p.y} r={p.hot ? 6 : 3} fill={p.hot ? '#fff' : '#8f7bff'} opacity={p.hot ? 1 : 0.65} />{/each}
	{:else if id === 'color-stroop'}
		<rect width="800" height="500" fill="#111114" />
		{#each words as w}<text x={w.x} y={w.y} font-size={w.s} fill={w.c} class="word">{w.t}</text>{/each}
	{:else}
		<!-- Typographic plate for projects without their own drawing. -->
		<rect width="800" height="500" fill="#16171b" />
		{#each [0, 1, 2, 3, 4, 5, 6, 7] as i}<line x1={i * 114} x2={i * 114} y1="0" y2="500" stroke="#fff" stroke-opacity="0.07" />{/each}
		<text x="400" y="345" text-anchor="middle" font-size="300" fill="#f4f4f1" class="word">{initials}</text>
		<circle cx="690" cy="96" r="34" fill="#1b3cff" />
	{/if}
</svg>

<style>
	.plate {
		display: block;
		width: 100%;
		height: 100%;
	}
	.mono {
		font-family: var(--mono);
		font-size: 17px;
	}
	.word {
		font-family: var(--sans);
		font-weight: 800;
		letter-spacing: -0.05em;
	}
	.draw {
		stroke-dasharray: 1400;
		stroke-dashoffset: 1400;
		animation: draw 2.6s ease-out 0.3s forwards;
	}
	.local-rag .draw {
		stroke-dasharray: 2 9;
		stroke-dashoffset: 0;
		animation: none;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	:global(html[data-motion='off']) .draw {
		stroke-dashoffset: 0;
	}
	:global(html[data-motion='off']) .token {
		display: none;
	}
</style>
