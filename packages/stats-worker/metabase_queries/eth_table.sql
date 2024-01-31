-- ETH Bonder Balances Table

select
  initial_canonical_amount,
  initial_eth_amount,
  initial_matic_amount,
  initial_xdai_amount,
  polygon_canonical_amount,
  polygon_hToken_amount,
  gnosis_canonical_amount,
  gnosis_hToken_amount,
  arbitrum_canonical_amount,
  arbitrum_hToken_amount,
  optimism_canonical_amount,
  optimism_hToken_amount,
  nova_canonical_amount,
  nova_hToken_amount,
  base_canonical_amount,
  base_hToken_amount,
  linea_canonical_amount,
  linea_hToken_amount,
  polygonzk_canonical_amount,
  polygonzk_hToken_amount,
  ethereum_canonical_amount,
  polygon_native_amount,
  matic_price_usd,
  gnosis_native_amount,
  ethereum_native_amount,
  optimism_native_amount,
  arbitrum_native_amount,
  arbitrum_alias_amount,
  arbitrum_messenger_wrapper_amount,
  nova_native_amount,
  base_native_amount,
  linea_native_amount,
  polygonzk_native_amount,
  eth_price_usd,
  total_eth_amount,
  restaked_amount,
  staked_amount,
  unstaked_amount,
  current_staked_amount,
  total_balances,
  total_deposits,
  native_token_debt,
  (total_balances - total_deposits - native_token_debt) as profit,
  day
from (
    select
    (
        (restaked_amount +
          polygon_canonical_amount + polygon_hToken_amount +
          gnosis_canonical_amount + gnosis_hToken_amount +
          arbitrum_canonical_amount + arbitrum_hToken_amount +
          optimism_canonical_amount + optimism_hToken_amount +
          IFNULL(nova_canonical_amount, 0) + IFNULL(nova_hToken_amount, 0) +
          IFNULL(base_canonical_amount, 0) + IFNULL(base_hToken_amount, 0) +
          IFNULL(linea_canonical_amount, 0) + IFNULL(linea_hToken_amount, 0) +
          IFNULL(polygonzk_canonical_amount, 0) + IFNULL(polygonzk_hToken_amount, 0) +
          ethereum_canonical_amount + (staked_amount - unstaked_amount)) - initial_canonical_amount
    ) as total_balances,
    (
        deposit_amount - withdrawn_amount
    ) as total_deposits,
    (
        (
          ((initial_matic_amount * matic_price_usd) / eth_price_usd) +
          ((initial_xdai_amount * xdai_price_usd) / eth_price_usd) +
          (initial_eth_amount)
        ) -
        (
          ((polygon_native_amount * matic_price_usd) / eth_price_usd) +
          ((gnosis_native_amount * xdai_price_usd) / eth_price_usd) +
          (
            ethereum_native_amount +
            optimism_native_amount +
            arbitrum_native_amount + arbitrum_alias_amount + IFNULL(arbitrum_messenger_wrapper_amount, 0) +
            IFNULL(nova_native_amount, 0) +
            IFNULL(base_native_amount, 0) +
            IFNULL(linea_native_amount, 0) +
            IFNULL(polygonzk_native_amount, 0)
          )
        )
    ) as native_token_debt,
    (
      ethereum_native_amount +
      optimism_native_amount +
      arbitrum_native_amount + arbitrum_alias_amount + IFNULL(arbitrum_messenger_wrapper_amount, 0) +
      IFNULL(nova_native_amount, 0) +
      IFNULL(base_native_amount, 0) +
      IFNULL(linea_native_amount, 0) +
      IFNULL(polygonzk_native_amount, 0)
    ) as total_eth_amount,
    initial_canonical_amount,
    initial_eth_amount,
    initial_matic_amount,
    initial_xdai_amount,
    polygon_canonical_amount,
    polygon_hToken_amount,
    gnosis_canonical_amount,
    gnosis_hToken_amount,
    arbitrum_canonical_amount,
    arbitrum_hToken_amount,
    optimism_canonical_amount,
    optimism_hToken_amount,
    IFNULL(nova_canonical_amount, 0) as nova_canonical_amount,
    IFNULL(nova_hToken_amount, 0) as nova_hToken_amount,
    IFNULL(base_canonical_amount, 0) as base_canonical_amount,
    IFNULL(base_hToken_amount, 0) as base_hToken_amount,
    IFNULL(linea_canonical_amount, 0) as linea_canonical_amount,
    IFNULL(linea_hToken_amount, 0) as linea_hToken_amount,
    IFNULL(polygonzk_canonical_amount, 0) as polygonzk_canonical_amount,
    IFNULL(polygonzk_hToken_amount, 0) as polygonzk_hToken_amount,
    ethereum_canonical_amount,
    polygon_native_amount,
    matic_price_usd,
    gnosis_native_amount,
    ethereum_native_amount,
    optimism_native_amount,
    arbitrum_native_amount,
    arbitrum_alias_amount,
    IFNULL(arbitrum_messenger_wrapper_amount, 0) as arbitrum_messenger_wrapper_amount,
    IFNULL(nova_native_amount, 0) as nova_native_amount,
    IFNULL(base_native_amount, 0) as base_native_amount,
    IFNULL(linea_native_amount, 0) as linea_native_amount,
    IFNULL(polygonzk_native_amount, 0) as polygonzk_native_amount,
    eth_price_usd,
    restaked_amount,
    staked_amount,
    unstaked_amount,
    (staked_amount - unstaked_amount) as current_staked_amount,
    strftime('%m - %d  - %Y', datetime(timestamp, 'unixepoch', 'utc')) as day,
    result3 as result
    from
        bonder_balances
    where
        token = 'ETH'
        and strftime('%Y-%m-%d', datetime(timestamp, 'unixepoch', 'utc')) >= '2021-11-01'
    order by timestamp desc
)
