select
  result3 as result
  from bonder_balances
where
  token = 'USDC'
order by timestamp desc
limit 1
