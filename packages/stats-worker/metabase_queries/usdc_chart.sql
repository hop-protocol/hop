select
  (total_balances - total_deposits - native_token_debt) as profit,
  day
from (
    select
    (
        (restaked_amount + polygon_canonical_amount + polygon_hToken_amount + gnosis_canonical_amount + gnosis_hToken_amount + arbitrum_canonical_amount + arbitrum_hToken_amount + optimism_canonical_amount + optimism_hToken_amount + ethereum_canonical_amount + (staked_amount - unstaked_amount)) - initial_canonical_amount - (unstaked_eth_amount * eth_price_usd)
    ) as total_balances,
    (
        deposit_amount - withdrawn_amount
    ) as total_deposits,
    (
        (
          (13.51 * eth_price_usd) +
          (682.9 * matic_price_usd) +
          (260.77 * xdai_price_usd)
        ) -
        (
          (polygon_native_amount * matic_price_usd) +
          (gnosis_native_amount * xdai_price_usd) +
          ((ethereum_native_amount + optimism_native_amount + arbitrum_native_amount + arbitrum_alias_amount) * eth_price_usd)
        )
    ) as native_token_debt,
    strftime('%m - %d  - %Y', datetime(timestamp, 'unixepoch', 'utc')) as day
    from
        bonder_balances
    where
        token = 'USDC'
        and strftime('%Y-%m-%d', datetime(timestamp, 'unixepoch', 'utc')) >= '2021-11-15'
    order by timestamp asc
)
