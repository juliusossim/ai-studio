import { normalizeTextValue } from './normalize-text.js';

describe('normalizeTextValue', () => {
  it('trims and collapses whitespace by default', () => {
    expect(normalizeTextValue('  Accra   Ghana  ')).toBe('Accra Ghana');
  });

  it('preserves line breaks when requested', () => {
    expect(
      normalizeTextValue('  First   line \n second   line  ', {
        preserveLineBreaks: true,
      }),
    ).toBe('First line\nsecond line');
  });

  it('applies case normalization options', () => {
    expect(normalizeTextValue('  usd  ', { uppercase: true })).toBe('USD');
    expect(normalizeTextValue('  USER@EXAMPLE.COM  ', { lowercase: true })).toBe(
      'user@example.com',
    );
  });

  it('leaves non-string values unchanged', () => {
    expect(normalizeTextValue(42)).toBe(42);
  });
});
