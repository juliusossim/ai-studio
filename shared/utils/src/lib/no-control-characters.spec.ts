import { containsControlCharacters } from './no-control-characters.js';

describe('containsControlCharacters', () => {
  it('returns false for plain text', () => {
    expect(containsControlCharacters('Waterfront Apartment')).toBe(false);
  });

  it('returns true for disallowed control characters', () => {
    expect(containsControlCharacters('bad\u0007value')).toBe(true);
  });

  it('allows new lines and tabs because they are handled separately', () => {
    expect(containsControlCharacters('line 1\nline 2\tvalue')).toBe(false);
  });
});
