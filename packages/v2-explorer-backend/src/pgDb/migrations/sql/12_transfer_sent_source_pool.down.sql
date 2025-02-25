-- Revert the changes for transfer_sent_events
ALTER TABLE transfer_sent_events
    ADD COLUMN IF NOT EXISTS total_sent NUMERIC NOT NULL CHECK (total_sent >= 0),
    ADD COLUMN IF NOT EXISTS total_claims NUMERIC NOT NULL CHECK (total_claims >= 0),
    DROP COLUMN IF EXISTS source_pool;

-- Revert the changes for next_hops
ALTER TABLE next_hops
    DROP COLUMN IF EXISTS max_total_sent,
    ADD COLUMN IF NOT EXISTS min_amount_out NUMERIC NOT NULL CHECK (min_amount_out >= 0);
