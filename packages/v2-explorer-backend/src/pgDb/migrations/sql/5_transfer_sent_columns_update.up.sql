ALTER TABLE transfer_sent_events
    DROP COLUMN IF EXISTS path_id,
    DROP COLUMN IF EXISTS attestation_fee,
    DROP COLUMN IF EXISTS nonce,
    DROP COLUMN IF EXISTS attested_checkpoint,
    DROP COLUMN IF EXISTS previous_transfer_id;

ALTER TABLE transfer_sent_events
    ADD COLUMN IF NOT EXISTS attested_claim_id CHAR(66) NOT NULL,
    ADD COLUMN IF NOT EXISTS attested_total_claims NUMERIC NOT NULL CHECK (attested_total_claims >= 0);
