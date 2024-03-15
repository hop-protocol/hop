import { ClassicLevel } from 'classic-level'

// TODO: How does lodestar name and this
export const DBKeyEncodingOptions: any = {
  keyEncoding: 'string',
  valueEncoding: 'json'
}

export abstract class DB extends ClassicLevel {}
