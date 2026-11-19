<script lang="ts">
	import { flip } from 'svelte/animate';
	import { reduced } from '#lib/utils/motion.ts';

	// A query you build with clicks. The SQL is written out live and "run" in the browser against
	// three small mock tables. No server, no real data.
	const departments = [
		{ id: 1, name: 'Human Resources' },
		{ id: 2, name: 'Procurement' },
		{ id: 3, name: 'Information Technology' },
		{ id: 4, name: 'Accounting' }
	];
	const employees = [
		{ id: 101, name: 'Ana Reyes', dept: 1 },
		{ id: 102, name: 'Ben Santos', dept: 2 },
		{ id: 103, name: 'Carla Diaz', dept: 3 },
		{ id: 104, name: 'Dan Cruz', dept: 3 },
		{ id: 105, name: 'Ella Lim', dept: 4 },
		{ id: 106, name: 'Fe Garcia', dept: 2 },
		{ id: 107, name: 'Gio Tan', dept: 1 },
		{ id: 108, name: 'Hana Uy', dept: 4 }
	];
	const leaves = [
		{ id: 4801, emp: 103, type: 'Vacation', days: 3, status: 'Posted' },
		{ id: 4802, emp: 101, type: 'Sick', days: 1, status: 'Posted' },
		{ id: 4803, emp: 106, type: 'Vacation', days: 5, status: 'Recommended' },
		{ id: 4804, emp: 104, type: 'Special', days: 2, status: 'Submitted' },
		{ id: 4805, emp: 102, type: 'Vacation', days: 4, status: 'Approved' },
		{ id: 4806, emp: 108, type: 'Sick', days: 2, status: 'Posted' },
		{ id: 4807, emp: 105, type: 'Vacation', days: 10, status: 'Draft' },
		{ id: 4808, emp: 107, type: 'Special', days: 1, status: 'Approved' },
		{ id: 4809, emp: 103, type: 'Sick', days: 2, status: 'Submitted' },
		{ id: 4810, emp: 101, type: 'Vacation', days: 6, status: 'Recommended' },
		{ id: 4811, emp: 104, type: 'Vacation', days: 3, status: 'Posted' },
		{ id: 4812, emp: 106, type: 'Sick', days: 1, status: 'Draft' }
	];
	const STATUSES = ['Draft', 'Submitted', 'Recommended', 'Approved', 'Posted'];

	let join = $state(true);
	let dept = $state(0);
	let status = $state('');
	let minDays = $state(1);
	let orderBy = $state<'id' | 'days' | 'name'>('id');
	let desc = $state(false);
	let grouped = $state(false);

	const deptName = (id: number) => departments.find((d) => d.id === id)?.name ?? '';
	const emp = (id: number) => employees.find((e) => e.id === id)!;

	// Turning off the join means the department filter and name sort have nothing to work with.
	$effect(() => {
		if (!join) {
			dept = 0;
			grouped = false;
			if (orderBy === 'name') orderBy = 'id';
		}
	});

	const rows = $derived.by(() => {
		let r = leaves
			.map((l) => ({ ...l, name: emp(l.emp).name, deptId: emp(l.emp).dept, department: deptName(emp(l.emp).dept) }))
			.filter((l) => (!dept || l.deptId === dept) && (!status || l.status === status) && l.days >= minDays);
		const dir = desc ? -1 : 1;
		r = [...r].sort((a, b) => (orderBy === 'name' ? a.name.localeCompare(b.name) : a[orderBy] - b[orderBy]) * dir);
		return r;
	});

	const groups = $derived.by(() => {
		const m = new Map<string, { department: string; requests: number; days: number }>();
		for (const r of rows) {
			const g = m.get(r.department) ?? { department: r.department, requests: 0, days: 0 };
			g.requests += 1;
			g.days += r.days;
			m.set(r.department, g);
		}
		return [...m.values()].sort((a, b) => (desc ? -1 : 1) * (b.days - a.days));
	});

	type Tok = { t: string; k?: 'kw' | 'str' | 'num' | 'fn' };
	const sql = $derived.by(() => {
		const L: Tok[][] = [];
		const kw = (t: string): Tok => ({ t, k: 'kw' });
		if (grouped) {
			L.push([kw('SELECT'), { t: ' d.Name, ' }, { t: 'COUNT', k: 'fn' }, { t: '(*) AS Requests, ' }, { t: 'SUM', k: 'fn' }, { t: '(l.Days) AS Days' }]);
		} else if (join) {
			L.push([kw('SELECT'), { t: ' l.Id, e.Name, d.Name, l.Type, l.Days, l.Status' }]);
		} else {
			L.push([kw('SELECT'), { t: ' l.Id, l.EmployeeId, l.Type, l.Days, l.Status' }]);
		}
		L.push([kw('FROM'), { t: ' LeaveRequests l' }]);
		if (join) {
			L.push([kw('JOIN'), { t: ' Employees e ' }, kw('ON'), { t: ' e.Id = l.EmployeeId' }]);
			L.push([kw('JOIN'), { t: ' Departments d ' }, kw('ON'), { t: ' d.Id = e.DepartmentId' }]);
		}
		const where: Tok[][] = [[{ t: 'l.Days >= ' }, { t: String(minDays), k: 'num' }]];
		if (dept) where.push([{ t: 'd.Id = ' }, { t: String(dept), k: 'num' }]);
		if (status) where.push([{ t: 'l.Status = ' }, { t: `'${status}'`, k: 'str' }]);
		where.forEach((w, i) => L.push([kw(i === 0 ? 'WHERE' : '  AND'), { t: ' ' }, ...w]));
		if (grouped) {
			L.push([kw('GROUP BY'), { t: ' d.Name' }]);
			L.push([kw('ORDER BY'), { t: ' Days ' }, kw(desc ? 'DESC' : 'ASC')]);
		} else {
			L.push([kw('ORDER BY'), { t: ` ${orderBy === 'id' ? 'l.Id' : orderBy === 'days' ? 'l.Days' : 'e.Name'} ` }, kw(desc ? 'DESC' : 'ASC')]);
		}
		return L;
	});

	const ms = (n: number) => (reduced() ? 0 : n);
</script>

<div class="sqldemo">
	<div class="schema" aria-label="Tables and relationships">
		<div class="tbl"><b>Departments</b><span>Id · Name</span></div>
		<span class="rel" class:off={!join}>1 ─ ∞</span>
		<div class="tbl"><b>Employees</b><span>Id · Name · DepartmentId</span></div>
		<span class="rel" class:off={!join}>1 ─ ∞</span>
		<div class="tbl main"><b>LeaveRequests</b><span>Id · EmployeeId · Type · Days · Status</span></div>
	</div>

	<div class="controls">
		<label class="toggle"><input type="checkbox" bind:checked={join} /> Join employees and departments</label>
		<label class="toggle" class:disabled={!join}><input type="checkbox" bind:checked={grouped} disabled={!join} /> Group by department</label>
		<label>
			<span>Department</span>
			<select bind:value={dept} disabled={!join}>
				<option value={0}>Any</option>
				{#each departments as d}<option value={d.id}>{d.name}</option>{/each}
			</select>
		</label>
		<label>
			<span>Status</span>
			<select bind:value={status}>
				<option value="">Any</option>
				{#each STATUSES as s}<option>{s}</option>{/each}
			</select>
		</label>
		<label>
			<span>At least {minDays} day{minDays === 1 ? '' : 's'}</span>
			<input type="range" min="1" max="10" bind:value={minDays} />
		</label>
		<label>
			<span>Order by</span>
			<div class="order">
				<select bind:value={orderBy} disabled={grouped}>
					<option value="id">Id</option>
					<option value="days">Days</option>
					{#if join}<option value="name">Employee</option>{/if}
				</select>
				<button type="button" onclick={() => (desc = !desc)} aria-label="Sort direction: {desc ? 'descending' : 'ascending'}">{desc ? '↓ DESC' : '↑ ASC'}</button>
			</div>
		</label>
	</div>

	<pre class="sql" aria-label="Generated SQL"><code>{#each sql as line}{#each line as tok}<span class={tok.k}>{tok.t}</span>{/each}{'\n'}{/each}</code></pre>

	<div class="result" aria-live="polite">
		<p class="meta">{grouped ? groups.length : rows.length} row{(grouped ? groups.length : rows.length) === 1 ? '' : 's'} · simulated in your browser with mock data</p>
		<div class="scroll" data-lenis-prevent>
			{#if grouped}
				<table>
					<thead><tr><th>Department</th><th class="n">Requests</th><th class="n">Days</th></tr></thead>
					<tbody>
						{#each groups as g (g.department)}
							<tr animate:flip={{ duration: ms(300) }}><td>{g.department}</td><td class="n">{g.requests}</td><td class="n">{g.days}</td></tr>
						{/each}
					</tbody>
				</table>
			{:else if rows.length}
				<table>
					<thead>
						<tr>
							<th class="n">Id</th>
							{#if join}<th>Employee</th><th>Department</th>{:else}<th class="n">EmployeeId</th>{/if}
							<th>Type</th><th class="n">Days</th><th>Status</th>
						</tr>
					</thead>
					<tbody>
						{#each rows as r (r.id)}
							<tr animate:flip={{ duration: ms(300) }}>
								<td class="n">{r.id}</td>
								{#if join}<td>{r.name}</td><td>{r.department}</td>{:else}<td class="n">{r.emp}</td>{/if}
								<td>{r.type}</td><td class="n">{r.days}</td><td><span class="st {r.status.toLowerCase()}">{r.status}</span></td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<p class="empty">No rows match. Loosen a filter: try “Any” status or fewer days.</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.sqldemo {
		display: grid;
		/* minmax(0, …) lets the results table scroll inside its box instead of widening the page. */
		grid-template-columns: minmax(0, 1fr);
		gap: 16px;
		min-width: 0;
	}
	.schema {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px 8px;
		font-size: 12px;
	}
	.tbl {
		display: grid;
		padding: 6px 10px;
		border: 1px solid var(--line);
		border-radius: 8px;
		background: var(--surface);
	}
	.tbl.main {
		border-color: var(--accent);
	}
	.tbl b {
		font-size: 12.5px;
	}
	.tbl span {
		font-family: var(--mono);
		font-size: 10.5px;
		color: var(--muted);
	}
	.rel {
		font-family: var(--mono);
		font-size: 11px;
		color: var(--accent);
		transition: opacity 0.2s;
	}
	.rel.off {
		opacity: 0.25;
		text-decoration: line-through;
	}
	.controls {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 12px;
		align-items: end;
	}
	label {
		display: grid;
		gap: 5px;
		font-size: 13px;
	}
	label > span {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.toggle {
		display: flex;
		align-items: center;
		gap: 8px;
		grid-column: span 2;
		font-size: 14px;
	}
	.toggle.disabled {
		opacity: 0.45;
	}
	select,
	.order button {
		font: inherit;
		font-size: 14px;
		color: inherit;
		height: 36px;
		padding: 0 10px;
		border: 1px solid var(--line);
		border-radius: 8px;
		background: var(--surface);
		min-width: 0;
		width: 100%;
	}
	select:disabled {
		opacity: 0.45;
	}
	input[type='range'],
	input[type='checkbox'] {
		accent-color: var(--accent);
	}
	.order {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 6px;
	}
	.order button {
		width: auto;
		font-family: var(--mono);
		font-size: 12px;
		cursor: pointer;
	}
	.sql {
		margin: 0;
		padding: 14px 16px;
		border-radius: 12px;
		background: #0b0a10;
		color: #e6e3ef;
		font-family: var(--mono);
		font-size: 12.5px;
		line-height: 1.7;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.sql .kw {
		color: #c9a2ff;
		font-weight: 600;
	}
	.sql .str {
		color: #f2b56b;
	}
	.sql .num {
		color: #7fd8a6;
	}
	.sql .fn {
		color: #5fb3ff;
	}
	.meta {
		font-size: 12px;
		color: var(--muted);
		margin-bottom: 8px;
	}
	.scroll {
		max-width: 100%;
		overflow-x: auto;
		max-height: 320px;
		overflow-y: auto;
		border: 1px solid var(--line);
		border-radius: 10px;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13.5px;
		min-width: 480px;
	}
	th {
		position: sticky;
		top: 0;
		background: var(--surface);
		text-align: left;
		font-family: var(--mono);
		font-size: 10.5px;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
		padding: 8px 10px;
		border-bottom: 1px solid var(--line);
	}
	td {
		padding: 7px 10px;
		border-bottom: 1px solid var(--line);
	}
	.n {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.st {
		font-size: 11.5px;
		padding: 2px 8px;
		border-radius: 999px;
		background: var(--surface);
		border: 1px solid var(--line);
	}
	.st.posted {
		border-color: var(--ok);
		color: var(--ok);
	}
	.st.approved {
		border-color: var(--accent);
		color: var(--accent);
	}
	.empty {
		padding: 28px 16px;
		color: var(--muted);
		text-align: center;
	}
	@media (max-width: 520px) {
		.toggle {
			grid-column: 1 / -1;
		}
	}
</style>
