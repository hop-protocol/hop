import React, { useState } from 'react'

export type Settings = {
  slippageTolerance: number,
  setSlippageTolerance: (number) => void,
  deadlineMinutes: number,
  setDeadlineMinutes: (number) => void
}

const useSettings = () => {
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5)
  const [deadlineMinutes, setDeadlineMinutes] = useState<number>(20)

  return {
    slippageTolerance,
    setSlippageTolerance,
    deadlineMinutes,
    setDeadlineMinutes
  }
}

export default useSettings
