import pThrottle from 'p-throttle'

const throttle = (fn: any, interval: number) => {
  const t = pThrottle({ limit: 1, interval })
  return t(fn)
}

export default throttle
