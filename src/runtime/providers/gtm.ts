import { logError, logDebug, getConnectionSpeed } from '../utils'

declare global {
  interface Window {
    dataLayer?: any[]
  }
}

export interface Options {
  debug: boolean
}

export function sendToAnalytics ({ fullPath, href }, metric, options: Options) {
  if (!window.dataLayer) {
    logError('window.dataLayer is undefined, probably GTM is not installed')
    return
  }

  const event = {
    event: 'webVitals',
    webVitalsMeasurement: {
      page: fullPath,
      href,
      name: metric.name,
      id: metric.id,
      value: metric.value,
      delta: metric.delta,
      valueRounded: metric.valueRounded,
      deltaRounded: metric.deltaRounded,
      metric_rating: metric.rating,
      debug_target: metric.debugTarget,
      debug_event: metric.attribution ? metric.attribution.eventType || '' : '',
      debug_timing: metric.attribution ? metric.attribution.loadState || '' : '',
      event_time: metric.attribution ? metric.attribution.largestShiftTime || (metric.attribution.lcpEntry && metric.attribution.lcpEntry.startTime) || metric.attribution.eventTime || '' : '',
      speed: getConnectionSpeed()
    }
  }

  if (options.debug) {
    logDebug(metric.name, JSON.stringify(event, null, 2))
  }

  window.dataLayer.push(event)
}
