import React, { FC, useEffect, useState, ChangeEvent } from 'react'
import MuiSlider from '@mui/material/Slider'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  },
  title: {
    marginBottom: '2rem',
  },
  amounts: {
    fontSize: '2rem',
  },
  action: {},
  sendButton: {},
  sliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  slider: {
    width: '100%',
    maxWidth: '260px',
    margin: '0 auto',
  },
}))

type SliderProps = {
  onChange?: (value: number) => void,
  value?: number
  defaultValue?: number
}

const Slider: FC<SliderProps> = (props: SliderProps) => {
  const styles = useStyles()
  const [value, setValue] = useState<number>(props?.defaultValue ?? 0)
  const handleChange = (event: any, _value: number | number[]) => {
    setValue(_value as number)
    if (props.onChange) {
      props.onChange(_value as number)
    }
  }

  useEffect(() => {
    if (typeof props.value === 'number') {
      const _value = Number(Math.max(0, Math.min(props.value || 0, 100)).toFixed(0))
      setValue(_value)
    }
  }, [props?.value])

  return (
    <div className={styles.sliderContainer}>
      <Typography variant="body1" color="textPrimary">
        Amount
      </Typography>
      <Typography variant="h4" color="textPrimary">
        {value}%
      </Typography>
      <div className={styles.slider}>
        <MuiSlider
          value={value}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={100}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export { Slider }
