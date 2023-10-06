import React, { useEffect } from 'react'
import { useInterval } from 'usehooks-ts'

export function useEffectInterval (fn: any, args: any[], delay: number) {
  useEffect(fn, args)
  useInterval(fn, delay)
}
