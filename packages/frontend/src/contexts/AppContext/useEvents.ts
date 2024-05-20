import { EventEmitter } from 'events'
import { useEffect, useState } from 'react'

export interface Events {
  keypress: EventEmitter
}

const useEvents = (): Events => {
  // logger.debug('useEvents render')
  const [keypress] = useState<EventEmitter>(() => {
    return new EventEmitter()
  })

  useEffect(() => {
    const cb = (event: any) => {
      if (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27) {
        keypress.emit('escape', event)
      }
    }

    window.addEventListener('keydown', cb, true)
    return () => {
      window.removeEventListener('keydown', cb, true)
    }
  }, [keypress])

  return {
    keypress,
  }
}

export default useEvents
