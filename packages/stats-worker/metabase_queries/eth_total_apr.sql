select
  (((profit /( ( days_total / total) / 365.0)) / total) * 100) as apr
from (
  select
    SUM(amount*days) as days_total,
    8339.0 as total,
    (select result3 from bonder_balances where token = 'ETH' order by timestamp desc limit 1) as profit
from (
    select deposit_event as amount,
    julianday(datetime('now')) - julianday(strftime('%Y-%m-%d', datetime(timestamp, 'unixepoch', 'utc'))) as days
    from bonder_balances
    where
      deposit_event is not null
      and token = 'ETH'
      and strftime('%Y-%m-%d', datetime(timestamp, 'unixepoch', 'utc')) >= '2021-12-17'
  )
)

