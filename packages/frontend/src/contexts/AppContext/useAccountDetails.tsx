import { useState } from 'react'

export type AccountDetails = {
  open: boolean
  show: (open: boolean) => void
}

export const useAccountDetails = (): AccountDetails => {
  const [open, show] = useState<boolean>(false)

  return {
    open,
    show
  }
}
