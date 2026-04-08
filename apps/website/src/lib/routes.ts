/**
 * Defines the routes used for navigation within the application.
 * Provides a centralized location for managing route paths and
 * generating dynamic routes based on parameters.
 *
 *  > _Last updated: `2026-03-23`_
 */
const ROOT_ROUTE = "/";
const ADMIN_DASHBOARD_ROUTE = "/admin/dashboard";
const ADMIN_DASHBOARD_EVENTS_ROUTE = `${ADMIN_DASHBOARD_ROUTE}/events`;

export const routes = {
  root: ROOT_ROUTE,
  adminDashboard: ADMIN_DASHBOARD_ROUTE,
  adminDashboardEvents: ADMIN_DASHBOARD_EVENTS_ROUTE,
} as const;

/**
 * Generates the route for the admin dashboard event overview page.
 * @returns The URL path to the admin dashboard event overview page.
 *
 * "/admin/dashboard/events"
 */
export function getAdminDashboardEventsRoute(): string {
  return routes.adminDashboardEvents;
}

/**
 * Generates the route for the admin details page for a specific event.
 * @param eventId - The unique identifier of the event.
 * @return The URL path to the admin details page for the specified event.
 *
 * "/admin/dashboard/events/{eventId}"
 */
export function getAdminDashboardEventRoute(eventId: string): string {
  return `${getAdminDashboardEventsRoute()}/${encodeURIComponent(eventId)}`;
}
