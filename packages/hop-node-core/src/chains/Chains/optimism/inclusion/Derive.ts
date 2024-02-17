export type Frame = {
  channelId: string
  frameNumber: number
  data: Buffer
  isLast: boolean
}

interface UnmarshalBinaryRes {
  frame: Frame
  offset: number
}

class Derive {
  readonly #DerivationVersion0: number = 0
  readonly #MaxFrameLen: number = 1_000_000
  readonly #DataLengths: Record<string, number>

  constructor () {
    this.#DataLengths = {
      ChannelIDLength: 16,
      FrameNumberLength: 2,
      FrameDataLength: 4,
      IsLastLength: 1
    }
  }

  async parseFrames (data: Buffer | string): Promise<Frame[]> {
    if (typeof data === 'string') {
      if (data.startsWith('0x')) {
        data = data.slice(2)
      }
      data = Buffer.from(data, 'hex')
    }

    if (data.length === 0) {
      throw new Error('data array must not be empty')
    }

    if (data[0] !== this.#DerivationVersion0) {
      throw new Error(`invalid derivation format byte: got ${data[0]}`)
    }

    let buf = data.subarray(1)
    const frames: Frame[] = []
    if (buf.length > 0) {
      try {
        const { frame, offset } = await this.#unmarshalBinary(buf)
        frames.push(frame)
        buf = buf.subarray(offset)
      } catch (err) {
        throw new Error(`parsing frame ${frames.length}: ${err.message}`)
      }
    }

    if (buf.length !== 0) {
      throw new Error(`did not fully consume data: have ${frames.length} frames and ${buf.length} bytes left`)
    }

    if (frames.length === 0) {
      throw new Error('was not able to find any frames')
    }

    return frames
  }

  async #unmarshalBinary (buf: Buffer): Promise<UnmarshalBinaryRes> {
    let offset: number = 0

    if (buf.length < offset + this.#DataLengths.ChannelIDLength) {
      throw new Error('reading channel_id: unexpected EOF')
    }
    const channelId: string = buf.subarray(offset, offset + this.#DataLengths.ChannelIDLength).toString('hex')
    offset += this.#DataLengths.ChannelIDLength

    if (buf.length < offset + this.#DataLengths.FrameNumberLength) {
      throw new Error('reading frameNumber: unexpected EOF')
    }
    const frameNumber: number = buf.readUInt16BE(offset)
    offset += this.#DataLengths.FrameNumberLength

    if (buf.length < offset + this.#DataLengths.FrameDataLength) {
      throw new Error('reading frameDataLength: unexpected EOF')
    }
    const frameLength: number = buf.readUInt32BE(offset)
    offset += this.#DataLengths.FrameDataLength

    if (frameLength > this.#MaxFrameLen) {
      throw new Error(`frameDataLength is too large: ${frameLength}`)
    }

    if (buf.length < offset + frameLength) {
      throw new Error('reading frameData: unexpected EOF')
    }
    const data = buf.subarray(offset, offset + frameLength)
    offset += frameLength

    if (buf.length < offset + this.#DataLengths.IsLastLength) {
      throw new Error('reading isLast: unexpected EOF')
    }
    const isLastByte = buf.readUInt8(offset)
    offset += this.#DataLengths.IsLastLength

    let isLast: boolean
    if (isLastByte === 0) {
      isLast = false
    } else if (isLastByte === 1) {
      isLast = true
    } else {
      throw new Error('invalid byte as isLast')
    }

    return {
      frame: {
        channelId,
        frameNumber,
        data,
        isLast
      },
      offset
    }
  }
}

export default Derive
