export const stripVar = (cssValue: string) =>
  cssValue.startsWith("var(") ? cssValue.slice(4, -1) : cssValue;

export const getColorCategory = (name: string) => {
  if (name.includes("neutral")) return "neutral";
  if (name.includes("accent")) return "accent";
  if (name.includes("success")) return "success";
  if (name.includes("warning")) return "warning";
  if (name.includes("danger")) return "danger";
  if (name.includes("brand-purple")) return "brand-purple";
  return "base";
};
