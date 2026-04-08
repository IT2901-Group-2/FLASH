import React from "react";

export const Link = ({
  children,
  href,
  ...props
}: {
  children: React.ReactNode;
  href: string;
  [key: string]: unknown;
}) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};
export default Link;
