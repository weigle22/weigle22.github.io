import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, signal } from '@angular/core';

export interface TechNode {
  name: string;
  category: string;
  description: string;
  /** 'Production' | 'Maintenance' | 'Independent' */
  use: string[];
}

const USE_LABEL: Record<string, string> = {
  Production: 'Built new at work',
  Maintenance: 'Maintained at work',
  Independent: 'Independent projects',
};
export interface TechProject {
  id: string;
  title: string;
  technologies: string[];
}
export interface ConstellationData {
  technologies: TechNode[];
  projects: TechProject[];
}

interface Placed extends TechNode {
  x: number;
  y: number;
  anchor: 'start' | 'end' | 'middle';
  lx: number;
  ly: number;
}

const W = 1200;
const H = 780;

@Component({
  selector: 'tech-constellation-root',
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chips uses" role="group" aria-label="Filter by how it was used">
      <button [class.on]="use() === null" (click)="pickUse(null)">Any use</button>
      @for (u of uses; track u) {
        <button [class.on]="use() === u" [attr.aria-pressed]="use() === u" (click)="pickUse(u)"><i [class]="'dot ' + u.toLowerCase()"></i>{{ useLabel(u) }}</button>
      }
    </div>
    <div class="chips" role="group" aria-label="Filter by category">
      <button [class.on]="category() === null" (click)="pickCategory(null)">All</button>
      @for (c of categories(); track c) {
        <button [class.on]="category() === c" (click)="pickCategory(c)">{{ c }}</button>
      }
    </div>

    <div class="stage">
      <div class="scroller"><svg [attr.viewBox]="'0 0 ' + W + ' ' + H" role="group" aria-label="Technology constellation. Each star is a technology; lines join technologies used together in a project.">
        @for (e of edges(); track e.key) {
          <line [attr.x1]="e.a.x" [attr.y1]="e.a.y" [attr.x2]="e.b.x" [attr.y2]="e.b.y" [class.lit]="isEdgeLit(e)" [class.dim]="isEdgeDim(e)" />
        }
        @for (c of clusters(); track c.name) {
          <text class="cluster" [attr.x]="c.x" [attr.y]="c.y" text-anchor="middle" [class.dim]="category() !== null && category() !== c.name">{{ c.name }}</text>
        }
        @for (n of nodes(); track n.name) {
          <g class="node" tabindex="0" role="button" [attr.aria-pressed]="selected() === n.name" [attr.aria-label]="n.name + ', ' + n.category"
             [class.sel]="selected() === n.name" [class.near]="isNear(n)" [class.dim]="isDim(n)"
             (click)="pick(n.name)" (keydown.enter)="pick(n.name)" (keydown.space)="pick(n.name); $event.preventDefault()"
             (mouseenter)="hover.set(n.name)" (mouseleave)="hover.set(null)">
            <circle class="hit" [attr.cx]="n.x" [attr.cy]="n.y" r="20" />
            <circle class="halo" [attr.cx]="n.x" [attr.cy]="n.y" r="13" />
            <circle class="star" [class.indie]="!atWork(n)" [attr.cx]="n.x" [attr.cy]="n.y" [attr.r]="4 + degree(n.name) * 0.45" />
            <text [attr.x]="n.lx" [attr.y]="n.ly" [attr.text-anchor]="n.anchor">{{ n.name }}</text>
          </g>
        }
      </svg></div>

      <!-- Small screens get tappable chips instead of a shrunken star map. -->
      <div class="compact" role="group" aria-label="Technologies">
        @for (n of nodes(); track n.name) {
          @if (passes(n)) {
            <button [class.on]="selected() === n.name" [class.near]="isNear(n)" [attr.aria-pressed]="selected() === n.name" (click)="pick(n.name)">{{ n.name }}</button>
          }
        }
      </div>

      <aside class="panel" aria-live="polite">
        @if (active(); as t) {
          <p class="cat">{{ t.category }}</p>
          <h3>{{ t.name }}</h3>
          <p class="badges">
            @for (u of t.use; track u) { <span [class]="'badge ' + u.toLowerCase()">{{ useLabel(u) }}</span> }
          </p>
          <p class="desc">{{ t.description }}</p>
          <p class="cat">Used in</p>
          <ul>
            @for (p of projectsFor(t.name); track p.id) {
              <li><a [attr.href]="'/projects/' + p.id + '/'">{{ p.title }} <span aria-hidden="true">↗</span></a></li>
            }
          </ul>
          <p class="cat">Works with</p>
          <p class="with">
            @for (n of neighbours(t.name); track n) {
              <button (click)="pick(n)">{{ n }}</button>
            }
          </p>
        } @else {
          <p class="cat">How to read this</p>
          <h3>Pick a star.</h3>
          <p class="desc">Each star is a technology I use. A line joins two that worked together in a real project. Bigger stars are in more of them.</p>
          <p class="legend"><span><i class="lg solid"></i>Used at work</span><span><i class="lg hollow"></i>Independent projects only</span></p>
          <p class="cat">{{ nodes().length }} technologies · {{ edges().length }} links</p>
        }
      </aside>
    </div>
  `,
  styles: `
    :host { display: block; color: var(--ink, #f4f4f1); font: inherit; }
    button { font: inherit; color: inherit; cursor: pointer; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
    .chips button, .with button { padding: 7px 14px; border-radius: 999px; border: 1px solid var(--line, #25262c);
      background: transparent; font-size: 13px; transition: background .25s, color .25s, border-color .25s; }
    .chips button:hover, .with button:hover { border-color: var(--ink, #fff); }
    .chips button.on { background: var(--ink, #f4f4f1); color: var(--surface, #050506); border-color: var(--ink, #f4f4f1); }
    .stage { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 24px; align-items: start; }
    svg { width: 100%; height: auto; overflow: visible; display: block; }
    line { stroke: var(--ink, #fff); stroke-opacity: .1; stroke-width: 1; transition: stroke-opacity .35s, stroke .35s; }
    line.lit { stroke: var(--accent, #c9a2ff); stroke-opacity: .9; stroke-width: 1.5; }
    line.dim { stroke-opacity: .03; }
    .cluster { font-family: var(--mono, monospace); font-size: 12px; letter-spacing: .12em; text-transform: uppercase;
      fill: var(--muted, #8b8d96); transition: opacity .35s; }
    .cluster.dim { opacity: .25; }
    .node { cursor: pointer; outline: none; transition: opacity .35s; }
    .node text { font-size: 15px; fill: var(--ink, #fff); fill-opacity: .82; transition: fill-opacity .25s; }
    .hit { fill: transparent; }
    .star { fill: var(--ink, #fff); transition: fill .25s; }
    .halo { fill: none; stroke: var(--accent, #c9a2ff); stroke-width: 1.5; opacity: 0; transform-box: fill-box; transform-origin: center;
      transition: opacity .25s, transform .35s; transform: scale(.6); }
    .node:hover .halo, .node:focus-visible .halo, .node.sel .halo { opacity: 1; transform: scale(1); }
    .node:hover text, .node.sel text, .node.near text { fill-opacity: 1; }
    .node.sel .star, .node.near .star { fill: var(--accent, #c9a2ff); }
    .node.sel text { font-weight: 650; }
    .node.dim { opacity: .2; }
    .panel { border: 1px solid var(--line, #25262c); border-radius: 14px; padding: 22px; background: var(--paper, #0f1013); min-height: 300px; }
    .cat { margin: 0 0 8px; font-family: var(--mono, monospace); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted, #8b8d96); }
    h3 { margin: 0 0 10px; font-size: 30px; line-height: 1.05; letter-spacing: -.03em; font-weight: 600; }
    .desc { margin: 0 0 22px; font-size: 15px; line-height: 1.45; color: var(--muted, #8b8d96); }
    ul { list-style: none; margin: 0 0 20px; padding: 0; display: grid; gap: 6px; }
    a { color: inherit; text-decoration: none; font-size: 15px; font-weight: 500; border-bottom: 1px solid var(--line, #25262c); display: flex; justify-content: space-between; padding: 6px 0; }
    a:hover { color: var(--accent, #c9a2ff); }
    .with { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; }
    .with button { padding: 4px 10px; font-size: 12px; }
    :focus-visible { outline: 2px solid var(--accent, #c9a2ff); outline-offset: 2px; }
    .uses { margin-bottom: 10px; }
    .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 7px; vertical-align: 1px; background: var(--muted, #8f919a); }
    .dot.production { background: var(--accent, #c9a2ff); }
    .dot.maintenance { background: var(--ok, #4ec78f); }
    .dot.independent { background: transparent; border: 1.5px solid var(--ink, #f4f4f1); }
    .star.indie { fill: var(--surface, #050506); stroke: var(--ink, #f4f4f1); stroke-width: 1.5; }
    .node.sel .star.indie, .node.near .star.indie { stroke: var(--accent, #c9a2ff); fill: var(--surface, #050506); }
    .badges { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 14px; }
    .badge { font-family: var(--mono, monospace); font-size: 10.5px; letter-spacing: .04em; padding: 3px 8px; border-radius: 999px; border: 1px solid var(--line, #25262c); }
    .badge.production { border-color: var(--accent, #c9a2ff); color: var(--accent, #c9a2ff); }
    .badge.maintenance { border-color: var(--ok, #4ec78f); color: var(--ok, #4ec78f); }
    .legend { display: flex; flex-wrap: wrap; gap: 8px 18px; margin: 0 0 18px; font-size: 13px; color: var(--muted, #8f919a); }
    .legend span { display: inline-flex; align-items: center; gap: 7px; }
    .lg { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    .lg.solid { background: var(--ink, #f4f4f1); }
    .lg.hollow { border: 1.5px solid var(--ink, #f4f4f1); }
    .compact { display: none; flex-wrap: wrap; gap: 8px; }
    .compact button { padding: 9px 14px; border-radius: 10px; border: 1px solid var(--line, #25262c); background: var(--paper, #0f1013); font-size: 14px; }
    .compact button.near { border-color: var(--accent, #c9a2ff); }
    .compact button.on { background: var(--accent, #c9a2ff); border-color: var(--accent, #c9a2ff); color: #050506; font-weight: 600; }
    @media (max-width: 900px) { .stage { grid-template-columns: 1fr; } .panel { min-height: 0; } }
    @media (max-width: 700px) { .scroller { display: none; } .compact { display: flex; } .chips button { font-size: 12px; padding: 6px 11px; } }
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  `,
})
export class TechConstellation {
  readonly W = W;
  readonly H = H;

  /** Set by the host page: `element.data = { technologies, projects }`. */
  readonly data = input<ConstellationData>({ technologies: [], projects: [] });

  readonly selected = signal<string | null>(null);
  readonly hover = signal<string | null>(null);
  readonly category = signal<string | null>(null);
  readonly use = signal<string | null>(null);
  readonly uses = ['Production', 'Maintenance', 'Independent'];

  readonly categories = computed(() => [...new Set(this.data().technologies.map((t) => t.category))]);

  /** Categories sit on an ellipse; each category's technologies ring its centre. */
  readonly clusters = computed(() => {
    const cats = this.categories();
    return cats.map((name, i) => {
      const a = (-90 + (360 / cats.length) * i) * (Math.PI / 180);
      return { name, x: W / 2 + Math.cos(a) * 430, y: H / 2 + Math.sin(a) * 275 };
    });
  });

  readonly nodes = computed<Placed[]>(() => {
    const out: Placed[] = [];
    for (const c of this.clusters()) {
      const members = this.data().technologies.filter((t) => t.category === c.name);
      const r = 50 + members.length * 8;
      members.forEach((t, i) => {
        const a = (-90 + (360 / members.length) * i + 25) * (Math.PI / 180);
        const x = c.x + Math.cos(a) * r;
        const y = c.y + Math.sin(a) * r * 0.78;
        const side = Math.cos(a);
        out.push({
          ...t, x, y,
          anchor: side > 0.3 ? 'start' : side < -0.3 ? 'end' : 'middle',
          lx: x + (side > 0.3 ? 14 : side < -0.3 ? -14 : 0),
          ly: y + (Math.abs(side) > 0.3 ? 5 : Math.sin(a) > 0 ? 26 : -16),
        });
      });
    }
    return out;
  });

  readonly edges = computed(() => {
    const at = new Map(this.nodes().map((n) => [n.name, n]));
    const seen = new Map<string, { key: string; a: Placed; b: Placed }>();
    for (const p of this.data().projects) {
      const ts = p.technologies.filter((t) => at.has(t));
      for (let i = 0; i < ts.length; i++) {
        for (let j = i + 1; j < ts.length; j++) {
          const key = [ts[i], ts[j]].sort().join('|');
          if (!seen.has(key)) seen.set(key, { key, a: at.get(ts[i])!, b: at.get(ts[j])! });
        }
      }
    }
    return [...seen.values()];
  });

  private readonly links = computed(() => {
    const m = new Map<string, Set<string>>();
    for (const e of this.edges()) {
      (m.get(e.a.name) ?? m.set(e.a.name, new Set()).get(e.a.name)!).add(e.b.name);
      (m.get(e.b.name) ?? m.set(e.b.name, new Set()).get(e.b.name)!).add(e.a.name);
    }
    return m;
  });

  /** What the panel and the highlighting follow: a hovered star, else the selected one. */
  readonly focus = computed(() => this.hover() ?? this.selected());
  readonly active = computed(() => this.nodes().find((n) => n.name === this.focus()) ?? null);

  degree(name: string): number {
    return this.projectsFor(name).length;
  }
  neighbours(name: string): string[] {
    return [...(this.links().get(name) ?? [])];
  }
  projectsFor(name: string): TechProject[] {
    return this.data().projects.filter((p) => p.technologies.includes(name));
  }

  isNear(n: Placed): boolean {
    const f = this.focus();
    return !!f && f !== n.name && !!this.links().get(f)?.has(n.name);
  }
  isDim(n: Placed): boolean {
    const f = this.focus();
    if (f) return f !== n.name && !this.isNear(n);
    return !this.passes(n);
  }
  /** Passes the category and usage filters. */
  passes(n: TechNode): boolean {
    const c = this.category();
    const u = this.use();
    return (c === null || n.category === c) && (u === null || n.use.includes(u));
  }
  atWork(n: TechNode): boolean {
    return n.use.includes('Production') || n.use.includes('Maintenance');
  }
  useLabel(u: string): string {
    return USE_LABEL[u] ?? u;
  }
  isEdgeLit(e: { a: Placed; b: Placed }): boolean {
    const f = this.focus();
    return !!f && (e.a.name === f || e.b.name === f);
  }
  isEdgeDim(e: { a: Placed; b: Placed }): boolean {
    const f = this.focus();
    if (f) return !this.isEdgeLit(e);
    if (this.category() === null && this.use() === null) return false;
    return !(this.passes(e.a) && this.passes(e.b));
  }

  pick(name: string): void {
    this.selected.update((s) => (s === name ? null : name));
    this.hover.set(null);
  }
  pickUse(u: string | null): void {
    this.use.set(u);
    this.selected.set(null);
  }
  pickCategory(c: string | null): void {
    this.category.set(c);
    this.selected.set(null);
  }
}
