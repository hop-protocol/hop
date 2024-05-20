import React, { useState } from 'react'
import { Alert } from 'src/components/Alert'
import { useThemeMode } from 'src/theme/ThemeProvider'

type Props = {
  children: any
}

export function Banner(props: Props) {
  const { isDarkMode } = useThemeMode()
  const [show, setShow] = useState<boolean>(true)
  const handleClose = () => {
    setShow(false)
  }

  return (
    <>
      {show && <div style={{
        backgroundColor: isDarkMode ? 'rgb(25, 15, 0)' : 'rgb(255, 244, 229)',
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
