import { createContext, useContext, useState } from "react";

interface SelectContextValue {
  value: string;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  listboxId: string;
  triggerId: string;
}

const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("useSelectContext must be used within a SelectProvider");
  return ctx;
}

export function SelectProvider({
  children,
  listboxId,
  triggerId,
  disabled,
  required,
  defaultValue = "",
}: {
  children: React.ReactNode;
  listboxId: string;
  triggerId: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  return (
    <SelectContext.Provider
      value={{
        value,
        setValue,
        open,
        setOpen,
        disabled,
        required,
        listboxId,
        triggerId,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}
