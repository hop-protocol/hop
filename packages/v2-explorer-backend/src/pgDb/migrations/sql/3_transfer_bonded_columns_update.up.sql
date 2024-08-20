ALTER TABLE transfer_bonded_events
    DROP COLUMN IF EXISTS checkpoint,
    DROP COLUMN IF EXISTS amount_out,
    DROP COLUMN IF EXISTS total_sent;

ALTER TABLE transfer_bonded_events
    ADD COLUMN amount NUMERIC NOT NULL CHECK (amount >= 0);
