export function containsControlCharacters(value: string): boolean {
  return [...value].some((character) => {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined) {
      return false;
    }

    return (
      (codePoint >= 0 && codePoint <= 8) ||
      (codePoint >= 11 && codePoint <= 31) ||
      codePoint === 127
    );
  });
}
