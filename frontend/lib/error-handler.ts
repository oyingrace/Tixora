// Centralized error handling utility

interface ErrorInfo {
  error: Error;
  context?: Record<string, unknown>;
  componentStack?: string;
}

// You can replace this with your actual error logging service
export const logError = async (errorInfo: ErrorInfo) => {
  const { error, context = {}, componentStack } = errorInfo;
  
  // In production, you would send this to an error tracking service
  // For now, we'll just log to the console
  console.error('Application Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    componentStack,
    context,
    timestamp: new Date().toISOString(),
  });

  // Example of sending to an error tracking service:
  // if (process.env.NODE_ENV === 'production') {
  //   await fetch('/api/log-error', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       name: error.name,
  //       message: error.message,
  //       stack: error.stack,
  //       componentStack,
  //       context,
  //       url: window.location.href,
  //       userAgent: window.navigator.userAgent,
  //     }),
  //   });
  // }
};

// Handle global unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    
    const error = event.reason;
    logError({
      error: error instanceof Error ? error : new Error(String(error)),
      context: {
        type: 'unhandledrejection',
      },
    });
  });

  // Handle global uncaught exceptions
  window.addEventListener('error', (event) => {
    event.preventDefault();
    
    logError({
      error: event.error || new Error(event.message || 'Unknown error'),
      context: {
        type: 'uncaught',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });
}

export const withErrorLogging = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: string
): T => {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError({
        error: error instanceof Error ? error : new Error(String(error)),
        context: {
          functionName: fn.name || 'anonymous',
          context,
          args: args.length > 0 ? args : undefined,
        },
      });
      throw error; // Re-throw to allow error boundaries to catch it
    }
  }) as T;
};
