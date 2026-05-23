/**
 * Mobile SPA shim for @tanstack/react-start/server.
 *
 * The auth-middleware.ts imports `getRequest` from this path.
 * On mobile, server middleware doesn't run, so this is a no-op.
 */

/** Returns null on mobile — there is no incoming HTTP request. */
export function getRequest(): Request | null {
  return null;
}

/** No-op server-side helpers */
export function getResponseHeaders() {
  return new Headers();
}

export function setResponseStatus(_status: number) {
  // no-op
}
