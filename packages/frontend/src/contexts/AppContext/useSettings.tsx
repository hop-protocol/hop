import React, { useState, useEffect, useCallback } from 'react'

export type Settings = {
  slippageTolerance: number,
  setSlippageTolerance: (number) => void,
  deadlineMinutes: number,
  setDeadlineMinutes: (number) => void
  deadline: () => number
}

const useSettings = (): Settings => {
  const storedSlippageTolerance = localStorage.getItem('slippageTolerance')
  const storedDeadlineMinutes = localStorage.getItem('transactionDeadline')

  const [slippageTolerance, setSlippageTolerance] = useState<number>(
    storedSlippageTolerance ? Number(storedSlippageTolerance) : 0.5
  )
  const [deadlineMinutes, setDeadlineMinutes] = useState<number>(
    storedDeadlineMinutes ? Number(storedDeadlineMinutes) : 30
  )

  const deadline = useCallback(() =>
    (Date.now() / 1000 + Number(deadlineMinutes) * 60) | 0,
    [deadlineMinutes]
  )

  useEffect(() => {
    localStorage.setItem('slippageTolerance', slippageTolerance.toString())
  }, [slippageTolerance])

  useEffect(() => {
    localStorage.setItem('transactionDeadline', deadlineMinutes.toString())
  }, [deadlineMinutes])

  return {
    slippageTolerance,
    setSlippageTolerance,
    deadlineMinutes,
    setDeadlineMinutes,
    deadline
  }
}

export default useSettings
