import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface SidebarContextType {
  open: boolean;
  showToggleButton: boolean;
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
  open?: boolean;
  showToggleButton?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SidebarProvider = ({
  children,
  open: _open = true,
  showToggleButton = true,
  onOpenChange,
}: SidebarProviderProps) => {
  const [open, setOpenState] = useState<boolean>(_open);

  useEffect(() => {
    setOpenState(_open);
  }, [_open]);

  const setOpen = (newOpen: boolean) => {
    setOpenState(newOpen);
    onOpenChange?.(newOpen);
  };

  const toggleOpen = () => setOpen(!open);

  const value: SidebarContextType = {
    open,
    showToggleButton,
    setOpen,
    toggleOpen,
  };

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export default SidebarProvider;
