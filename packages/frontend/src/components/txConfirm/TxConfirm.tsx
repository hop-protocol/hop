import React, { ReactNode } from 'react'
import Modal from 'src/components/modal/Modal'
import Approval from 'src/components/txConfirm/Approval'
import Send from 'src/components/txConfirm/Send'
import Swap from 'src/components/txConfirm/Swap'
import AddLiquidity from 'src/components/txConfirm/AddLiquidity'

type kind = 'approval' | 'send' | 'swap' | 'addLiquidity'

interface Props {
  kind: kind
  inputProps?: any
  onConfirm: (confirmed: boolean) => void
}

const TxConfirm = (props: Props) => {
  const { kind, inputProps, onConfirm } = props
  let component: ReactNode = null
  if (kind === 'approval') {
    component = <Approval onConfirm={onConfirm} {...inputProps} />
  } else if (kind === 'send') {
    component = <Send onConfirm={onConfirm} {...inputProps} />
  } else if (kind === 'swap') {
    component = <Swap onConfirm={onConfirm} {...inputProps} />
  } else if (kind === 'addLiquidity') {
    component = <AddLiquidity onConfirm={onConfirm} {...inputProps} />
  } else {
    return null
  }

  const handleClose = () => {
    onConfirm(false)
  }

  return <Modal onClose={handleClose}>{component}</Modal>
}

export default TxConfirm
