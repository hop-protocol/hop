import React, { FC } from 'react'
import Modal from 'src/components/modal/Modal'
import Approval from 'src/components/txConfirm/Approval'
import Send from 'src/components/txConfirm/Send'
import Convert from 'src/components/txConfirm/Convert'
import AddLiquidity from 'src/components/txConfirm/AddLiquidity'
import { useApp } from 'src/contexts/AppContext'

const TxConfirm: FC = props => {
  const { txConfirm } = useApp()
  const txConfirmParams = txConfirm?.txConfirmParams
  if (!txConfirmParams) {
    return null
  }
  const { kind, inputProps, onConfirm } = txConfirmParams
  const components: { [key: string]: FC<any> } = {
    approval: Approval,
    send: Send,
    convert: Convert,
    addLiquidity: AddLiquidity
  }

  const Component: FC = components[kind]
  if (!Component) {
    return null
  }

  const handleClose = () => {
    onConfirm()
  }

  return (
    <Modal onClose={handleClose}>
      <Component onConfirm={onConfirm} {...inputProps} />
    </Modal>
  )
}

export default TxConfirm
