-- ETH Bonder Profit Chart

select
  (total_balances - total_deposits - native_token_debt) as profit,
  day
from (
    select
    (
        (restaked_amount + polygon_canonical_amount + polygon_hToken_amount + gnosis_canonical_amount + gnosis_hToken_amount + arbitrum_canonical_amount + arbitrum_hToken_amount + optimism_canonical_amount + optimism_hToken_amount + IFNULL(nova_canonical_amount, 0) + IFNULL(nova_hToken_amount, 0) + IFNULL(base_canonical_amount, 0) + IFNULL(base_hToken_amount, 0) + IFNULL(linea_canonical_amount, 0) + IFNULL(linea_hToken_amount, 0) + IFNULL(polygonzk_canonical_amount, 0) + IFNULL(polygonzk_hToken_amount, 0) + ethereum_canonical_amount + (staked_amount - unstaked_amount)) - initial_canonical_amount
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
    strftime('%m - %d  - %Y', datetime(timestamp, 'unixepoch', 'utc')) as day
    from
        bonder_balances
    where
        token = 'ETH'
        and timestamp > (select timestamp from bonder_balances where token = 'ETH' and deposit_event is not null order by timestamp asc limit 1)
    order by timestamp asc
)
