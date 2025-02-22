ALTER TABLE transfer_sent_events
    DROP COLUMN IF EXISTS total_sent,
    DROP COLUMN IF EXISTS total_claims,
    ADD COLUMN IF NOT EXISTS source_pool TEXT NOT NULL CHECK (source_pool >= 0);

ALTER TABLE next_hops
    DROP COLUMN IF EXISTS min_amount_out,
    ADD COLUMN IF NOT EXISTS max_total_sent NUMERIC NOT NULL CHECK (max_total_sent >= 0);

DROP TABLE IF EXISTS claim_chain_updated_events;
