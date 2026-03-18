/**
 * Auto-mock for next/link.
 * Renders a plain <a> tag so href assertions work normally in tests.
 */
import React from "react";

export default function Link({
  children,
  href,
  ...props
}: {
  children: React.ReactNode;
  href: string;
  [key: string]: unknown;
}) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
