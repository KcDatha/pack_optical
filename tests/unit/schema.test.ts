import { describe, it, expect } from 'vitest';
import { practiceSchema } from '../../src/lib/schema';
import { SITE } from '../../src/data/site';

describe('Optometrist schema rating gate', () => {
  it('ships with the verified flag OFF by default', () => expect(SITE.RATING_VERIFIED).toBe(false));
  it('has no aggregateRating when the flag is false', () => {
    expect(practiceSchema()).not.toHaveProperty('aggregateRating');
    expect(practiceSchema({ ratingVerified: false })).not.toHaveProperty('aggregateRating');
  });
  it('includes aggregateRating only when the flag is true (test fixture)', () => {
    const s = practiceSchema({ ratingVerified: true, rating: { value: '4.7', count: 500 } }) as { aggregateRating: Record<string, string> };
    expect(s.aggregateRating).toEqual({ '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '500' });
  });
  it('keeps the NAP facts', () => {
    const s = practiceSchema() as { telephone: string; address: { streetAddress: string } };
    expect(s.telephone).toBe('+1-817-831-6141'); expect(s.address.streetAddress).toBe('1217 Oak Knoll Drive');
  });
});
