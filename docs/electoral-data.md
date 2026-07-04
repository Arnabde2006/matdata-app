# Historical Electoral Data & Verified Sources

This document describes how verified electoral data is integrated, stored, validated, and served in `matdata-app`.

---

## 1. Data Schema

The system uses four normalized tables in SQLite (via Prisma) to cache and store electoral results:

### `HistoricalElection`
Represents an entire election event.
- `id` (Int, PK, Autoincrement)
- `type` (String, e.g. "Lok Sabha" or "Vidhan Sabha")
- `year` (Int)
- `state` (String, nullable, used for Vidhan Sabha elections)
- `source` (String, e.g., "Election Commission of India")
- `source_url` (String)
- `ingested_at` (DateTime, defaults to current time)

### `HistoricalConstituency`
Represents a constituency within an election.
- `id` (Int, PK, Autoincrement)
- `election_id` (Int, FK to `HistoricalElection`)
- `name` (String)
- `state` (String)
- `seat_type` (String, e.g. "general", "SC", "ST")
- `source` (String)
- `source_url` (String)

### `HistoricalCandidate`
Represents a candidate standing in a constituency.
- `id` (Int, PK, Autoincrement)
- `constituency_id` (Int, FK to `HistoricalConstituency`)
- `name` (String)
- `party` (String, e.g., "BJP", "INC")
- `votes` (Int)
- `vote_share_pct` (Float)
- `result` (String, e.g. "won" or "lost")
- `is_winner` (Boolean)
- `source` (String)
- `source_url` (String)

### `HistoricalConstituencySummary`
Represents electors, turnout, and votes for a constituency.
- `id` (Int, PK, Autoincrement)
- `constituency_id` (Int, FK to `HistoricalConstituency`, unique)
- `total_electors` (Int)
- `total_votes_polled` (Int)
- `turnout_pct` (Float)
- `valid_votes` (Int)
- `source` (String)
- `source_url` (String)

---

## 2. Ingestion of Pre-Processed ECI Datasets (Fallback & Seed Data)

For elections where live APIs are unavailable or as a secure offline baseline:
- Pre-processed JSON datasets are placed in `backend/data/seeds/`.
- Run the ingestion CLI script:
  ```bash
  npm run db:ingest
  ```
- This reads JSON datasets, validates the candidate vote sum consistency, and inserts them into the database cache.

---

## 3. Live Sync from data.gov.in

If the environment variable `DATA_GOV_IN_API_KEY` is present, the app can sync results directly from the Open Government Data Platform.

### Base API Pattern
`https://api.data.gov.in/resource/{resource_id}?api-key={API_KEY}&format=json&offset={n}&limit={n}`

### Configuration
Resource IDs are stored centrally in `backend/src/config/electoralDataSources.ts` mapped by election type, year, and state.
```typescript
export const electoralDataSources = {
  'lok_sabha_2019': {
    resourceId: '3724c9c1-19b0-466d-8c10-2fa2ef6e91f0',
    type: 'Lok Sabha',
    year: 2019,
    state: null,
    source: 'data.gov.in',
    source_url: '...'
  }
};
```

---

## 4. Vote Consistency Validation

To prevent corrupt or misaligned electoral statistics:
- Before any constituency data is stored, the system calculates the sum of all candidate votes:
  $$\sum \text{candidate\_votes} \approx \text{valid\_votes}$$
- A tolerance threshold of **0.5%** is checked to allow for rounding differences.
- Mismatched constituencies are skipped/rejected, and warnings are logged for manual review.

---

## 5. API Endpoints

- **`GET /api/elections`**: List all elections.
- **`GET /api/elections/:electionId/summary`**: Returns party Tallies (seats won) and overall voter turnout metrics.
- **`GET /api/elections/:electionId/constituencies`**: Paginated list of constituencies with search query filter support, returning winners and victory margins.
- **`GET /api/elections/:electionId/constituencies/:constituencyId`**: Full candidate breakdown (names, votes, vote share percentages) and electorate turnout details.
- **`POST /api/elections/sync`**: Trigger manual background sync for a specified type and year.
