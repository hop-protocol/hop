import React, { FC } from 'react'
import Modal from 'src/components/modal/Modal'

type DelegateModalProps = {
  isOpen: boolean
  onClose?: () => void
}

const DelegateModal: FC<DelegateModalProps> = props => {
  const { isOpen, onClose } = props
  return (
    <>
      isOpen &&
        <Modal
          onClose={onClose}
        >
          Hello
        </Modal>
    </>
  )
}

export default DelegateModal
