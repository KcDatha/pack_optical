import { describe, it, expect } from 'vitest';
import { reply, hoursText, CHIPS } from '../../src/lib/chat';
import { SITE } from '../../src/data/site';

const mon10 = new Date('2026-11-23T16:00:00Z'); // Monday 10:00 AM Chicago
describe('rule based chat', () => {
  it('every quick chip gets a real answer', () => CHIPS.forEach((c) => { const r = reply(c.flow, mon10); expect(r.text.length).toBeGreaterThan(30); expect(r.links.length).toBeGreaterThan(0); }));
  it('emergency words route to the phone', () => { const r = reply('sudden pain in my eye', mon10); expect(r.text).toContain('817-831-6141'); expect(r.links[0].href).toBe('tel:+18178316141'); });
  it('plan names get the insurance answer', () => { expect(reply('do you take VSP?', mon10).text).toContain('VSP'); expect(reply('I have Aetna', mon10).text).toContain('Aetna'); });
  it('hours reflect open/closed', () => { expect(hoursText(mon10)).toContain('Open now'); expect(hoursText(new Date('2026-11-29T18:00:00Z'))).toContain('Closed now'); });
  it('kids plan uses the demo facts', () => expect(reply('kids glasses', mon10).text).toContain('$99'));
  it('booking answer names both options: Weave for eye care, Moxie for med spa, and the request form', () => {
    const r = reply('I want to book', mon10);
    expect(r.text).toContain('Weave'); expect(r.text).toContain('Moxie');
    expect(r.links.map((l) => l.href)).toEqual([SITE.weaveUrl, SITE.moxieUrl, '/book/']);
  });
  it('unknown input falls back to phone, never invents', () => { const r = reply('what is the meaning of life', mon10); expect(r.text).toContain('817-831-6141'); });
  it('links stay on the site or on known external stores', () => CHIPS.forEach((c) => reply(c.flow, mon10).links.forEach((l) => expect(l.href).toMatch(/^(\/|tel:|mailto:|https:\/\/(www\.google\.com\/maps|packoptical\.myclstore\.com|book2\.getweave\.com|app\.joinmoxie\.com))/))));
});
