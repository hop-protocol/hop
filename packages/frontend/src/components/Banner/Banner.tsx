import React, { useState } from 'react'
import Alert from 'src/components/alert/Alert'

type Props = {
  children: any
}

function Banner(props: Props) {
  const [show, setShow] = useState<boolean>(true)
  const handleClose = () => {
    setShow(false)
  }

  return (
    <>
      {show && <div style={{
        backgroundColor: 'rgb(255, 244, 229)',
        display: 'flex',
        justifyContent: 'center'
      }}><Alert style={{
        maxWidth: '1450px',
        textAlign: 'center'
      }} severity="warning" onClose={handleClose}>
        {props.children}
      </Alert></div>}
    </>
  )
}

export default Banner
