/**
 * Lightweight, privacy-safe client telemetry & Web Vitals observability.
 * Emits structured JSON events with a session correlation ID.
 * Never logs PII (names, emails, phone numbers, messages).
 */

type EventLevel = "info" | "warn" | "error";

interface TelemetryPayload {
  event: string;
  level?: EventLevel;
  route?: string;
  metadata?: Record<string, string | number | boolean>;
}

const getSessionId = (): string => {
  try {
    const key = "adithya_session_id";
    let id = sessionStorage.getItem(key);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return "anonymous-session";
  }
};

export const trackEvent = ({
  event,
  level = "info",
  route,
  metadata,
}: TelemetryPayload): void => {
  const entry = {
    event,
    level,
    sessionId: getSessionId(),
    route: route ?? (typeof window !== "undefined" ? window.location.pathname : "/"),
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  if (import.meta.env.DEV) {
    console[level === "error" ? "error" : level === "warn" ? "warn" : "info"](
      "[telemetry]",
      entry
    );
  }
};

export const trackPageView = (route: string): void => {
  trackEvent({ event: "page_view", route });
};

export const trackError = (error: Error, componentStack?: string): void => {
  trackEvent({
    event: "ui_error_boundary",
    level: "error",
    metadata: {
      errorName: error.name,
      errorMessage: error.message.slice(0, 200),
      hasStack: Boolean(componentStack),
    },
  });
};

let vitalsInitialized = false;

/**
 * Observes Core Web Vitals (LCP and CLS) once per session using PerformanceObserver.
 */
export const initWebVitalsObserver = (): void => {
  if (vitalsInitialized || typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return;
  }
  vitalsInitialized = true;

  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) {
        trackEvent({
          event: "web_vital_lcp",
          metadata: { valueMs: Math.round(last.startTime) },
        });
      }
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    // Browser does not support largest-contentful-paint observer
  }

  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as Array<PerformanceEntry & { hadRecentInput?: boolean; value?: number }>) {
        if (!entry.hadRecentInput && typeof entry.value === "number") {
          clsValue += entry.value;
        }
      }
      trackEvent({
        event: "web_vital_cls",
        metadata: { value: Number(clsValue.toFixed(4)) },
      });
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });
  } catch {
    // Browser does not support layout-shift observer
  }
};
