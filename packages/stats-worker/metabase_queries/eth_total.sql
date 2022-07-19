select
  result3 as profit
  from bonder_balances
where
  token = 'ETH'
order by timestamp desc
limit 1
