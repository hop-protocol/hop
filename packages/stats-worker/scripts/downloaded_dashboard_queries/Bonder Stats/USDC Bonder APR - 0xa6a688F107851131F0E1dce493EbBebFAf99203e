select
  (((profit /( ( days_total / total) / 365.0)) / total) * 100) as apr
from (
  select
    SUM(amount*days) as days_total,
    (select (staked_amount - unstaked_amount) as total from bonder_balances where token = 'USDC' order by timestamp desc limit 1) as total,
    (select result3 as profit from bonder_balances where token = 'USDC' order by timestamp desc limit 1) as profit
from (
    select deposit_event as amount,
    julianday(datetime('now')) - julianday(strftime('%Y-%m-%d', datetime(timestamp, 'unixepoch', 'utc'))) as days
    from bonder_balances
    where
      deposit_event is not null
      and token = 'USDC'
      and strftime('%Y-%m-%d', datetime(timestamp, 'unixepoch', 'utc')) >= '2021-11-15'
  )
)

