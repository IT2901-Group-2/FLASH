"use client";

import { Sidebar } from "@flash/ui";

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  return <Sidebar.Provider open={false}>{children}</Sidebar.Provider>;
};
export default SidebarProvider;
