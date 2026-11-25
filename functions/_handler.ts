// Server logic for the two forms. Pure: all I/O comes in through `env` and `fetchImpl` so it is unit tested.
import { validateRequest, validateContact, makeReference, formatPhone, SERVICE_OPTIONS } from '../src/lib/forms';

export interface Env { TURNSTILE_SECRET?: string; RESEND_API_KEY?: string; MAIL_TO?: string; MAIL_FROM?: string }
type F = typeof fetch;
const HOURS = 'Monday, Tuesday and Thursday 7:30 AM to 5:30 PM; Wednesday 8:30 AM to 5:30 PM; closed Friday to Sunday';
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

async function turnstileOk(token: unknown, env: Env, ip: string | null, f: F): Promise<boolean> {
  if (typeof token !== 'string' || !token || !env.TURNSTILE_SECRET) return false;
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token }); if (ip) body.set('remoteip', ip);
  const r = await f('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  return r.ok && ((await r.json()) as { success?: boolean }).success === true;
}
async function send(env: Env, f: F, msg: { to: string; subject: string; html: string; reply_to?: string }) {
  const r = await f('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' }, body: JSON.stringify({ from: env.MAIL_FROM, ...msg }) });
  if (!r.ok) throw new Error(`resend ${r.status}`);
}
const row = (k: string, v: string) => `<tr><td style="padding:4px 12px 4px 0"><b>${k}</b></td><td>${esc(v)}</td></tr>`;

export async function handle(kind: 'request' | 'contact', request: Request, env: Env, f: F = fetch): Promise<Response> {
  if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
  let raw: Record<string, unknown>;
  try { raw = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }
  if (typeof raw.website === 'string' && raw.website) return json({ ok: true, reference: makeReference() }); // honeypot: pretend success
  const check = kind === 'request' ? validateRequest(raw) : validateContact(raw);
  if (!check.ok) return json({ ok: false, errors: check.errors }, 422);
  if (!(await turnstileOk(raw.turnstileToken, env, request.headers.get('CF-Connecting-IP'), f))) return json({ ok: false, error: 'turnstile' }, 403);
  if (!env.RESEND_API_KEY || !env.MAIL_TO || !env.MAIL_FROM) return json({ ok: false, error: 'not_configured' }, 500);
  try {
    if (kind === 'request') {
      const v = (check as ReturnType<typeof validateRequest>).value; const ref = makeReference();
      const svc = SERVICE_OPTIONS.find((s) => s.id === v.service)!.name;
      await send(env, f, { to: env.MAIL_TO, subject: `Appointment request ${ref}: ${svc}`, reply_to: v.email || undefined,
        html: `<p>New appointment REQUEST (not confirmed). Please call to confirm.</p><table>${row('Reference', ref)}${row('Name', v.name)}${row('Phone', formatPhone(v.phone))}${row('Email', v.email || '(none)')}${row('Service', svc)}${row('Preferred day', v.day)}${row('Preferred time', v.time)}${row('Patient type', v.patientType)}</table>` });
      if (v.email) await send(env, f, { to: v.email, subject: `We received your request ${ref} | Pack Optical + Med Spa`, html: `<p>Hello ${esc(v.name)},</p><p>Thank you. We received your appointment request (reference <b>${ref}</b>) for ${esc(svc)}. This is a request, not a confirmed booking: our office will call you to confirm a time.</p><p>Office hours: ${HOURS}. Phone 817-831-6141. 1217 Oak Knoll Drive, Fort Worth, TX 76117.</p><p>If this is an eye emergency, call 817-831-6141 now, or go to urgent care or the ER.</p>` });
      return json({ ok: true, reference: ref });
    }
    const v = (check as ReturnType<typeof validateContact>).value; const ref = makeReference();
    await send(env, f, { to: env.MAIL_TO, subject: `Website message ${ref}: ${v.topic}`, reply_to: v.email || undefined,
      html: `<table>${row('Reference', ref)}${row('Name', v.name)}${row('Phone', v.phone ? formatPhone(v.phone) : '(none)')}${row('Email', v.email || '(none)')}${row('Topic', v.topic)}${row('Message', v.message)}</table>` });
    if (v.email) await send(env, f, { to: v.email, subject: `We received your message ${ref} | Pack Optical + Med Spa`, html: `<p>Hello ${esc(v.name)},</p><p>Thank you for contacting Pack Optical + Med Spa. We received your message (reference <b>${ref}</b>) and will reply during office hours: ${HOURS}.</p><p>Phone 817-831-6141. For an eye emergency please call right away.</p>` });
    return json({ ok: true, reference: ref });
  } catch {
    return json({ ok: false, error: 'send_failed' }, 502);
  }
}
