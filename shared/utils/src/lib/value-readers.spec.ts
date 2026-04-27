import { readFiniteNumber, readNonEmptyString, readRecord } from './value-readers.js';

describe('value readers', () => {
  it('reads plain object records and falls back for non-record values', () => {
    expect(readRecord({ city: 'Accra' })).toEqual({ city: 'Accra' });
    expect(readRecord(['not', 'a', 'record'])).toEqual({});
    expect(readRecord(null)).toEqual({});
  });

  it('reads non-empty strings and falls back for blank values', () => {
    expect(readNonEmptyString('Apartment', 'Fallback')).toBe('Apartment');
    expect(readNonEmptyString('   ', 'Fallback')).toBe('Fallback');
    expect(readNonEmptyString(undefined, 'Fallback')).toBe('Fallback');
  });

  it('reads finite numbers and falls back for invalid values', () => {
    expect(readFiniteNumber(42, 0)).toBe(42);
    expect(readFiniteNumber(Number.NaN, 0)).toBe(0);
    expect(readFiniteNumber('42', 0)).toBe(0);
  });
});
