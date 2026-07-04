-- CreateTable
CREATE TABLE "HistoricalElection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "state" TEXT,
    "source" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "ingested_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "HistoricalConstituency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "election_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "seat_type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    CONSTRAINT "HistoricalConstituency_election_id_fkey" FOREIGN KEY ("election_id") REFERENCES "HistoricalElection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HistoricalCandidate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "constituency_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "votes" INTEGER NOT NULL,
    "vote_share_pct" REAL NOT NULL,
    "result" TEXT NOT NULL,
    "is_winner" BOOLEAN NOT NULL,
    "source" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    CONSTRAINT "HistoricalCandidate_constituency_id_fkey" FOREIGN KEY ("constituency_id") REFERENCES "HistoricalConstituency" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HistoricalConstituencySummary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "constituency_id" INTEGER NOT NULL,
    "total_electors" INTEGER NOT NULL,
    "total_votes_polled" INTEGER NOT NULL,
    "turnout_pct" REAL NOT NULL,
    "valid_votes" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    CONSTRAINT "HistoricalConstituencySummary_constituency_id_fkey" FOREIGN KEY ("constituency_id") REFERENCES "HistoricalConstituency" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalConstituencySummary_constituency_id_key" ON "HistoricalConstituencySummary"("constituency_id");
