import { createContext, useContext, ReactNode, useState } from "react";

interface SidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined)
    throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
};

export interface SidebarProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SidebarProvider = ({
  children,
  defaultOpen = true,
  onOpenChange,
}: SidebarProviderProps) => {
  const [open, setOpenState] = useState<boolean>(defaultOpen);

  const setOpen = (newOpen: boolean) => {
    setOpenState(newOpen);
    onOpenChange?.(newOpen);
  };

  const toggleOpen = () => {
    setOpen(!open);
  };

  const value: SidebarContextType = {
    open,
    setOpen,
    toggleOpen,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export default SidebarProvider;
