// 'use client';

// import { useEffect } from 'react';
// import { usePathname } from 'next/navigation';
// import * as Sentry from '@sentry/nextjs';
// import { startPerformanceMonitoring, measurePageLoad } from '@/lib/performance';

// export default function PerformanceMonitor() {
//   const pathname = usePathname();

//   useEffect(() => {
//     // Initialize performance monitoring
//     startPerformanceMonitoring();
    
//     // Track page views
//     if (process.env.NODE_ENV === 'production') {
//       Sentry.configureScope((scope) => {
//         scope.setTag('page', pathname);
//       });
      
//       // Measure and log page load time
//       const loadTime = measurePageLoad(pathname || 'unknown');
      
//       // Send page load metrics to Sentry
//       Sentry.metrics.distribution('page.load_time', loadTime || 0, {
//         unit: 'millisecond',
//         tags: { path: pathname || 'unknown' },
//       });
//     }
//   }, [pathname]);

//   return null; // This component doesn't render anything
// }
