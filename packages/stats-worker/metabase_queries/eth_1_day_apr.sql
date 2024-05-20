-- ETH Bonder 1 Day APR

select
  ((((f - l) / (1.0 / 365.0)) / total) * 100) as apr
from (
    select
    (select (staked_amount - unstaked_amount) as total from bonder_balances where token = 'ETH' order by timestamp desc limit 1) as total,
    (select result3 as profit from bonder_balances where token = 'ETH' order by timestamp desc limit 1 offset 1) as l,
    (select result3 as profit from bonder_balances where token = 'ETH' order by timestamp desc limit 1) as f
)
