<script lang="ts">
	import type { DiagramEdge, DiagramNode } from '#lib/data/types.ts';

	// A layered architecture diagram drawn from data. Boxes are real buttons (keyboard and screen
	// reader friendly); the connecting lines are a decorative SVG layer underneath them.
	let { nodes, edges, caption }: { nodes: DiagramNode[]; edges: DiagramEdge[]; caption: string } = $props();

	const KIND: Record<NonNullable<DiagramNode['kind']>, string> = {
		client: 'Client',
		service: 'Service',
		native: 'Native',
		data: 'Data',
		external: 'External'
	};

	const rows = $derived(Math.max(...nodes.map((n) => n.row)) + 1);

	/** x centre and width in % of the diagram; y in row units (each row is 10 units tall). */
	const layout = $derived.by(() => {
		const out: Record<string, { x: number; w: number; row: number }> = {};
		for (let r = 0; r < rows; r++) {
			const inRow = nodes.filter((n) => n.row === r);
			const w = inRow.length === 1 ? 44 : inRow.length === 2 ? 40 : 29;
			inRow.forEach((n, i) => (out[n.id] = { x: ((i + 0.5) / inRow.length) * 100, w, row: r }));
		}
		return out;
	});

	const paths = $derived(
		edges
			.filter((e) => layout[e.from] && layout[e.to])
			.map((e) => {
				let a = layout[e.from];
				let b = layout[e.to];
				if (a.row === b.row) {
					const left = a.x < b.x ? a : b;
					const right = a.x < b.x ? b : a;
					const y = a.row * 10 + 5;
					const x1 = left.x + left.w / 2;
					const x2 = right.x - right.w / 2;
					return { ...e, d: `M ${x1} ${y} L ${x2} ${y}`, mx: (x1 + x2) / 2, my: y };
				}
				if (a.row > b.row) [a, b] = [b, a];
				const y1 = a.row * 10 + 7.6;
				const y2 = b.row * 10 + 2.4;
				const mid = (y1 + y2) / 2;
				return { ...e, d: `M ${a.x} ${y1} C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${y2}`, mx: (a.x + b.x) / 2, my: mid };
			})
	);

	let active = $state<string | null>(null);
	let pinned = $state<string | null>(null);
	const focus = $derived(active ?? pinned);
	const current = $derived(nodes.find((n) => n.id === focus) ?? null);
	const linked = $derived(
		new Set(focus ? edges.filter((e) => e.from === focus || e.to === focus).flatMap((e) => [e.from, e.to]) : [])
	);
	const name = (id: string) => nodes.find((n) => n.id === id)?.label ?? id;
	const connections = (id: string) =>
		edges.filter((e) => e.from === id || e.to === id).map((e) => (e.from === id ? `→ ${name(e.to)}` : `← ${name(e.from)}`) + (e.label ? ` (${e.label})` : ''));
</script>

<div class="arch">
<figure>
	<div class="canvas" style:--rows={rows}>
		<svg viewBox="0 0 100 {rows * 10}" preserveAspectRatio="none" aria-hidden="true">
			{#each paths as p}
				<path d={p.d} class:lit={focus && (p.from === focus || p.to === focus)} class:dim={focus && p.from !== focus && p.to !== focus} />
			{/each}
		</svg>

		{#each paths as p}
			{#if p.label}
				<span class="elabel" style:left="{p.mx}%" style:top="calc({p.my / 10} * var(--row))" class:dim={focus && p.from !== focus && p.to !== focus}>{p.label}</span>
			{/if}
		{/each}

		{#each nodes as n}
			{@const l = layout[n.id]}
			<button
				class="node {n.kind ?? 'service'}"
				class:on={focus === n.id}
				class:near={focus && focus !== n.id && linked.has(n.id)}
				class:dim={focus && !linked.has(n.id) && focus !== n.id}
				style:left="{l.x}%"
				style:width="{l.w}%"
				style:top="calc({l.row} * var(--row) + var(--row) * 0.24)"
				aria-pressed={pinned === n.id}
				onmouseenter={() => (active = n.id)}
				onmouseleave={() => (active = null)}
				onfocus={() => (active = n.id)}
				onblur={() => (active = null)}
				onclick={() => (pinned = pinned === n.id ? null : n.id)}
			>
				<span class="kind">{KIND[n.kind ?? 'service']}</span>
				<span class="lbl">{n.label}</span>
			</button>
		{/each}
	</div>

	<figcaption aria-live="polite">
		{#if current}
			<b>{current.label}</b>
			<span>{current.detail}</span>
			{#if connections(current.id).length}<span class="conn">{connections(current.id).join(' · ')}</span>{/if}
		{:else}
			<span>{caption}</span>
			<span class="hint">Hover, tap or tab to a box to see what it does.</span>
		{/if}
	</figcaption>
</figure>

	<details>
		<summary>Read the diagram as text</summary>
		<ul>
			{#each nodes as n}
				<li><b>{n.label}</b> ({KIND[n.kind ?? 'service']}): {n.detail} {#if connections(n.id).length}<em>{connections(n.id).join('; ')}</em>{/if}</li>
			{/each}
		</ul>
	</details>
</div>

<style>
	figure {
		margin: 0;
	}
	.canvas {
		--row: clamp(104px, 13vw, 132px);
		position: relative;
		height: calc(var(--rows) * var(--row));
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background:
			radial-gradient(circle at 1px 1px, var(--line) 1px, transparent 0) 0 0 / 20px 20px,
			var(--paper);
	}
	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	path {
		fill: none;
		stroke: var(--muted);
		stroke-width: 1.5;
		vector-effect: non-scaling-stroke;
		stroke-dasharray: 4 4;
		transition: stroke 0.25s, opacity 0.25s;
	}
	path.lit {
		stroke: var(--accent);
		stroke-width: 2;
		stroke-dasharray: none;
	}
	path.dim {
		opacity: 0.25;
	}
	.elabel {
		position: absolute;
		transform: translate(-50%, -50%);
		font-family: var(--mono);
		font-size: 10.5px;
		padding: 2px 7px;
		border-radius: 999px;
		background: var(--surface);
		border: 1px solid var(--line);
		color: var(--muted);
		white-space: nowrap;
		z-index: 1;
		transition: opacity 0.25s;
	}
	.elabel.dim {
		opacity: 0.3;
	}
	.node {
		position: absolute;
		transform: translateX(-50%);
		height: calc(var(--row) * 0.52);
		z-index: 2;
		display: grid;
		align-content: center;
		gap: 3px;
		padding: 6px 10px;
		border-radius: 12px;
		border: 1px solid var(--line);
		background: var(--surface);
		text-align: center;
		cursor: pointer;
		transition: border-color 0.25s, background 0.25s, opacity 0.25s, transform 0.25s var(--ease);
	}
	.node:hover,
	.node.on {
		border-color: var(--accent);
		transform: translateX(-50%) translateY(-2px);
	}
	.node.on {
		background: var(--accent-soft);
	}
	.node.near {
		border-color: color-mix(in srgb, var(--accent) 55%, var(--line));
	}
	.node.dim {
		opacity: 0.4;
	}
	.node.client {
		border-top: 3px solid var(--accent);
	}
	.node.native {
		border-style: dashed;
	}
	.node.data {
		border-radius: 12px 12px 22px 22px;
	}
	.node.external {
		background: var(--paper);
	}
	.kind {
		font-family: var(--mono);
		font-size: 9.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.lbl {
		font-size: clamp(11.5px, 1.35vw, 14.5px);
		font-weight: 600;
		line-height: 1.2;
		overflow-wrap: anywhere;
	}
	figcaption {
		display: grid;
		gap: 4px;
		margin-top: 14px;
		min-height: 4.5em;
		font-size: 15px;
		line-height: 1.45;
	}
	figcaption b {
		font-size: 17px;
	}
	figcaption span {
		color: var(--muted);
	}
	.conn {
		font-family: var(--mono);
		font-size: 12px;
	}
	.hint {
		font-size: 13px;
	}
	details {
		margin-top: 8px;
		font-size: 14px;
	}
	summary {
		cursor: pointer;
		color: var(--muted);
		padding: 6px 0;
	}
	details ul {
		margin: 8px 0 0;
		padding-left: 18px;
		display: grid;
		gap: 6px;
		color: var(--muted);
	}
	details b {
		color: var(--ink);
	}
	details em {
		font-style: normal;
		font-family: var(--mono);
		font-size: 12px;
	}
	@media (max-width: 560px) {
		.node {
			padding: 4px 5px;
			border-radius: 9px;
		}
		.kind {
			display: none;
		}
		.elabel {
			font-size: 9.5px;
			padding: 1px 5px;
		}
	}
</style>
