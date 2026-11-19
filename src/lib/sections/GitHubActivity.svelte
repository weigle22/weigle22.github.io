<script lang="ts">
	import Star from '@lucide/svelte/icons/star';
	import Users from '@lucide/svelte/icons/users';
	import GitCommit from '@lucide/svelte/icons/git-commit-horizontal';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { github } from '#lib/services/github.ts';
	import { site } from '#lib/data/site.ts';
	import { rise, stagger, words } from '#lib/animations/scroll.ts';
	import { dayMonthYear, monthYear } from '#lib/utils/format.ts';

	// Language share: by bytes of code when GitHub gave us that, otherwise by each repository's main language.
	const langs = (() => {
		let rows = github.languages.map((l) => ({ name: l.name, n: l.bytes }));
		let basis = 'by bytes of code';
		if (!rows.length) {
			const count: Record<string, number> = {};
			for (const r of github.repos) if (r.language) count[r.language] = (count[r.language] ?? 0) + 1;
			rows = Object.entries(count).map(([name, n]) => ({ name, n }));
			basis = 'by repository';
		}
		rows.sort((a, b) => b.n - a.n);
		const top = rows.slice(0, 6);
		const rest = rows.slice(6).reduce((s, r) => s + r.n, 0);
		if (rest) top.push({ name: 'Other', n: rest });
		const total = top.reduce((s, r) => s + r.n, 0) || 1;
		return { basis, rows: top.map((r) => ({ ...r, pct: (r.n / total) * 100 })) };
	})();

	// Contribution calendars from 2024, public and private (private work appears as anonymous counts).
	const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const years = (github.contributions ?? []).slice().sort((a, b) => b.year - a.year);
	const sum = (k: 'total' | 'private') => (!years.length || years.some((y) => y[k] === null) ? null : years.reduce((n, y) => n + (y[k] ?? 0), 0));
	const allTotal = sum('total');
	const allPrivate = sum('private');
	const span = years.length ? `${years[years.length - 1].year}–${years[0].year}` : '';
	let pick = $state(years[0]?.year ?? 0);
	const cal = $derived.by(() => {
		const y = years.find((v) => v.year === pick);
		if (!y) return null;
		const last = y.year === Number(github.fetchedAt.slice(0, 4)) ? github.fetchedAt.slice(0, 10) : `${y.year}-12-31`;
		const start = new Date(Date.UTC(y.year, 0, 1));
		start.setUTCDate(start.getUTCDate() - start.getUTCDay()); // back to Sunday
		const end = new Date(Date.UTC(y.year, 11, 31));
		const max = Math.max(1, ...Object.values(y.days));
		const days: { date: string; n: number; level: number; out: boolean }[] = [];
		const months: { label: string; col: number }[] = [];
		let i = 0;
		for (const d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1), i++) {
			const date = d.toISOString().slice(0, 10);
			const out = !date.startsWith(String(y.year)) || date > last;
			const n = out ? 0 : (y.days[date] ?? 0);
			if (d.getUTCDate() === 1 && !out) months.push({ label: MONTHS[d.getUTCMonth()], col: Math.floor(i / 7) + 1 });
			days.push({ date, n, out, level: n === 0 ? 0 : Math.min(4, Math.ceil((n / max) * 4)) });
		}
		return { ...y, days, months, weeks: Math.ceil(days.length / 7), active: days.filter((d) => d.n).length, partial: last.slice(5) !== '12-31' };
	});

	const recent = github.repos.slice(0, 5);
	const stat = (n: number | null) => (n === null ? '—' : String(n));
	const shade = (i: number) => `color-mix(in srgb, var(--ink) ${Math.max(16, 96 - i * 15)}%, var(--surface))`;
</script>

<section id="github" class="dark">
	<div class="wrap">
		<div class="eyebrow">
			<span>GitHub activity</span>
			<span>Fetched {dayMonthYear(github.fetchedAt)}</span>
		</div>
		<div class="head">
			<h2 use:words>Activity, <em class="serif">in context</em></h2>
			<p class="lede" use:rise>
				Supplementary, not a scorecard. The calendar counts public and private contributions; private work shows only as numbers, never
				as repository names or code. The lists below are public projects only. Refreshed from GitHub every night.
			</p>
		</div>

		<div class="stats" use:stagger>
			<div>
				<b>{stat(github.user.publicRepos)}</b>
				<span>Public repositories</span>
			</div>
			<div>
				<b>{allTotal === null ? '—' : allTotal.toLocaleString('en')}</b>
				<span><GitCommit size={13} /> Contributions {span || 'since 2024'}, incl. private{#if allTotal === null}&nbsp;· unavailable{/if}</span>
			</div>
			<div>
				<b>{langs.rows.filter((l) => l.name !== 'Other').length || '—'}</b>
				<span>Languages in public code</span>
			</div>
			<div>
				<b class="date">{recent[0] ? monthYear(recent[0].updatedAt) : '—'}</b>
				<span>Most recent public update</span>
			</div>
		</div>
		<p class="also">
			<Star size={13} /> {github.totalStars === null ? 'stars unavailable' : `${github.totalStars} stars`} · <Users size={13} />
			{github.user.followers === null ? 'followers unavailable' : `${github.user.followers} followers`} · data fetched {dayMonthYear(github.fetchedAt)}
		</p>

		<div class="heat" use:rise>
			<div class="heat-top">
				<p class="label">
					Contribution activity · public and private
					{#if allPrivate !== null}<span> · {allPrivate.toLocaleString('en')} private since {years[years.length - 1].year}</span>{/if}
				</p>
				{#if years.length}
					<div class="years" role="tablist" aria-label="Year">
						{#each years as y}
							<button role="tab" aria-selected={pick === y.year} class:on={pick === y.year} onclick={() => (pick = y.year)}>
								{y.year}<span>{y.total.toLocaleString('en')}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>
			{#if cal}
				<p class="sum">
					<b>{cal.total.toLocaleString('en')}</b> contributions in {cal.year}{cal.partial ? ' so far' : ''}
					{#if cal.private !== null}· {cal.private.toLocaleString('en')} in private repositories{/if}
					{#if cal.commits !== null}· {cal.commits.toLocaleString('en')} public commits{/if}
					· active on {cal.active} days
				</p>
				<div class="scroll" data-lenis-prevent-touch>
					<div class="cal" style:--weeks={cal.weeks}>
						<div class="months" aria-hidden="true">
							{#each cal.months as m}<span style:grid-row="1" style:grid-column="{m.col} / span 4">{m.label}</span>{/each}
						</div>
						<div class="dow" aria-hidden="true"><span></span><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span></div>
						<div class="cells" role="img" aria-label="{cal.total} contributions on {cal.active} days in {cal.year}">
							{#each cal.days as d}
								{#if d.out}<i class="out"></i>{:else}<i data-l={d.level} title="{d.n || 'No'} contribution{d.n === 1 ? '' : 's'} on {dayMonthYear(d.date)}"></i>{/if}
							{/each}
						</div>
					</div>
				</div>
				<div class="legend">
					<span>Private contributions are counted, not shown.</span>
					<span class="scale">Less <i data-l="0"></i><i data-l="1"></i><i data-l="2"></i><i data-l="3"></i><i data-l="4"></i> More</span>
				</div>
			{:else}
				<p class="none">GitHub didn’t return contribution data for this build, so there is nothing to draw. This is missing data, not zero activity.</p>
			{/if}
		</div>

		<div class="cols">
			<div use:rise>
				<p class="label">Most-used languages · {langs.basis}</p>
				{#if langs.rows.length}
					<div class="bar" role="img" aria-label={langs.rows.map((l) => `${l.name} ${l.pct.toFixed(0)}%`).join(', ')}>
						{#each langs.rows as l, i}<span style:flex={l.n} style:background={shade(i)}></span>{/each}
					</div>
					<ul class="langs">
						{#each langs.rows as l, i}
							<li><i style:background={shade(i)}></i>{l.name}<span>{l.pct.toFixed(0)}%</span></li>
						{/each}
					</ul>
				{:else}
					<p class="none">Language data unavailable.</p>
				{/if}

				<p class="label gap">Recently updated</p>
				<ul class="rows">
					{#each recent as r}
						<li>
							<a class="u" href={r.url} rel="noopener">{r.name}</a>
							<span>{r.language ?? '—'} · {monthYear(r.updatedAt)}</span>
						</li>
					{/each}
				</ul>
			</div>

			<div use:rise>
				<p class="label">Latest public commits</p>
				{#if github.commits.length}
					<ul class="rows commits">
						{#each github.commits.slice(0, 6) as c}
							<li>
								<a href={c.url} rel="noopener">
									<span class="msg">{c.message}</span>
									<span class="meta mono">{c.repo} · {c.sha} · {dayMonthYear(c.date)}</span>
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="none">No public commits in the last 12 months, or GitHub didn’t return any.</p>
				{/if}
				<a class="pill all" href="https://github.com/{site.githubUsername}" rel="noopener">Open my GitHub <ArrowUpRight size={16} /></a>
			</div>
		</div>
	</div>
</section>

<style>
	.head {
		display: grid;
		grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
		gap: 32px;
		align-items: end;
	}
	.head .lede {
		margin: 0 0 8px;
	}
	.stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 20px;
		margin-top: clamp(48px, 7vw, 96px);
	}
	.stats div {
		border-top: 1px solid var(--line);
		padding-top: 16px;
		display: grid;
		gap: 10px;
	}
	.stats b.date {
		font-size: clamp(34px, 4.6vw, 64px);
		line-height: 1.1;
	}
	.also {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		margin-top: 18px;
		font-size: 13px;
		color: var(--muted);
	}
	.stats b {
		font-size: clamp(52px, 8vw, 120px);
		line-height: 0.9;
		font-weight: 600;
		letter-spacing: -0.05em;
		font-variant-numeric: tabular-nums;
	}
	.stats span {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		color: var(--muted);
		font-size: 14px;
	}
	.heat {
		margin-top: clamp(48px, 6vw, 80px);
	}
	.heat-top {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 12px 24px;
	}
	.heat-top .label span {
		color: var(--muted);
	}
	.years {
		display: flex;
		gap: 6px;
	}
	.years button {
		display: inline-flex;
		align-items: baseline;
		gap: 8px;
		padding: 7px 14px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: transparent;
		color: var(--ink);
		font: inherit;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: border-color 0.25s, background 0.25s, color 0.25s;
	}
	.years button span {
		font-weight: 400;
		font-size: 12px;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}
	.years button:hover {
		border-color: var(--accent);
	}
	.years button.on {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--surface);
	}
	.years button.on span {
		color: color-mix(in srgb, var(--surface) 70%, transparent);
	}
	.sum {
		margin-top: 18px;
		font-size: 15px;
		color: var(--muted);
	}
	.sum b {
		color: var(--ink);
		font-size: 20px;
		font-variant-numeric: tabular-nums;
	}
	.scroll {
		overflow-x: auto;
		margin-top: 14px;
		padding-bottom: 6px;
	}
	.cal {
		display: grid;
		grid-template-columns: 30px minmax(0, 1fr);
		grid-template-rows: auto auto;
		column-gap: 6px;
		row-gap: 6px;
		min-width: 760px;
	}
	.months {
		grid-column: 2;
		display: grid;
		grid-template-columns: repeat(var(--weeks), minmax(0, 1fr));
		gap: 3px;
		font-size: 11px;
		color: var(--muted);
	}
	.dow {
		grid-row: 2;
		display: grid;
		grid-template-rows: repeat(7, minmax(0, 1fr));
		gap: 3px;
		font-size: 10px;
		color: var(--muted);
		align-items: center;
	}
	.cells {
		grid-row: 2;
		grid-column: 2;
		display: grid;
		grid-template-rows: repeat(7, 1fr);
		grid-template-columns: repeat(var(--weeks), minmax(0, 1fr));
		grid-auto-flow: column;
		gap: 3px;
	}
	.cells i.out {
		visibility: hidden;
	}
	.cells i,
	.scale i {
		aspect-ratio: 1;
		border-radius: 3px;
		background: var(--paper);
		border: 1px solid var(--line);
	}
	i[data-l='1'] {
		background: color-mix(in srgb, var(--glow-a) 55%, var(--paper));
		border-color: transparent;
	}
	i[data-l='2'] {
		background: var(--glow-a);
		border-color: transparent;
	}
	i[data-l='3'] {
		background: var(--glow-b);
		border-color: transparent;
	}
	i[data-l='4'] {
		background: var(--glow-c);
		border-color: transparent;
	}
	.legend {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 10px;
		font-size: 12px;
		color: var(--muted);
	}
	.scale {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.scale i {
		width: 11px;
	}
	.none {
		margin-top: 14px;
		color: var(--muted);
		max-width: 60ch;
	}
	.cols {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(32px, 6vw, 96px);
		margin-top: clamp(48px, 6vw, 80px);
	}
	.bar {
		display: flex;
		gap: 2px;
		height: 14px;
		border-radius: 4px;
		overflow: hidden;
		margin-top: 14px;
	}
	.langs {
		list-style: none;
		padding: 0;
		margin: 14px 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 8px 18px;
		font-size: 14px;
	}
	.langs li {
		display: flex;
		align-items: center;
		gap: 7px;
	}
	.langs i {
		width: 10px;
		height: 10px;
		border-radius: 2px;
	}
	.langs span {
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}
	.gap {
		margin-top: 44px;
	}
	.rows {
		list-style: none;
		padding: 0;
		margin: 8px 0 0;
	}
	.rows li {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 0;
		border-bottom: 1px solid var(--line);
		font-size: 15px;
	}
	.rows li > a {
		font-weight: 500;
		overflow-wrap: anywhere;
	}
	.rows li > span {
		font-size: 13px;
		color: var(--muted);
		white-space: nowrap;
	}
	.commits a {
		display: grid;
		gap: 3px;
		text-decoration: none;
		min-width: 0;
	}
	.commits a:hover .msg {
		color: var(--accent);
	}
	.msg {
		font-weight: 500;
		transition: color 0.3s;
		overflow-wrap: anywhere;
	}
	.meta {
		font-size: 11.5px;
		color: var(--muted);
	}
	.all {
		margin-top: 28px;
	}
	@media (max-width: 820px) {
		.head,
		.cols {
			grid-template-columns: 1fr;
		}
		.stats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
