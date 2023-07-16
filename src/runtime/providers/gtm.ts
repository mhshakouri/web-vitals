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

  const rating = metric.rating

  const attribution = metric.attribution

  const debugTarget = attribution ? attribution.largestShiftTarget || attribution.element || attribution.eventTarget || '' : '(not set)'

  let valueRounded
  if (metric.valueRounded && metric.valueRounded.length) {
    valueRounded = metric.valueRounded
  } else {
    valueRounded = Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value)
  }
  let deltaRounded
  if (metric.deltaRounded && metric.deltaRounded.length) {
    deltaRounded = metric.deltaRounded
  } else {
    deltaRounded = Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta)
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
      valueRounded,
      deltaRounded,
      metric_rating: rating,
      debug_target: debugTarget,
      debug_event: attribution ? attribution.eventType || '' : '',
      debug_timing: attribution ? attribution.loadState || '' : '',
      event_time: attribution ? attribution.largestShiftTime || (attribution.lcpEntry && attribution.lcpEntry.startTime) || attribution.eventTime || '' : '',
      speed: getConnectionSpeed()
    }
  }

  if (options.debug) {
    logDebug(metric.name, JSON.stringify(event, null, 2))
  }

  window.dataLayer.push(event)
}
