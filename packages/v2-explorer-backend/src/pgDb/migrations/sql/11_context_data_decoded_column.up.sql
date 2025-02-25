ALTER TABLE event_context
ADD COLUMN IF NOT EXISTS data_decoded JSONB;
