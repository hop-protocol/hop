import { useState, useEffect } from 'react'
import { EventEmitter } from 'events'

const useEvents = () => {
  const [keyboard] = useState<EventEmitter>(() => {
    return new EventEmitter()
  })

  useEffect(() => {
    const cb = (event: any) => {
      if (
        event.key === 'Escape' ||
        event.key === 'Esc' ||
        event.keyCode === 27
      ) {
        keyboard.emit('escape')
      }
    }

    window.addEventListener('keydown', cb, true)
    return () => {
      window.removeEventListener('keydown', cb, true)
    }
  }, [keyboard])

  return {
    keyboard
  }
}

export default useEvents
