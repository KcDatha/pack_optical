import { describe, it, expect, vi } from 'vitest';
import { validateRequest, validateContact, validPhone, validEmail, makeReference, formatPhone, REQUEST_FIELDS, CONTACT_FIELDS } from '../../src/lib/forms';
import { handle } from '../../functions/_handler';

const good = { name: 'Jordan Smith', phone: '(817) 555-0123', email: 'j@example.com', service: 'exam', day: 'Monday', time: 'Morning', patientType: 'New patient / client' };
const env = { TURNSTILE_SECRET: 's', RESEND_API_KEY: 'k', MAIL_TO: 'office@packoptical.com', MAIL_FROM: 'Pack <noreply@packoptical.com>' };
const post = (body: unknown) => new Request('https://x/api/request', { method: 'POST', body: JSON.stringify(body) });
const mockFetch = (ts = true) => vi.fn(async (url: string) => String(url).includes('turnstile') ? new Response(JSON.stringify({ success: ts })) : new Response('{}', { status: 200 })) as unknown as typeof fetch;

describe('validation', () => {
  it('accepts a good request', () => expect(validateRequest(good).ok).toBe(true));
  it('flags missing name, bad phone, bad email', () => {
    const r = validateRequest({ ...good, name: '', phone: '123', email: 'nope' });
    expect(Object.keys(r.errors).sort()).toEqual(['email', 'name', 'phone']);
  });
  it('phone and email helpers', () => {
    expect(validPhone('1-817-831-6141')).toBe(true); expect(validPhone('831-6141')).toBe(false);
    expect(validEmail('a@b.co')).toBe(true); expect(validEmail('a@b')).toBe(false);
    expect(formatPhone('8178316141')).toBe('(817) 831-6141');
  });
  it('contact needs phone or email and a message', () => {
    expect(validateContact({ name: 'Al', topic: 'General question', message: 'hello there' }).errors.contact).toBeTruthy();
    expect(validateContact({ name: 'Al', email: 'a@b.co', topic: 'General question', message: 'hello there' }).ok).toBe(true);
  });
  it('reference format', () => expect(makeReference()).toMatch(/^PACK-[A-Z2-9]{6}$/));
  it('PRIVACY: no field asks for health, insurance id or date of birth', () => {
    const all = [...REQUEST_FIELDS, ...CONTACT_FIELDS].join(' ').toLowerCase();
    for (const bad of ['dob', 'birth', 'symptom', 'insurance', 'history', 'ssn', 'diagnos', 'medication']) expect(all).not.toContain(bad);
  });
});

describe('server handler', () => {
  it('sends office and patient emails and returns a reference', async () => {
    const f = mockFetch(); const r = await handle('request', post({ ...good, turnstileToken: 't' }), env, f);
    const j = await r.json() as { ok: boolean; reference: string };
    expect(r.status).toBe(200); expect(j.reference).toMatch(/^PACK-/);
    const calls = (f as unknown as ReturnType<typeof vi.fn>).mock.calls.filter((c) => String(c[0]).includes('resend'));
    expect(calls).toHaveLength(2);
    expect(JSON.parse(calls[0][1].body).to).toBe('office@packoptical.com');
    expect(JSON.parse(calls[1][1].body).to).toBe('j@example.com');
  });
  it('blocks a scripted submit without a Turnstile token', async () => {
    const f = mockFetch(); const r = await handle('request', post(good), env, f);
    expect(r.status).toBe(403);
    expect((f as unknown as ReturnType<typeof vi.fn>).mock.calls.some((c) => String(c[0]).includes('resend'))).toBe(false);
  });
  it('blocks a failed Turnstile check', async () => expect((await handle('request', post({ ...good, turnstileToken: 'bad' }), env, mockFetch(false))).status).toBe(403));
  it('returns 422 with field errors', async () => {
    const r = await handle('request', post({ ...good, name: '', turnstileToken: 't' }), env, mockFetch()); expect(r.status).toBe(422);
    expect(((await r.json()) as { errors: Record<string, string> }).errors.name).toBeTruthy();
  });
  it('honeypot returns success without sending', async () => {
    const f = mockFetch(); const r = await handle('request', post({ ...good, website: 'spam.com' }), env, f);
    expect(r.status).toBe(200); expect((f as unknown as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(0);
  });
  it('contact form sends office email (no auto reply without email)', async () => {
    const f = mockFetch(); const r = await handle('contact', post({ name: 'Al', phone: '8175550123', topic: 'General question', message: 'Hello office', turnstileToken: 't' }), env, f);
    expect(r.status).toBe(200);
    expect((f as unknown as ReturnType<typeof vi.fn>).mock.calls.filter((c) => String(c[0]).includes('resend'))).toHaveLength(1);
  });
  it('reports misconfiguration and send failure', async () => {
    expect((await handle('request', post({ ...good, turnstileToken: 't' }), { TURNSTILE_SECRET: 's' }, mockFetch())).status).toBe(500);
    const failing = vi.fn(async (u: string) => String(u).includes('turnstile') ? new Response('{"success":true}') : new Response('', { status: 500 })) as unknown as typeof fetch;
    expect((await handle('request', post({ ...good, turnstileToken: 't' }), env, failing)).status).toBe(502);
  });
  it('rejects non-POST', async () => expect((await handle('request', new Request('https://x/', { method: 'GET' }), env, mockFetch())).status).toBe(405));
});
