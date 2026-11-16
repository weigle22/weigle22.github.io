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

	// 53 weeks of days ending on the day the data was fetched, oldest first, starting on a Sunday.
	const grid = (() => {
		if (!github.activity) return null;
		const end = new Date(github.fetchedAt.slice(0, 10) + 'T00:00:00Z');
		const start = new Date(end);
		start.setUTCDate(start.getUTCDate() - 52 * 7 - end.getUTCDay());
		const days: { date: string; n: number; level: number }[] = [];
		let total = 0;
		for (const d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
			const date = d.toISOString().slice(0, 10);
			const n = github.activity[date] ?? 0;
			total += n;
			days.push({ date, n, level: n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 10 ? 3 : 4 });
		}
		return { days, total, active: days.filter((d) => d.n).length };
	})();

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
			<h2 use:words>Real numbers, <em class="serif">refreshed nightly</em></h2>
			<p class="lede" use:rise>
				Pulled from my public GitHub every time this site rebuilds. Most of my work lives in private repositories, so read these as a floor.
			</p>
		</div>

		<div class="stats" use:stagger>
			<div>
				<b>{stat(github.user.publicRepos)}</b>
				<span>Public repositories</span>
			</div>
			<div>
				<b>{stat(github.totalStars)}</b>
				<span><Star size={13} /> Stars across them{#if github.totalStars === null}&nbsp;· unavailable{/if}</span>
			</div>
			<div>
				<b>{stat(github.user.followers)}</b>
				<span><Users size={13} /> Followers{#if github.user.followers === null}&nbsp;· unavailable{/if}</span>
			</div>
			<div>
				<b>{grid ? grid.total : '—'}</b>
				<span><GitCommit size={13} /> Public commits, last 12 months{#if !grid}&nbsp;· unavailable{/if}</span>
			</div>
		</div>

		<div class="heat" use:rise>
			<p class="label">Contribution activity · public commits per day</p>
			{#if grid}
				<div class="scroll">
					<div class="cells" role="img" aria-label="{grid.total} public commits on {grid.active} days in the last 12 months">
						{#each grid.days as d}
							<i data-l={d.level} title="{d.n} commit{d.n === 1 ? '' : 's'} on {dayMonthYear(d.date)}"></i>
						{/each}
					</div>
				</div>
				<div class="legend">
					<span>{monthYear(grid.days[0].date)}</span>
					<span class="scale">Less <i data-l="0"></i><i data-l="1"></i><i data-l="2"></i><i data-l="3"></i><i data-l="4"></i> More</span>
					<span>{monthYear(grid.days[grid.days.length - 1].date)}</span>
				</div>
			{:else}
				<p class="none">GitHub didn’t return commit history for this build, so there is nothing to draw. This is missing data, not zero activity.</p>
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
	.scroll {
		overflow-x: auto;
		margin-top: 14px;
		padding-bottom: 6px;
	}
	.cells {
		display: grid;
		grid-template-rows: repeat(7, 1fr);
		grid-auto-flow: column;
		grid-auto-columns: minmax(11px, 1fr);
		gap: 3px;
		min-width: 720px;
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
		background: #fff;
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
