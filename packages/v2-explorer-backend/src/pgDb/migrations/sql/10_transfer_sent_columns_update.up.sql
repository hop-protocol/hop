ALTER TABLE next_hops
    DROP COLUMN IF EXISTS max_total_sent;

ALTER TABLE next_hops ADD COLUMN IF NOT EXISTS min_amount_out NUMERIC NOT NULL CHECK (min_amount_out >= 0);
