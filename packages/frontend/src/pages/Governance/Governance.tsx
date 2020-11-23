import React, {
    FC,
    useState,
    useMemo,
    useEffect,
    ChangeEvent
  } from 'react'
  import { makeStyles } from '@material-ui/core/styles'
  import Box from '@material-ui/core/Box'
  import Typography from '@material-ui/core/Typography'
  import MenuItem from '@material-ui/core/MenuItem'
  import MuiButton from '@material-ui/core/Button'
  import ArrowDownIcon from '@material-ui/icons/ArrowDownwardRounded'
  import SendIcon from '@material-ui/icons/Send'
  import Grid from '@material-ui/core/Grid'
  import RaisedSelect from '../../components/selects/RaisedSelect'
  import GovernanceOverviewCard from './GovernanceOverviewCard'
  import ProposalOverviewCard from './ProposalOverviewCard'

  import Button from '../../components/buttons/Button'

  import { PROPOSAL_STATUSES } from '../../config/constants'
  
  import { utils as ethersUtils } from 'ethers'
  import Token from '../../models/Token'
  import Network from '../../models/Network'
  
  const useStyles = makeStyles(() => ({
    downArrow: {
      margin: '0.8rem',
      height: '2.4rem',
      width: '2.4rem'
    },
    switchDirectionButton: {
      padding: 0,
      minWidth: 0,
      margin: '1.0rem'
    },
    detailRow: {
      marginTop: '4.2rem',
      width: '46.0rem'
    },
    sendButton: {
      marginTop: '6.4rem',
      width: '30.0rem'
    }
  }))
  
  const Governance: FC = () => {
    const styles = useStyles()
  
    const networkOptions = useMemo<Network[]>(() => [
      new Network('kovan'),
      new Network('optimism'),
      new Network('arbitrum')
    ], [])
  
    const tokenOptions = useMemo<Token[]>(() => [
      new Token({
        symbol: 'ETH',
        tokenName: 'Ether',
        addresses: {},
        rates: {
          kovan: ethersUtils.parseEther('1'),
          arbitrum: ethersUtils.parseEther('0.998125000000000000'),
          optimism: ethersUtils.parseEther('0.977777000000000000')
        }
      }),
      new Token({
        symbol: 'DAI',
        tokenName: 'DAI Stablecoin',
        addresses: {},
        rates: {
          kovan: ethersUtils.parseEther('1'),
          arbitrum: ethersUtils.parseEther('0.998125000000000000'),
          optimism: ethersUtils.parseEther('0.977777000000000000')
        }
      })
    ], [])
    const [selectedToken, setSelectedToken] = useState<Token>(tokenOptions[0])
    const [fromNetwork, setFromNetwork] = useState<Network>()
    const [toNetwork, setToNetwork] = useState<Network>()
    const [fromTokenAmount, setFromTokenAmount] = useState<string>('')
    const [toTokenAmount, setToTokenAmount] = useState<string>('')
    const [isFromLastChanged, setIsFromLastChanged] = useState<boolean>(false)
    const exchangeRate = useMemo(() => {
      if (!fromNetwork || !toNetwork) {
        return '-'
      }
  
      let rate
      try {
        rate = ethersUtils.formatEther(ethersUtils.parseEther('1')
          .mul(selectedToken.rateForNetwork(toNetwork))
          .div(selectedToken.rateForNetwork(fromNetwork)))
      } catch (err) {
      }
  
      return rate || '-'
    }, [toNetwork, fromNetwork, selectedToken])
  
    const handleTokenOptionSelect = (event: ChangeEvent<{ value: unknown }>) => {
      const tokenSymbol = event.target.value
      const newSelectedToken = tokenOptions.find(token => token.symbol === tokenSymbol)
      if (newSelectedToken) {
        setSelectedToken(newSelectedToken)
      }
    }
  
    const handleSwitchDirection = () => {
      setToTokenAmount(fromTokenAmount)
      setFromTokenAmount(toTokenAmount)
      setFromNetwork(toNetwork)
      setToNetwork(fromNetwork)
      setIsFromLastChanged(!isFromLastChanged)
    }
  
    // Control toTokenAmount when fromTokenAmount was edited last
    useEffect(() => {
      if (isFromLastChanged) {
        try {
          const toAmount = ethersUtils.parseEther(fromTokenAmount)
            .mul(selectedToken.rateForNetwork(toNetwork))
            .div(selectedToken.rateForNetwork(fromNetwork))
          setToTokenAmount(ethersUtils.formatEther(toAmount))
        } catch (err) {}
      }
    }, [isFromLastChanged, fromNetwork, toNetwork, selectedToken, fromTokenAmount, setToTokenAmount])
  
    // Control fromTokenAmount when toTokenAmount was edited last
    useEffect(() => {
      if (!isFromLastChanged) {
        try {
          const fromAmount = ethersUtils.parseEther(toTokenAmount)
            .mul(selectedToken.rateForNetwork(fromNetwork))
            .div(selectedToken.rateForNetwork(toNetwork))
          setFromTokenAmount(ethersUtils.formatEther(fromAmount))
        } catch (err) {}
      }
    }, [isFromLastChanged, fromNetwork, toNetwork, selectedToken, toTokenAmount, setFromTokenAmount])
  
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <GovernanceOverviewCard />

        <div> proposals </div>

        {/* TODO: Loop through these and display up to 5 */}
        <ProposalOverviewCard
          proposalIndex={'1'}
          proposalName={'Add Authereum to the committee'}
          proposalStatus={PROPOSAL_STATUSES.SUCCEEDED}
        />

        <ProposalOverviewCard
          proposalIndex={'2'}
          proposalName={'Reduce token issuance'}
          proposalStatus={PROPOSAL_STATUSES.DEFEATED}
        />

      </Box>
    )
  }
  
  export default Governance