export function batch(size, init) {
  let cache = []
  let index = 0

  return function simulation(simulator, time, callback) {
    return {
      start: () => {
        const interval = setInterval(() => {
          if(cache.length - index < size) {
            if(cache.length === 0) {
              cache = simulator(size, init)
            }

            cache = [...cache.slice(-size+1), ...simulator(size, cache.slice(-1))]
            index = 0
          }

          callback(cache[index], cache.slice(0, index))

          index += 1
        }, time)

        return {
          stop: () => {
            clearInterval(interval)
            return simulation(simulator, time, callback)
          }
        }
      }
    }
  }
}
