import html2canvas from 'html2canvas';

export async function captureScreenshot(): Promise<string | null> {
  try {
    const canvas = await html2canvas(document.documentElement, {
      // scale: 0.5,
      useCORS: true,
      logging: false,
      allowTaint: true,
      // scrollX: -window.scrollX,
      // scrollY: -window.scrollY,
      // windowWidth: document.documentElement.scrollWidth,
      // windowHeight: document.documentElement.scrollHeight,
    });
    
    // Convert canvas to blob then to base64
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png', 0.7);
    });
    
    if (!blob) return null;
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
}

export function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';
  let os = 'Unknown';

  // Detect browser
  if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('SamsungBrowser') > -1) {
    browserName = 'Samsung Browser';
    browserVersion = userAgent.match(/SamsungBrowser\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    browserName = 'Opera';
    browserVersion = userAgent.match(/(?:Opera|OPR)\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Trident') > -1) {
    browserName = 'Internet Explorer';
    browserVersion = userAgent.match(/Trident\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Edge') > -1) {
    browserName = 'Microsoft Edge';
    browserVersion = userAgent.match(/Edge\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Chrome') > -1) {
    browserName = 'Chrome';
    browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Safari') > -1) {
    browserName = 'Safari';
    browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
  }

  // Detect OS
  if (userAgent.indexOf('Windows') > -1) {
    os = 'Windows';
  } else if (userAgent.indexOf('Mac') > -1) {
    os = 'MacOS';
  } else if (userAgent.indexOf('Linux') > -1) {
    os = 'Linux';
  } else if (userAgent.indexOf('Android') > -1) {
    os = 'Android';
  } else if (userAgent.indexOf('like Mac') > -1) {
    os = 'iOS';
  }

  return {
    browser: `${browserName} ${browserVersion}`,
    os,
    userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    online: navigator.onLine,
    platform: navigator.platform,
  };
}

export function getPageInfo() {
  return {
    url: window.location.href,
    title: document.title,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
  };
}
