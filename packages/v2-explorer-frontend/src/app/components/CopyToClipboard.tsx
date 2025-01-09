import React, { ReactNode } from 'react'
import { CopyToClipboard as CopyToClipboardLib } from 'react-copy-to-clipboard'

type Props = {
  onCopy: (text: string, result: boolean) => void
  text: string
  children: ReactNode
}

export function CopyToClipboard(props: Props) {
  const { onCopy, text, children } = props
  return (
    <CopyToClipboardLib text={text} onCopy={onCopy}>
      <div onClick={(event) => event.stopPropagation()} style={{ display: 'inline-block' }}>
        {children}
      </div>
    </CopyToClipboardLib>
  )
}
