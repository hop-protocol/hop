select
  ((((f - l) / (1.0 / 365.0)) / 5000000.0) * 100) as apr
from (
    select
      (select result3 as profit from bonder_balances where token = 'DAI' order by timestamp desc limit 1 offset 1) as l,
      (select result3 as profit from bonder_balances where token = 'DAI' order by timestamp desc limit 1) as f
)
