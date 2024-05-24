import AddLiquidity from '#components/txConfirm/AddLiquidity.js'
import Approval from '#components/txConfirm/Approval.js'
import ConfirmConvert from '#components/txConfirm/ConfirmConvert.js'
import ConfirmSend from '#components/txConfirm/ConfirmSend.js'
import ConfirmStake from '#components/txConfirm/ConfirmStake.js'
import React, { FC } from 'react'
import RemoveLiquidity from '#components/txConfirm/RemoveLiquidity.js'
import UnwrapToken from '#components/txConfirm/UnwrapToken.js'
import WithdrawReview from '#components/txConfirm/WithdrawReview.js'
import WithdrawStake from '#components/txConfirm/WithdrawStake.js'
import WrapToken from '#components/txConfirm/WrapToken.js'
import { AddLiquidityAndStake } from '#components/txConfirm/AddLiquidityAndStake.js'
import { ApproveAndStake } from '#components/txConfirm/ApproveAndStake.js'
import { Modal } from '#components/Modal/index.js'
import { TxList } from '#components/txConfirm/TxList.js'
import { UnstakeAndRemoveLiquidity } from '#components/txConfirm/UnstakeAndRemoveLiquidity.js'
import { useApp } from '#contexts/AppContext/index.js'

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
