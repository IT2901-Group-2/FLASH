"use server";

import { getEventAuth } from "@/lib/utils/eventAuth";
import { EventAuthProvider } from "@/providers/EventAuthProvider";

export default async function Layout({
  children,
  params,
}: LayoutProps<"/[locale]/[id]">) {
  const { id } = await params;
  const eventAuthPromise = getEventAuth(id);

  return (
    <EventAuthProvider eventAuthPromise={eventAuthPromise}>{children}</EventAuthProvider>
  );
}
