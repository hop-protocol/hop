import React, { useState, useEffect } from 'react'

export type Settings = {
  slippageTolerance: number,
  setSlippageTolerance: (number) => void,
  deadlineMinutes: number,
  setDeadlineMinutes: (number) => void
}

const useSettings = () => {
  const storedSlippageTolerance = localStorage.getItem('slippageTolerance')
  const storedDeadlineMinutes = localStorage.getItem('transactionDeadline')

  const [slippageTolerance, setSlippageTolerance] = useState<number>(
    storedSlippageTolerance ? Number(storedSlippageTolerance) : 0.5
  )
  const [deadlineMinutes, setDeadlineMinutes] = useState<number>(
    storedDeadlineMinutes ? Number(storedDeadlineMinutes) : 20
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
    setDeadlineMinutes
  }
}

export default useSettings
