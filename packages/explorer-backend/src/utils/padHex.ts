import toHex from 'to-hex'

export function padHex (hex: string) {
  return toHex(hex, { evenLength: true, addPrefix: true })
}
