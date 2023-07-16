
import { logError } from './utils'

export async function webVitals ({ route, options, sendToAnalytics }) {
  const context = {
    fullPath: route.fullPath,
    href: location.href
  }

  // TODO: get page path
  // if (route.matched.length) {
  //   context.page = route.matched[route.matched.length - 1].components.default.options.__file || page
  // }

  try {
    const { onCLS, onFID, onLCP, onTTFB, onFCP, onINP } = await import('web-vitals/attribution').then((r: any) => r.default || r)
    onFID(metric => sendToAnalytics(context, metric, { ...options, reportAllChanges: true }))
    onTTFB(metric => sendToAnalytics(context, metric, { ...options, reportAllChanges: true }))
    onLCP(metric => sendToAnalytics(context, metric, { ...options, reportAllChanges: true }))
    onCLS(metric => sendToAnalytics(context, metric, { ...options, reportAllChanges: true }))
    onFCP(metric => sendToAnalytics(context, metric, { ...options, reportAllChanges: true }))
    onINP(metric => sendToAnalytics(context, metric, { ...options, reportAllChanges: true }))
  } catch (err) {
    logError(err)
  }
}
