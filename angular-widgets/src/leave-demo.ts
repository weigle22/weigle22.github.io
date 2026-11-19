import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, signal } from '@angular/core';

type Status = 'Draft' | 'Submitted' | 'Recommended' | 'Evaluated' | 'Certified' | 'Approved' | 'Posted';

interface Lane {
  role: string;
  /** Status an application must be in for this lane to act. */
  needs: Status;
  /** Status it moves to when this lane passes it on. */
  gives: Status;
  /** Status code the application moves to, as used in the real workflow. */
  code: string;
  /** Code used when this lane returns the application. */
  back: string;
  verb: string;
}

interface LogEntry {
  role: string;
  text: string;
  kind: 'forward' | 'return' | 'final';
}

const LANES: Lane[] = [
  { role: 'Employee', needs: 'Draft', gives: 'Submitted', code: 'E1', back: 'D1', verb: 'Submit' },
  { role: 'Recommending Officer', needs: 'Submitted', gives: 'Recommended', code: 'R1', back: 'R2', verb: 'Recommend' },
  { role: 'Leave Processor', needs: 'Recommended', gives: 'Evaluated', code: 'L1', back: 'L2', verb: 'Evaluate' },
  { role: 'Certifying Officer', needs: 'Evaluated', gives: 'Certified', code: 'C1', back: 'C2', verb: 'Certify' },
  { role: 'Approving Officer', needs: 'Certified', gives: 'Approved', code: 'A1', back: 'A2', verb: 'Approve' },
  { role: 'Leave Processor', needs: 'Approved', gives: 'Posted', code: 'L4', back: 'L2', verb: 'Post to ledger' },
];

@Component({
  selector: 'leave-demo-root',
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <div class="form">
        <label>
          <span>Leave type</span>
          <select [value]="type()" (change)="type.set($any($event.target).value)" [disabled]="!isDraft()">
            @for (t of types; track t) { <option [value]="t">{{ t }}</option> }
          </select>
        </label>
        <label>
          <span>Days</span>
          <input type="number" min="1" max="30" [value]="days()" [disabled]="!isDraft()"
                 (input)="days.set(+$any($event.target).value)" />
        </label>
        <div class="balance" [class.bad]="!valid()">
          <span>Balance</span>
          <strong>{{ balance() }} days</strong>
          @if (!valid()) { <em>{{ error() }}</em> }
        </div>
      </div>

      <ol class="lanes">
        @for (lane of lanes; track $index) {
          <li [class.done]="$index < step()" [class.active]="$index === step()">
            <span class="dot">{{ $index < step() ? '✓' : $index + 1 }}</span>
            <span class="role">{{ lane.role }}</span>
            <span class="gives"><b>{{ lane.code }}</b> {{ lane.gives }}</span>
          </li>
        }
      </ol>

      <div class="actions">
        @if (current(); as lane) {
          <p>Acting as <strong>{{ lane.role }}</strong> · status <code>{{ code() }} {{ status() }}</code></p>
          <div class="btns">
            <button class="primary" (click)="forward()" [disabled]="!valid()">{{ lane.verb }}</button>
            @if (step() > 0) { <button (click)="giveBack()">Return to employee</button> }
          </div>
        } @else {
          <p><strong>Posted.</strong> {{ days() }} day(s) deducted from the ledger.</p>
          <div class="btns"><button class="primary" (click)="reset()">File another</button></div>
        }
      </div>

      @if (log().length) {
        <ul class="log" aria-label="Audit trail">
          @for (e of log(); track $index) {
            <li [attr.data-kind]="e.kind"><b>{{ e.role }}</b> {{ e.text }}</li>
          }
        </ul>
      }
    </div>
  `,
  styles: `
    :host { display: block; font: inherit; color: var(--ink, #15161a); }
    .wrap { display: grid; gap: 18px; }
    .form { display: grid; grid-template-columns: 1.4fr .7fr 1.2fr; gap: 12px; align-items: end; }
    label, .balance { display: grid; gap: 6px; font-size: 13px; }
    label span, .balance span { font-family: var(--mono, monospace); font-size: 11px; letter-spacing: .06em;
      text-transform: uppercase; color: var(--muted, #6b6d76); }
    select, input { font: inherit; color: inherit; background: var(--paper, #fff);
      border: 1px solid var(--line, #d9d9d4); border-radius: 10px; padding: 10px 12px; min-width: 0; width: 100%; box-sizing: border-box; }
    select:disabled, input:disabled { opacity: .55; }
    .balance strong { font-size: 18px; font-variant-numeric: tabular-nums; padding: 8px 0; }
    .balance em { font-style: normal; font-size: 12px; color: var(--bad, #c2371b); }
    .lanes { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
    .lanes li { display: grid; grid-template-columns: 28px 1fr auto; gap: 10px; align-items: center;
      padding: 8px 12px; border: 1px solid var(--line, #d9d9d4); border-radius: 10px; font-size: 14px;
      transition: background .25s, border-color .25s, opacity .25s; opacity: .6; }
    .lanes li.done { opacity: 1; }
    .lanes li.active { opacity: 1; border-color: var(--accent, #e4572e); background: var(--accent-soft, #fdeee9); }
    .dot { width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; font-size: 12px;
      font-family: var(--mono, monospace); background: var(--line, #d9d9d4); }
    li.done .dot { background: var(--ok, #1f8a5b); color: #fff; }
    li.active .dot { background: var(--accent, #e4572e); color: #fff; }
    .gives { font-family: var(--mono, monospace); font-size: 11px; color: var(--muted, #6b6d76); }
    .gives b { color: var(--accent, #6a23c4); font-weight: 600; margin-right: 4px; }
    .actions p { margin: 0 0 10px; font-size: 14px; }
    code { font-family: var(--mono, monospace); font-size: 12px; padding: 2px 6px; border-radius: 6px; background: var(--line, #d9d9d4); }
    .btns { display: flex; gap: 8px; flex-wrap: wrap; }
    button { font: inherit; font-size: 14px; cursor: pointer; border-radius: 999px; padding: 9px 16px;
      border: 1px solid var(--line, #d9d9d4); background: transparent; color: inherit; }
    button.primary { background: var(--ink, #15161a); color: var(--surface, #fff); border-color: var(--ink, #15161a); }
    button:disabled { opacity: .4; cursor: not-allowed; }
    button:focus-visible, select:focus-visible, input:focus-visible { outline: 2px solid var(--accent, #e4572e); outline-offset: 2px; }
    .log { list-style: none; margin: 0; padding: 12px 14px; display: grid; gap: 4px; max-height: 132px; overflow: auto;
      font-family: var(--mono, monospace); font-size: 12px; border-radius: 10px; background: var(--paper, #fff);
      border: 1px dashed var(--line, #d9d9d4); }
    .log li[data-kind='return'] { color: var(--bad, #c2371b); }
    .log li[data-kind='final'] { color: var(--ok, #1f8a5b); }
    @media (max-width: 560px) { .form { grid-template-columns: 1fr 1fr; } .balance { grid-column: 1 / -1; } .gives { display: none; } }
  `,
})
export class LeaveDemo {
  readonly lanes = LANES;
  readonly types = ['Vacation leave', 'Sick leave', 'Special leave'];

  readonly type = signal(this.types[0]);
  readonly days = signal(3);
  readonly balance = signal(15);
  readonly step = signal(0);
  readonly log = signal<LogEntry[]>([]);

  readonly current = computed(() => LANES[this.step()] ?? null);
  readonly status = computed<Status>(() => this.current()?.needs ?? 'Posted');
  readonly code = computed(() => (this.step() === 0 ? 'D1' : LANES[this.step() - 1].code));
  readonly isDraft = computed(() => this.step() === 0);
  readonly error = computed(() => {
    const d = this.days();
    if (!Number.isInteger(d) || d < 1) return 'Enter whole days, at least 1.';
    if (d > this.balance()) return 'Not enough balance.';
    return '';
  });
  readonly valid = computed(() => this.error() === '');

  forward(): void {
    const lane = this.current();
    if (!lane || !this.valid()) return;
    const last = this.step() === LANES.length - 1;
    this.add({ role: lane.role, text: `→ ${lane.code} ${lane.gives}`, kind: last ? 'final' : 'forward' });
    if (last) this.balance.update((b) => b - this.days());
    this.step.update((s) => s + 1);
  }

  giveBack(): void {
    const lane = this.current();
    if (!lane) return;
    this.add({ role: lane.role, text: `↩ ${lane.back} returned · back to D1 Draft`, kind: 'return' });
    this.step.set(0);
  }

  reset(): void {
    this.step.set(0);
    this.days.set(Math.min(3, Math.max(1, this.balance())));
    this.log.set([]);
  }

  private add(entry: LogEntry): void {
    this.log.update((l) => [...l, entry]);
  }
}
