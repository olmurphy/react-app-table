const { onCLS, onFCP, onINP, onLCP, onTTFB } = require("web-vitals");

/**
 * Sends the collected web vitals metrics to the analytics endpoint.
 *
 * @param {Object} metrics - The metrics object containing the performance data.
 */
function sendToAnalytics(metrics: any) {
  console.log(metrics);
}

/**
 * Initializes the collection of web vitals metrics and sends them to the analytics endpoint.
 *
 * Core Web Vitals:
 * - CLS (Cumulative Layout Shift): Measures visual stability. It quantifies how much the page layout shifts during the entire lifespan of the page.
 * - FCP (First Contentful Paint): Measures the time from when the page starts loading to when any part of the page's content is rendered on the screen.
 * - INP (Interaction to Next Paint): Measures the latency of user interactions with the page. It captures the time from when a user interacts with the page to when the next frame is painted.
 * - LCP (Largest Contentful Paint): Measures loading performance. It marks the point in the page load timeline when the page's main content has likely loaded.
 * - TTFB (Time to First Byte): Measures the responsiveness of a web server. It captures the time from when a request is made to when the first byte of the response is received.
 */
export function initWebVitals() {
  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
