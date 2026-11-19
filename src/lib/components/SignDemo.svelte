<script lang="ts">
	import { onMount } from 'svelte';

	// Sign → tamper → verify, using the browser's own crypto.
	// The real project does this with FALCON on a server; this shows the idea, honestly labelled.
	let keys = $state<CryptoKeyPair | null>(null);
	let message = $state('I, Emmanuel, built this page.');
	let signature = $state<ArrayBuffer | null>(null);
	let signedText = $state('');
	let valid = $state<boolean | null>(null);
	let supported = $state(true);

	const enc = new TextEncoder();
	const algo = { name: 'ECDSA', hash: 'SHA-256' };
	const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

	onMount(async () => {
		try {
			keys = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign', 'verify']);
		} catch {
			supported = false;
		}
	});

	async function sign() {
		if (!keys) return;
		signature = await crypto.subtle.sign(algo, keys.privateKey, enc.encode(message));
		signedText = message;
	}

	// Re-verify on every keystroke, so tampering shows up the moment it happens.
	$effect(() => {
		const text = message;
		if (!signature || !keys) {
			valid = null;
			return;
		}
		crypto.subtle.verify(algo, keys.publicKey, signature, enc.encode(text)).then((ok) => {
			if (text === message) valid = ok;
		});
	});
</script>

{#if !supported}
	<p class="hint">This browser doesn’t expose Web Crypto here, so the demo can’t run.</p>
{:else}
	<div class="demo">
		<label>
			<span class="mono">MESSAGE</span>
			<textarea rows="3" bind:value={message}></textarea>
		</label>

		<div class="row">
			<button class="pill solid" onclick={sign} disabled={!keys || !message}>
				{signature ? 'Sign again' : 'Sign it'}
			</button>
			{#if valid === true}
				<span class="verdict ok">✓ Signature matches this exact text</span>
			{:else if valid === false}
				<span class="verdict bad">✗ Text changed since signing</span>
			{:else}
				<span class="hint">Sign it, then change one letter.</span>
			{/if}
		</div>

		{#if signature}
			<div class="sig mono" aria-label="Signature">
				<span>signature · {signature.byteLength} bytes</span>
				{hex(signature)}
			</div>
			{#if valid === false}
				<button class="undo" onclick={() => (message = signedText)}>Restore the signed text</button>
			{/if}
		{/if}

		<p class="fine">
			Shown with your browser’s built-in ECDSA so it runs instantly. My FALCON project does the
			same three steps with a lattice-based scheme designed to survive quantum computers.
		</p>
	</div>
{/if}

<style>
	.demo {
		display: grid;
		gap: 14px;
	}
	label {
		display: grid;
		gap: 6px;
	}
	label span {
		font-size: 11px;
		letter-spacing: 0.08em;
		color: var(--muted);
	}
	textarea {
		font: inherit;
		font-size: 16px;
		color: inherit;
		background: var(--paper);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 12px 14px;
		resize: vertical;
		width: 100%;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 16px;
	}
	button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.verdict {
		font-weight: 550;
		font-size: 15px;
	}
	.verdict.ok {
		color: var(--ok);
	}
	.verdict.bad {
		color: var(--bad);
	}
	.hint {
		font-size: 14px;
		color: var(--muted);
	}
	.sig {
		font-family: var(--code);
		font-size: 11.5px;
		line-height: 1.6;
		word-break: break-all;
		padding: 12px 14px;
		border-radius: 12px;
		border: 1px dashed var(--line);
		background: var(--paper);
	}
	.sig span {
		display: block;
		color: var(--inspect);
		margin-bottom: 4px;
	}
	.undo {
		justify-self: start;
		background: none;
		border: 0;
		padding: 0;
		color: var(--accent);
		cursor: pointer;
		font-size: 14px;
		text-decoration: underline;
	}
	.fine {
		font-size: 13.5px;
		color: var(--muted);
		max-width: 60ch;
	}
</style>
