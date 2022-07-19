select
  (((result3/( ((((21*171))+((2081815.0*167))+((1000.0*167))+((3900.0*167)))/1893247.0)  /365.0)) / 1893247.0) * 100) as apr
from bonder_balances
where
  token = 'USDT'
order by timestamp desc
limit 1

---

select
  (((profit /( ( days_total / total)  /365.0)) / total) * 100) as apr,
  days_total,
  profit
from (
  select
    SUM(amount*days) as days_total,
    1893247.0 as total,
    (select result3 from bonder_balances where token = 'USDT' order by timestamp desc limit 1) as profit
from (
    select deposit_event as amount,
    julianday(datetime('now')) - julianday(strftime('%Y-%m-%d', datetime(timestamp, 'unixepoch', 'utc'))) as days
    from bonder_balances
    where
      deposit_event is not null
      and token = 'USDT'
      and strftime('%Y-%m-%d', datetime(timestamp, 'unixepoch', 'utc')) >= '2022-01-27'
      and strftime('%Y-%m-%d', datetime(timestamp, 'unixepoch', 'utc')) < '2022-12-30'
  )
)
