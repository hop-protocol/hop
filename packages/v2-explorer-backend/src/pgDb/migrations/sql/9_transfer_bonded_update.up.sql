ALTER TABLE transfer_bonded_events
    ADD COLUMN IF NOT EXISTS "to" CHAR(42) NOT NULL;
