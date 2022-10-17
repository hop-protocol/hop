import React, { useEffect } from 'react'
import { useInterval } from 'react-use'

export function useEffectInterval (fn: any, args: any[], delay: number) {
  useEffect(fn, args)
  useInterval(fn, delay)
}
