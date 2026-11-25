import { describe, it, expect } from 'vitest';
import { openStatus, fmtTime } from '../../src/lib/hours';

describe('hours', () => {
  it('formats times', () => {
    expect(fmtTime(450)).toBe('7:30 AM');
    expect(fmtTime(1050)).toBe('5:30 PM');
    expect(fmtTime(720)).toBe('12:00 PM');
  });
  it('open Monday 10:00', () => expect(openStatus(1, 600)).toEqual({ open: true, text: 'Open now · closes 5:30 PM' }));
  it('Wednesday opens 8:30', () => expect(openStatus(3, 480).text).toBe('Closed now · opens today at 8:30 AM'));
  it('Thursday evening opens Monday', () => expect(openStatus(4, 1100).text).toBe('Closed now · opens Monday at 7:30 AM'));
  it('Sunday opens tomorrow', () => expect(openStatus(0, 600).text).toBe('Closed now · opens tomorrow at 7:30 AM'));
});
