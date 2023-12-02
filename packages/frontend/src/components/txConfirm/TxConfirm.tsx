import React, { FC } from 'react'
import { Modal } from 'src/components/Modal'
import Approval from 'src/components/txConfirm/Approval'
import ConfirmSend from 'src/components/txConfirm/ConfirmSend'
import ConfirmConvert from 'src/components/txConfirm/ConfirmConvert'
import AddLiquidity from 'src/components/txConfirm/AddLiquidity'
import { AddLiquidityAndStake } from 'src/components/txConfirm/AddLiquidityAndStake'
import { UnstakeAndRemoveLiquidity } from 'src/components/txConfirm/UnstakeAndRemoveLiquidity'
import { TxList } from 'src/components/txConfirm/TxList'
import RemoveLiquidity from 'src/components/txConfirm/RemoveLiquidity'
import ConfirmStake from 'src/components/txConfirm/ConfirmStake'
import WithdrawStake from 'src/components/txConfirm/WithdrawStake'
import WrapToken from 'src/components/txConfirm/WrapToken'
import UnwrapToken from 'src/components/txConfirm/UnwrapToken'
import WithdrawReview from 'src/components/txConfirm/WithdrawReview'
import { ApproveAndStake } from 'src/components/txConfirm/ApproveAndStake'
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
    send: ConfirmSend,
    convert: ConfirmConvert,
    addLiquidity: AddLiquidity,
    addLiquidityAndStake: AddLiquidityAndStake,
    removeLiquidity: RemoveLiquidity,
    unstakeAndRemoveLiquidity: UnstakeAndRemoveLiquidity,
    stake: ConfirmStake,
    withdrawStake: WithdrawStake,
    wrapToken: WrapToken,
    unwrapToken: UnwrapToken,
    withdrawReview: WithdrawReview,
    approveAndStake: ApproveAndStake,
    txList: TxList
  }

  const Component: FC = components[kind]
  if (!Component) {
    return null
  }

  const handleClose = () => {
    if (onConfirm) {
      onConfirm(false)
    }
  }

  return (
    <Modal onClose={handleClose}>
      <Component onConfirm={onConfirm} {...inputProps} />
    </Modal>
  )
}

export default TxConfirm
