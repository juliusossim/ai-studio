export interface NormalizeTextOptions {
  readonly collapseWhitespace?: boolean;
  readonly lowercase?: boolean;
  readonly preserveLineBreaks?: boolean;
  readonly uppercase?: boolean;
}

export function normalizeTextValue(
  value: unknown,
  options: Readonly<NormalizeTextOptions> = {},
): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  let normalized = value.normalize('NFKC').trim();

  if (options.preserveLineBreaks) {
    normalized = normalized
      .split('\n')
      .map((line) => line.replaceAll(/\s+/g, ' ').trim())
      .join('\n')
      .trim();
  } else if (options.collapseWhitespace !== false) {
    normalized = normalized.replaceAll(/\s+/g, ' ');
  }

  if (options.lowercase) {
    normalized = normalized.toLowerCase();
  }

  if (options.uppercase) {
    normalized = normalized.toUpperCase();
  }

  return normalized;
}
