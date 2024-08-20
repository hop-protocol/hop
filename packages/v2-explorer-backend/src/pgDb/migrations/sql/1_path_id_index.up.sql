DROP INDEX IF EXISTS idx_paths_path_id;
ALTER TABLE paths DROP CONSTRAINT IF EXISTS paths_path_id_key;
