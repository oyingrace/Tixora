type Metric = {
  name: string;
  value: number;
  id: string;
  delta: number;
  entries: PerformanceEntry[];
};

type ReportHandler = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFID(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

export const startPerformanceMonitoring = () => {
  // Only run in production
  if (process.env.NODE_ENV === 'production') {
    // Send metrics to your analytics/observability service
    reportWebVitals((metric: Metric) => {
      // You can send these metrics to any analytics service
      console.log('[Performance]', metric);
      
      // Example: Send to an API endpoint
      // const body = JSON.stringify(metric);
      // const url = '/api/analytics';
      // if (navigator.sendBeacon) {
      //   navigator.sendBeacon(url, body);
      // } else {
      //   fetch(url, { body, method: 'POST', keepalive: true });
      // }
    });
  }
};

export const measurePageLoad = (pageName: string) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const timing = window.performance.timing;
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`[Performance] ${pageName} loaded in ${pageLoadTime}ms`);
    return pageLoadTime;
  }
  return null;
};

export const measureApiPerformance = async <T>(
  apiCall: () => Promise<T>,
  endpoint: string
): Promise<{ data: T; duration: number }> => {
  const start = performance.now();
  const data = await apiCall();
  const duration = performance.now() - start;
  
  console.log(`[API] ${endpoint} took ${duration.toFixed(2)}ms`);
  return { data, duration };
};

export const logBundleSize = () => {
  if (process.env.NODE_ENV === 'production') {
    // This would be integrated with your build process
    // For now, we'll just log that we're measuring bundle size
    console.log('[Performance] Bundle size monitoring enabled');
  }
};
