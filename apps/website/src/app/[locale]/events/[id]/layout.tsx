import { EventAuthProvider } from "@/providers/EventAuthProvider";

export default async function Layout({
  children,
  params,
}: LayoutProps<"/[locale]/events/[id]">) {
  const { id } = await params;

  return <EventAuthProvider eventId={id}>{children}</EventAuthProvider>;
}
