import React, { SyntheticEvent, useState, useEffect, useMemo } from 'react'
import { Contract, utils } from 'ethers'
import TextField from '@mui/material/TextField'
import Textarea from '@mui/material/TextareaAutosize'
import Box from '@mui/material/Box'

function TextInput (props: any = {}) {
  const [value, setValue] = useState('')
  const handleChange = (event: any) => {
    const val = event.target.value
    setValue(val)
    if (props.onChange) {
      props.onChange(val)
    }
  }
  useEffect(() => {
    setValue(props.value)
  }, [props.value])
  let el: any
  if (props.variant === 'textarea') {
    el = (
      <Textarea
        readOnly={props.readOnly}
        disabled={props.disabled}
        placeholder={props.placeholder}
        value={value || ''}
        onChange={handleChange}
      />
    )
  } else {
    el = (
      <TextField
        placeholder={props.placeholder}
        type='text'
        value={value || ''}
        onChange={handleChange}
        fullWidth
      />
    )
  }
  return el
}

type AbiMethodFormProps = {
  abi: any
  provider: any
  contractAddress: string
  onChange: (txData: any) => void
}

export function AbiMethodForm (props: AbiMethodFormProps) {
  const { abi: abiObj, contractAddress, provider, onChange } = props
  const cacheKey = JSON.stringify(abiObj)
  const [args, setArgs] = useState<any>(() => {
    const defaultArgs: any = {}
    try {
      return JSON.parse(localStorage.getItem(cacheKey) as any) || defaultArgs
    } catch (err) {
      return defaultArgs
    }
  })
  const [gasLimit, setGasLimit] = useState<string>(() => {
    return localStorage.getItem('gasLimit') || ''
  })
  const [gasPrice, setGasPrice] = useState<string>(() => {
    return localStorage.getItem('gasPrice') || ''
  })
  const [value, setValue] = useState<string>(() => {
    return localStorage.getItem('value') || ''
  })
  const [nonce, setNonce] = useState<string>(() => {
    return localStorage.getItem('nonce') || ''
  })
  const [blockTag, setBlockTag] = useState<string>(() => {
    return localStorage.getItem('blockTag') || ''
  })
  const [methodSig, setMethodSig] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [result, setResult] = useState('')
  const [callStatic, setCallStatic] = useState<boolean>(() => {
    try {
      return localStorage.getItem('callStatic') === 'true'
    } catch (err) {}
    return false
  })
  const [txhash, setTxhash] = useState<any>(null)
  const [tx, setTx] = useState<any>(null)

  useEffect(() => {
    if (!abiObj) {
      setTx({ data: '' })
    }
  }, [abiObj])

  useEffect(() => {
    const tx: any = {
      to: contractAddress || undefined,
      value: value || undefined,
      gasPrice: gasPrice
        ? utils.parseUnits(gasPrice, 'gwei').toString()
        : undefined,
      gasLimit: gasLimit || undefined,
      nonce: nonce || undefined
    }

    try {
      setError('')
      if (abiObj) {
        const iface = new utils.Interface([abiObj])

        const parsed = args
        for (const key in parsed) {
          const value = parsed[key]
          try {
            const p = JSON.parse(value)
            if (Array.isArray(p)) {
              parsed[key] = p
            }
          } catch (err) {}
        }

        const data = iface.encodeFunctionData(
          abiObj.name,
          Object.values(parsed).slice(0, abiObj?.inputs?.length ?? 0)
        )
        tx.data = data
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    }

    setTx(tx)
    if (onChange) {
      onChange(tx)
    }
  }, [
    abiObj,
    contractAddress,
    gasPrice,
    gasLimit,
    value,
    nonce,
    args
  ])

  useEffect(() => {
    try {
      setMethodSig('')
      if (abiObj.signature) {
        setMethodSig(abiObj.signature)
      } else {
        const iface = new utils.Interface([abiObj])
        const keys = Object.keys(iface.functions)
        if (keys.length) {
          const _methodSig = `0x${(window as any)
            .keccak256(keys[0])
            .toString('hex')
            .slice(0, 8)}`
          setMethodSig(_methodSig)
        }
      }
    } catch (err) {}
  }, [abiObj])

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    try {
      if (error) {
        throw new Error(error)
      }
      if (!contractAddress) {
        throw new Error('contract address is required')
      }
      setTxhash(null)
      setResult('')
      const contract = new Contract(contractAddress, [abiObj], provider)

      const txOpts: any = {
        gasPrice: tx.gasPrice,
        gasLimit: tx.gasLimit,
        value: tx.value
      }

      if (callStatic && blockTag) {
        if (!Number.isNaN(Number(blockTag))) {
          txOpts.blockTag = Number(blockTag)
        } else {
          txOpts.blockTag = blockTag
        }
      }

      const contractArgs = Object.values(args).reduce(
        (acc: any[], val: any, i: number) => {
          if (abiObj.inputs[i].type?.endsWith('[]') && typeof val === 'string') {
            val = val.split(',').map((x: string) => x.trim())
          }
          acc.push(val)
          return acc
        },
        []
      )

      console.log('contract args:', contractArgs)
      const res = await contract[callStatic ? 'callStatic' : 'functions'][
        abiObj.name
      ](...contractArgs, txOpts)
      console.log('result:', result)
      setTxhash(res?.hash)
      setResult(JSON.stringify(res, null, 2))
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    }
  }
  const updateGasLimit = (val: string) => {
    setGasLimit(val)
    localStorage.setItem('gasLimit', val)
  }
  const updateGasPrice = (val: string) => {
    setGasPrice(val)
    localStorage.setItem('gasPrice', val)
  }
  const updateValue = (val: string) => {
    setValue(val)
    localStorage.setItem('value', val)
  }
  const updateNonce = (val: string) => {
    setNonce(val)
    localStorage.setItem('nonce', val)
  }
  const updateBlockTag = (val: string) => {
    setBlockTag(val)
    localStorage.setItem('blockTag', val)
  }
  const updateCallStatic = (event: any) => {
    const { checked } = event.target
    setCallStatic(checked)
    localStorage.setItem('callStatic', checked)
  }

  const stateMutability = abiObj?.stateMutability
  const methodType = abiObj?.type
  const isWritable =
    ['nonpayable', 'payable'].includes(stateMutability) &&
    methodType === 'function'

  if (abiObj?.type !== 'function') {
    return null
  }

  return (
    <div>
      <Box>
        <label style={{ marginBottom: '0.5rem' }}>
          <strong>{abiObj.name}</strong>{' '}
          {stateMutability ? `(${stateMutability})` : null} (
          {isWritable ? 'writable' : 'read-only'})
        </label>
        {!!methodSig && (
          <div style={{ margin: '0.5rem 0' }}>
            method signature: <code>{methodSig}</code>
          </div>
        )}
        {abiObj?.inputs?.map((input: any, i: number) => {
          const convertTextToHex = (event: SyntheticEvent) => {
            event.preventDefault()
            try {
              const newArgs = Object.assign({}, args)
              if (!utils.isHexString(args[i])) {
                newArgs[i] = utils.hexlify(Buffer.from(args[i]))
                localStorage.setItem(cacheKey, JSON.stringify(newArgs))
                setArgs(newArgs)
              }
            } catch (err) {
              alert(err)
            }
          }
          let inputValue = args[i]
          if (Array.isArray(inputValue)) {
            try {
              inputValue = JSON.stringify(inputValue)
            } catch (err) {}
          }
          return (
            <Box key={i} mb={2}>
              <Box>
                <label>
                  {input.name} ({input.type}) *{' '}
                  {input.type?.startsWith('bytes') ? (
                    <>
                      <span>
                        (
                        {input.type?.includes('[]')
                          ? 'must be array of hex'
                          : 'must be hex'}
                        )
                      </span>
                      &nbsp;
                      <button onClick={convertTextToHex}>hexlify</button>
                    </>
                  ) : null}
                </label>
              </Box>
              <TextInput
                value={inputValue}
                placeholder={input.type}
                onChange={(val: string) => {
                  val = val.trim()
                  const newArgs = Object.assign({}, args)
                  if (input.type === 'address') {
                    if (val) {
                      try {
                        val = utils.getAddress(val)
                      } catch (err) {
                        // noop
                      }
                    }
                  }
                  newArgs[i] = val
                  localStorage.setItem(cacheKey, JSON.stringify(newArgs))
                  setArgs(newArgs)
                }}
              />
            </Box>
          )
        })}
        {/*
        {abiObj?.inputs.length ? <small>* = Required</small> : null}
        */}
        {/*}
        <div style={{ padding: '1rem' }}>
          <label style={{ marginBottom: '0.5rem' }}>
            Transaction options (optional)
          </label>
          <label>gas limit</label>
          <TextInput
            value={gasLimit}
            placeholder={'gas limit'}
            onChange={updateGasLimit}
          />
          <label>gas price (gwei)</label>
          <TextInput
            value={gasPrice}
            placeholder={'gas price'}
            onChange={updateGasPrice}
          />
          <label>value (wei)</label>
          <TextInput
            value={value}
            placeholder={'value'}
            onChange={updateValue}
          />
          <label>nonce</label>
          <TextInput
            value={nonce}
            placeholder={'nonce'}
            onChange={updateNonce}
          />
          <label>block tag (for static calls)</label>
          <TextInput
            value={blockTag}
            placeholder={'latest'}
            onChange={updateBlockTag}
          />
        </div>
        */}
        {abiObj?.outputs.length ? (
          <div>
            <label style={{ marginBottom: '0.5rem' }}>Return values</label>
            <ol>
              {abiObj?.outputs?.map((obj: any) => {
                return (
                  <li key={obj.name}>
                    {obj.name} ({obj.type})
                  </li>
                )
              })}
            </ol>
          </div>
        ) : null}
        {/*
        {tx && (
          <div>
            <label style={{ marginBottom: '0.5rem' }}>Transaction object</label>
            <pre>{JSON.stringify(tx, null, 2)}</pre>
          </div>
        )}
        */}
        {/*
        <div>
          <input
            type='checkbox'
            checked={callStatic}
            onChange={updateCallStatic}
          />
          call static
        </div>
        <div>
          <button type='submit'>Submit</button>
        </div>
        */}
      </Box>
      <pre>{result}</pre>
    </div>
  )
}
