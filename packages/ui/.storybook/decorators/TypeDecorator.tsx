import { useEffect } from "react";
import { fonts } from "../preview";

const FontDecorator = ({ children, font }: { children: React.ReactNode; font: string }) => {
  useEffect(() => {
    const fontVariable = fonts.includes(font) ? `"${font}", sans-serif` : null;
    // document.body.style.setProperty("--css-variable", fontVariable);
  }, [font]);

  return children;
};

export default FontDecorator;
