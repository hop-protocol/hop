import React from 'react'
import { Circle, Icon } from 'src/components/ui'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

export function DelegateIcon (props: any) {
  const { delegate } = props
  return (
    <Circle style={{ background: '#fff', border: '1px solid #fff' }} width={45} height={45}>
      {delegate.avatar && (
        <Icon src={delegate.avatar} width={45} alt={delegate?.ensName?.substr(0, 2) || '?'} style={{ fontSize: '2rem' }} onError={(event: any) => {
          event.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAPFBMVEXT09PZ2dlvb29kZGRYWFhNTU1DQ0M4ODhCQkJLS0siIiLg4OB0dHQGBgYlJSUoKCgtLS1fX19UVFQ8PDxP1g+TAAABX0lEQVR4nO3dOVLDAAAEQcm3LHHY/P+vKCChCKDIRur+weRbtcPL69v79Xq9XW7TeXX68jh+c/i/468epz94nv9guvxwH6Z53LJ5Gc7jsGXjYQeFz80XnhS2KexT2KewT2Gfwr618LH5wqPCNoV9CvsU9insU9insE9hn8I+hX0K+xT2KexT2KewT2HfLgoPCtsU9insU9insE9hn8I+hX0K+xT2KexT2KewT2Gfwj6FfQr7FPYp7FPYt4vFkMI4hX0K+xT2KexT2KewT2Gfwj6FfQr7FPYp7FPYp7BPYZ/CPoV9CvsU9u3iZ0ZhnMI+hX0K+xT2KexT2KewT2Gfwj6FfQr7FPYp7FPYp7BPYZ/CvrXwrLBNYZ/CPoV9CvsU9insU9insE9hn8I+hX0K+xT2KexT2KewT2HfWjhtvvCisE1hn8I+hX0K+xT2KexT2LePwnncsnkZ7sthy5aPT3rrDlIBlNiKAAAAAElFTkSuQmCC'
        }} />
      )}
      {(!delegate.avatar && delegate.address) && (
        <Jazzicon diameter={45} seed={jsNumberForAddress(delegate.address?.address!)} />
      )}
    </Circle>
  )
}
