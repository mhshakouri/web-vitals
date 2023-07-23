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

  // eslint-disable-next-line no-console
  console.log('[nuxt vitals]', metric.name, metric.value, context, {
    context,
    metric,
    options
  })

  const name: string = metric.name
  if (name.toLocaleLowerCase() === 'inp') {
    console.log('inp details, metric')
    console.log(JSON.stringify(metric))
    console.log('inp details, options')
    console.log(JSON.stringify(options))
    console.log('inp details, context')
    console.log(JSON.stringify(context))
    console.log('inp details, event')
    console.log(JSON.stringify(event, null, 2))
  }
}
