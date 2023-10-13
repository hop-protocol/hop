import getEncodedValidationData from 'src/utils/getEncodedValidationData'

describe.only('getEncodedValidationData', () => {
  it('getEncodedValidationData', () => {
    const recipient = '0x9e89EAC1F28Ac6A0E5FeDadE151b60A16E0c1a62'
    const hash = '0x9cd2afc28cfc4943bb0568d32864df01bc6c812a3fc1cb58485adac5eedb0dd1'
    const number = 18073334

    const validationData = getEncodedValidationData(recipient, hash, number)
    const expected = '0x9e89eac1f28ac6a0e5fedade151b60a16e0c1a628003405b9cd2afc28cfc4943bb0568d32864df01bc6c812a3fc1cb58485adac5eedb0dd1000000000000000000000000000000000000000000000000000000000113c6f6'
    expect(validationData).toEqual(expected)
  })
})
