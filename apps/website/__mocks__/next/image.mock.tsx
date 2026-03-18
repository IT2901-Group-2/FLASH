/**
 * Auto-mock for next/image.
 * Renders a plain <img> tag so src/alt assertions work normally in tests.
 * The next/image optimisation pipeline is bypassed in jsdom.
 */
import React from "react";

export default function Image({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} {...props} />;
}
