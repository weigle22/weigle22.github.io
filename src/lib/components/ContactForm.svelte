<script lang="ts">
	import Send from '@lucide/svelte/icons/send';
	import { site } from '#lib/data/site.ts';

	// Posts to a static-friendly form service (Formspree-compatible JSON API). The endpoint is public by
	// design; no secrets live in the page. Spam protection: a hidden honeypot field plus a minimum fill time.
	type Field = 'name' | 'email' | 'subject' | 'message';
	let values = $state<Record<Field, string>>({ name: '', email: '', subject: '', message: '' });
	let errors = $state<Partial<Record<Field, string>>>({});
	let honeypot = $state('');
	let status = $state<'idle' | 'sending' | 'sent' | 'failed'>('idle');
	let notice = $state('');
	const opened = Date.now();

	function validate(): boolean {
		const e: Partial<Record<Field, string>> = {};
		if (values.name.trim().length < 2) e.name = 'Please enter your name.';
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) e.email = 'Please enter a valid email address, like name@example.com.';
		if (values.subject.trim().length < 3) e.subject = 'Please add a short subject.';
		if (values.message.trim().length < 10) e.message = 'Please write at least a sentence (10 characters).';
		errors = e;
		return Object.keys(e).length === 0;
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (status === 'sending') return;
		if (!validate()) {
			notice = 'Please fix the highlighted fields.';
			(document.getElementById(`cf-${Object.keys(errors)[0]}`) as HTMLElement | null)?.focus();
			return;
		}
		// Bots fill hidden fields and submit instantly. Pretend success so they learn nothing.
		if (honeypot || Date.now() - opened < 3000) {
			status = 'sent';
			notice = 'Thanks, your message has been sent.';
			return;
		}
		status = 'sending';
		notice = 'Sending…';
		try {
			const res = await fetch(site.contactFormEndpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify({ ...values, _subject: `Portfolio: ${values.subject}` })
			});
			if (!res.ok) throw new Error(String(res.status));
			status = 'sent';
			notice = 'Thanks, your message has been sent. I’ll reply by email.';
			values = { name: '', email: '', subject: '', message: '' };
		} catch {
			status = 'failed';
			notice = 'The message couldn’t be sent. Please try again, or reach me on LinkedIn.';
		}
	}

	const fields: { id: Field; label: string; type?: string; auto?: AutoFill; long?: boolean }[] = [
		{ id: 'name', label: 'Name', auto: 'name' },
		{ id: 'email', label: 'Email', type: 'email', auto: 'email' },
		{ id: 'subject', label: 'Subject' },
		{ id: 'message', label: 'Message', long: true }
	];
</script>

<form novalidate onsubmit={submit} aria-describedby="cf-notice">
	{#each fields as f}
		<div class="field" class:long={f.long} class:bad={errors[f.id]}>
			<label for="cf-{f.id}">{f.label}</label>
			{#if f.long}
				<textarea id="cf-{f.id}" rows="5" bind:value={values[f.id]} aria-invalid={!!errors[f.id]} aria-describedby={errors[f.id] ? `cf-${f.id}-err` : undefined} required></textarea>
			{:else}
				<input id="cf-{f.id}" type={f.type ?? 'text'} autocomplete={f.auto} bind:value={values[f.id]} aria-invalid={!!errors[f.id]} aria-describedby={errors[f.id] ? `cf-${f.id}-err` : undefined} required />
			{/if}
			{#if errors[f.id]}<p class="err" id="cf-{f.id}-err">{errors[f.id]}</p>{/if}
		</div>
	{/each}

	<!-- Honeypot: hidden from people and screen readers, irresistible to bots. -->
	<div class="hp" aria-hidden="true">
		<label for="cf-website">Website</label>
		<input id="cf-website" name="_gotcha" tabindex="-1" autocomplete="off" bind:value={honeypot} />
	</div>

	<div class="foot">
		<button class="pill solid" type="submit" disabled={status === 'sending'}>
			<Send size={16} />
			{status === 'sending' ? 'Sending…' : 'Send message'}
		</button>
		<p id="cf-notice" class="notice {status}" role="status" aria-live="polite">{notice}</p>
	</div>
</form>

<style>
	form {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px 18px;
	}
	.field {
		display: grid;
		gap: 6px;
	}
	.field.long,
	.foot {
		grid-column: 1 / -1;
	}
	label {
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}
	input,
	textarea {
		font: inherit;
		font-size: 16px;
		color: var(--ink);
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 12px 14px;
		width: 100%;
		transition: border-color 0.2s;
	}
	textarea {
		resize: vertical;
	}
	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--accent);
	}
	.bad input,
	.bad textarea {
		border-color: var(--bad);
	}
	.err {
		font-size: 13px;
		color: var(--bad);
	}
	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
	.foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 20px;
	}
	button:disabled {
		opacity: 0.6;
		cursor: progress;
	}
	.notice {
		font-size: 14px;
		color: var(--muted);
	}
	.notice.sent {
		color: var(--ok);
	}
	.notice.failed {
		color: var(--bad);
	}
	@media (max-width: 640px) {
		form {
			grid-template-columns: 1fr;
		}
	}
</style>
