select
  (((result3/( ((((2000000.0*243))+((500000.0*165))+((1000000.0*158))+((1500000.0*157)))/5000000. 0)  /365.0)) / 5000000.0) * 100) as apr
from bonder_balances
where
  token = 'DAI'
order by timestamp desc
limit 1
