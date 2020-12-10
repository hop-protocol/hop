import React, { ReactNode, FC } from 'react'
import Modal from 'src/components/modal/Modal'
import Approval from 'src/components/txConfirm/Approval'
import Send from 'src/components/txConfirm/Send'
import Swap from 'src/components/txConfirm/Swap'
import AddLiquidity from 'src/components/txConfirm/AddLiquidity'
import { useApp } from 'src/contexts/AppContext'

const TxConfirm: FC = props => {
  const { txConfirm } = useApp()
  const txConfirmParams = txConfirm?.txConfirmParams
  if (!txConfirmParams) {
    return null
  }
  const { kind, inputProps, onConfirm } = txConfirmParams
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
    onConfirm()
  }

  return <Modal onClose={handleClose}>{component}</Modal>
}

export default TxConfirm
