/**
 * Schedules a callback for when the browser is idle, falling back to a timeout
 * where `requestIdleCallback` is unavailable (notably Safari < 17).
 *
 * Returns a cancel function.
 */
export function scheduleWhenIdle(callback: () => void, timeout = 3000) {
  const idleWindow = window as Window & {
    requestIdleCallback?: (
      cb: IdleRequestCallback,
      options?: { timeout: number },
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

  if (typeof idleWindow.requestIdleCallback === "function") {
    const handle = idleWindow.requestIdleCallback(() => callback(), {
      timeout,
    });
    return () => idleWindow.cancelIdleCallback?.(handle);
  }

  const handle = window.setTimeout(callback, Math.min(timeout, 2000));
  return () => window.clearTimeout(handle);
}
