import Image from "next/image";

/**
 * Real photograph in a section block — same rounded frame the placeholder
 * blocks used, so swapping one for the other does not shift the layout.
 * Alt text comes from the content files, never from the component.
 */
export function Photo({
  src,
  alt,
  className = "",
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  /** Width the image renders at, for srcset selection. */
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl shadow-card ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
