import React from "react";

export const Image = ({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} {...props} />;
};
export default Image;
