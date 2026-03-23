const ROOT_ROUTE = "/";
const ADMIN_DASHBOARD_ROUTE = "/admin/dashboard";
const ADMIN_DASHBOARD_EVENTS_ROUTE = `${ADMIN_DASHBOARD_ROUTE}/events`;

export const routes = {
  root: ROOT_ROUTE,
  adminDashboard: ADMIN_DASHBOARD_ROUTE,
  adminDashboardEvents: ADMIN_DASHBOARD_EVENTS_ROUTE,
} as const;

export function getAdminDashboardEventsRoute(): string {
  return routes.adminDashboardEvents;
}

export function getAdminDashboardEventRoute(eventId: string): string {
  return `${getAdminDashboardEventsRoute()}/${encodeURIComponent(eventId)}`;
}

