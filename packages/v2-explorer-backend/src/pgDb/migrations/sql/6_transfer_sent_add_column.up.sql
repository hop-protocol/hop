ALTER TABLE next_hops
    ADD COLUMN "index" INTEGER NOT NULL CHECK ("index" >= 0)
