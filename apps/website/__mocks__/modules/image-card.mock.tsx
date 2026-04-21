/* eslint-disable @next/next/no-img-element */
import React from "react";
import { vi } from "vitest";
import type { ImageCardProps } from "@/components/ImageCard/ImageCard";

// title is optional here so tests can omit it; the real prop is required.
// Replaces Next.js <Image> with a plain <img> so tests run in happy-dom.
// data-testid="image-card" is overridable because {...props} comes last.
// title renders as visible text so translation-key assertions work.
type MockImageCardProps = Omit<ImageCardProps, "title"> & { title?: string };

export const imageCardMock = () => {
  const ImageCard = vi.fn(
    ({ src, alt, title, state = "default", onClick, ...props }: MockImageCardProps) => (
      <div
        data-testid="image-card"
        data-state={state}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        {...props}
      >
        <img src={src} alt={alt} />
        {title && <span>{title}</span>}
      </div>
    )
  );

  return { ImageCard, default: ImageCard };
};
