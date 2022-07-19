select
  ((((f - l) / (7.0 / 365.0)) / 8339.0) * 100) as apr
from (
    select
      (select result3 as profit from bonder_balances b where token = 'ETH' order by timestamp desc limit 1 offset 7) as l,
      (select result3 as profit from bonder_balances b where token = 'ETH' order by timestamp desc limit 1) as f
)
