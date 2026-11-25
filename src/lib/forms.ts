// Shared validation for the appointment request and contact forms (client + Cloudflare Pages Functions).
// PRIVACY: no field may collect health details, insurance IDs or dates of birth.
import demo from '../data/demo-data.json';

export const REQUEST_FIELDS = ['name', 'phone', 'email', 'service', 'day', 'time', 'patientType'] as const;
export const CONTACT_FIELDS = ['name', 'phone', 'email', 'topic', 'message'] as const;

export const SERVICE_OPTIONS: { group: string; id: string; name: string }[] = [
  ...demo.SERVICES.eye.map((s) => ({ group: 'Eye care', id: s.id, name: s.name })),
  ...demo.SERVICES.spa.map((s) => ({ group: 'Med spa', id: s.id, name: s.name })),
];
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Any open day'] as const;
export const TIMES = ['Morning', 'Afternoon', 'No preference'] as const;
export const TOPICS = ['General question', 'Insurance check', 'Contact lens reorder', 'Med spa gift card', 'Records / prescription request'] as const;

export type Errors = Record<string, string>;
const digits = (s: string) => s.replace(/\D/g, '');
export const normalizePhone = (s: string) => { let d = digits(s); if (d.length === 11 && d.startsWith('1')) d = d.slice(1); return d; };
export const validPhone = (s: string) => normalizePhone(s).length === 10;
export const validEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
export const formatPhone = (s: string) => { const d = normalizePhone(s); return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : s; };
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export interface RequestInput { name: string; phone: string; email: string; service: string; day: string; time: string; patientType: string }
export function validateRequest(raw: Record<string, unknown>): { ok: boolean; errors: Errors; value: RequestInput } {
  const v: RequestInput = { name: clean(raw.name, 100), phone: clean(raw.phone, 30), email: clean(raw.email, 120), service: clean(raw.service, 40), day: clean(raw.day, 30), time: clean(raw.time, 30), patientType: clean(raw.patientType, 30) };
  const errors: Errors = {};
  if (v.name.length < 2) errors.name = 'Please enter your full name.';
  if (!validPhone(v.phone)) errors.phone = 'Please enter a valid 10-digit phone number.';
  if (v.email && !validEmail(v.email)) errors.email = 'That email address does not look right.';
  if (!SERVICE_OPTIONS.some((s) => s.id === v.service)) errors.service = 'Please choose a service.';
  if (!(DAYS as readonly string[]).includes(v.day)) errors.day = 'Please choose a preferred day.';
  if (!(TIMES as readonly string[]).includes(v.time)) errors.time = 'Please choose a preferred time of day.';
  if (!['New patient / client', 'Existing patient / client'].includes(v.patientType)) errors.patientType = 'Please choose one.';
  return { ok: Object.keys(errors).length === 0, errors, value: v };
}

export interface ContactInput { name: string; phone: string; email: string; topic: string; message: string }
export function validateContact(raw: Record<string, unknown>): { ok: boolean; errors: Errors; value: ContactInput } {
  const v: ContactInput = { name: clean(raw.name, 100), phone: clean(raw.phone, 30), email: clean(raw.email, 120), topic: clean(raw.topic, 40), message: clean(raw.message, 1500) };
  const errors: Errors = {};
  if (v.name.length < 2) errors.name = 'Please enter your name.';
  if (!v.phone && !v.email) errors.contact = 'Please give a phone number or an email so we can reply.';
  if (v.phone && !validPhone(v.phone)) errors.phone = 'Please enter a valid 10-digit phone number.';
  if (v.email && !validEmail(v.email)) errors.email = 'That email address does not look right.';
  if (!(TOPICS as readonly string[]).includes(v.topic)) errors.topic = 'Please choose a topic.';
  if (v.message.length < 5) errors.message = 'Please write a short message.';
  return { ok: Object.keys(errors).length === 0, errors, value: v };
}

export function makeReference(rand: () => number = Math.random): string {
  const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = ''; for (let i = 0; i < 6; i++) s += A[Math.floor(rand() * A.length)];
  return `PACK-${s}`;
}
