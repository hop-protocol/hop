-- For the table `transfer_sent_events`

-- Add the column if it does not exist
ALTER TABLE transfer_sent_events
    ADD COLUMN IF NOT EXISTS path_id CHAR(66);

-- Rename the 'amount' column to 'amount_out' if 'amount' exists and 'amount_out' does not
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'transfer_sent_events'
        AND column_name = 'amount'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'transfer_sent_events'
        AND column_name = 'amount_out'
    ) THEN
        ALTER TABLE transfer_sent_events
        RENAME COLUMN amount TO amount_out;
    END IF;
END $$;

-- Drop the 'attested_claim_id' column if it exists
ALTER TABLE transfer_sent_events
    DROP COLUMN IF EXISTS attested_claim_id;

-- Rename the 'attested_total_claims' column to 'total_claims' if 'attested_total_claims' exists and 'total_claims' does not
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'transfer_sent_events'
        AND column_name = 'attested_total_claims'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'transfer_sent_events'
        AND column_name = 'total_claims'
    ) THEN
        ALTER TABLE transfer_sent_events
        RENAME COLUMN attested_total_claims TO total_claims;
    END IF;
END $$;

-- Drop the 'attested_total_claims' column if it exists
ALTER TABLE transfer_sent_events
    DROP COLUMN IF EXISTS attested_total_claims;

-- Rename the 'next_hops' column to 'hops' if 'next_hops' exists and 'hops' does not
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'transfer_sent_events'
        AND column_name = 'next_hops'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'transfer_sent_events'
        AND column_name = 'hops'
    ) THEN
        ALTER TABLE transfer_sent_events
        RENAME COLUMN next_hops TO hops;
    END IF;
END $$;

-- For the table `next_hops`

-- Add the 'max_bonder_fee' column if it does not exist
ALTER TABLE next_hops
    ADD COLUMN IF NOT EXISTS max_bonder_fee NUMERIC CHECK (max_bonder_fee >= 0);
