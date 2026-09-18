/**
 * Shortens text to at most `max` characters, ending on a whole word plus "…".
 * Meta descriptions used to be cut with slice(), which ended every district
 * snippet mid-word.
 */
export function cutAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const end = cut.lastIndexOf(" ");
  return `${(end > 0 ? cut.slice(0, end) : cut).replace(/[\s,;:—–-]+$/, "")}…`;
}
