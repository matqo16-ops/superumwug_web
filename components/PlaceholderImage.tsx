/**
 * Styled stand-in for a real photo. Replace by dropping the final image into
 * /public/images and swapping this component for next/image — see
 * public/images/README.md for the shot list.
 */
export function PlaceholderImage({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center rounded-xl border border-dashed border-gold/50 bg-gradient-to-br from-navy to-anthracite p-6 ${className}`}
    >
      <span className="max-w-xs text-center text-sm leading-relaxed text-white/60">
        {label}
      </span>
    </div>
  );
}
