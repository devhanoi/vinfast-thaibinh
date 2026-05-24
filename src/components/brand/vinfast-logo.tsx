import Image from "next/image";

const NATURAL_WIDTH = 2369;
const NATURAL_HEIGHT = 463;

export function VinFastLogo({
  width = 140,
  className,
  priority = false,
  alt = "VinFast",
}: {
  width?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  const height = Math.round((width * NATURAL_HEIGHT) / NATURAL_WIDTH);
  return (
    <Image
      src="/images/VinFast-logo-2026.png"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
