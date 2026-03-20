const ROOT_ROUTE = "/";
const ADMIN_DASHBOARD_ROUTE = "/admin/dashboard";
const ADMIN_DASHBOARD_EVENTS_ROUTE = `${ADMIN_DASHBOARD_ROUTE}/events`;

export const routes = {
  root: ROOT_ROUTE,
  adminDashboard: ADMIN_DASHBOARD_ROUTE,
  adminDashboardEvents: ADMIN_DASHBOARD_EVENTS_ROUTE,
} as const;

export function getAdminDashboardEventsRoute(locale: string): string {
  return `/${encodeURIComponent(locale)}${routes.adminDashboardEvents}`;
}

export function getAdminDashboardEventRoute(locale: string, eventId: string): string {
  return `${getAdminDashboardEventsRoute(locale)}/${encodeURIComponent(eventId)}`;
}

export function getEventUploadRoute(
  eventId: string,
  options?: { fromRememberedEvents?: boolean }
): string {
  const eventRoute = `/events/${encodeURIComponent(eventId)}`;
  if (!options?.fromRememberedEvents) return eventRoute;

  return `${eventRoute}?source=remembered`;
}
