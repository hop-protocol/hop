ALTER TABLE transfer_sent_events
    DROP COLUMN IF EXISTS checkpoint,
    DROP COLUMN IF EXISTS attestation_fee;

ALTER TABLE transfer_sent_events
    ADD COLUMN previous_transfer_id CHAR(66);
