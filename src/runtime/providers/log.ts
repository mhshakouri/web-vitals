import { logDebug, getConnectionSpeed } from '../utils'

const eventListeners = []
// @ts-ignore
window.onVitalEvent = (listener) => {
  eventListeners.push(listener)
}

export function sendToAnalytics (context, metric, options: any) {
  const event = {
    date: new Date(),
    context,
    metric,
    options
  }
  eventListeners.forEach((listener) => {
    listener(event)
  })

  // simulating gtm event object

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

  const gtmevent = {
    event: 'webVitals',
    webVitalsMeasurement: {
      page: context.fullPath,
      href: context.href,
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
    logDebug(metric.name, JSON.stringify(gtmevent, null, 2))
  }

  // eslint-disable-next-line no-console
  console.log('[nuxt vitals]', metric.name, metric.value, context, {
    context,
    metric,
    options
  })
}
