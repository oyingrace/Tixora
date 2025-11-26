"use client";

import { useEffect } from "react";

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      fetch("/api/log-error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.error?.stack,
          type: "Client-side Error",
        }),
      });
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      fetch("/api/log-error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: event.reason?.message,
          stack: event.reason?.stack,
          type: "Unhandled Promise Rejection",
        }),
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handlePromiseRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handlePromiseRejection);
    };
  }, []);

  return <>{children}</>;
};

export default ErrorBoundary;
