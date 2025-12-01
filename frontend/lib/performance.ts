import { Metric, ReportCallback } from 'web-vitals';

export type WebVitalsMetric = Metric & {
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';
};

type ReportHandler = (metric: WebVitalsMetric) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      // Core Web Vitals (2023)
      onCLS(onPerfEntry as ReportCallback);
      onINP(onPerfEntry as ReportCallback);
      onLCP(onPerfEntry as ReportCallback);
      
      // Additional helpful metrics
      onFCP(onPerfEntry as ReportCallback);
      onTTFB(onPerfEntry as ReportCallback);
      
      // Note: FID is deprecated in favor of INP in 2023
      // If you still need FID, you can use onFID if available
      // but it's recommended to use INP for better user experience measurement
    }).catch(error => {
      console.error('Error loading web-vitals:', error);
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
