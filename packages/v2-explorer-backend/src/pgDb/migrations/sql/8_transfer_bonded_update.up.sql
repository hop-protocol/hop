-- For the table `transfer_bonded_events`

-- Add the 'bonder_fee' column if it does not exist
ALTER TABLE transfer_bonded_events
    ADD COLUMN IF NOT EXISTS bonder_fee NUMERIC;

-- Rename the 'transfer_id' column to 'claim_id' if 'transfer_id' exists and 'claim_id' does not
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'transfer_bonded_events'
        AND column_name = 'transfer_id'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'transfer_bonded_events'
        AND column_name = 'claim_id'
    ) THEN
        ALTER TABLE transfer_bonded_events
        RENAME COLUMN transfer_id TO claim_id;
    END IF;
END $$;
