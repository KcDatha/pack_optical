// Browser helper: submit a form as JSON, show field errors, call onOk with the server reply.
export function wireForm(form: HTMLFormElement, endpoint: string, onOk: (reply: { reference: string }, data: Record<string, string>) => void) {
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const btn = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const clear = () => { form.querySelectorAll<HTMLElement>('[data-err]').forEach((e) => { e.hidden = true; e.textContent = ''; }); form.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid')); status.textContent = ''; };
  const show = (name: string, msg: string) => {
    const e = form.querySelector<HTMLElement>(`[data-err="${name}"]`); if (e) { e.textContent = msg; e.hidden = false; }
    form.querySelector(`[name="${name}"]`)?.setAttribute('aria-invalid', 'true');
  };
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault(); clear();
    const data: Record<string, string> = {};
    new FormData(form).forEach((v, k) => { data[k === 'cf-turnstile-response' ? 'turnstileToken' : k] = String(v); });
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const r = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) { onOk(j, data); return; }
      if (r.status === 422 && j.errors) { Object.entries(j.errors as Record<string, string>).forEach(([k, m]) => show(k, m)); status.textContent = 'Please fix the highlighted fields.'; form.querySelector<HTMLElement>('[aria-invalid]')?.focus(); }
      else if (j.error === 'turnstile') status.textContent = 'Please complete the spam check, then send again.';
      else status.textContent = 'Sorry, we could not send that. Please call 817-831-6141.';
    } catch { status.textContent = 'Network problem. Please try again or call 817-831-6141.'; }
    finally { btn.disabled = false; btn.textContent = btn.dataset.label ?? 'Send'; }
  });
}
