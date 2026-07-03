-- CreateTable
CREATE TABLE "State" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name_en" TEXT NOT NULL,
    "name_hi" TEXT NOT NULL,
    "constituencies_count" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Constituency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "state_id" INTEGER NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_hi" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Constituency_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "State" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name_en" TEXT NOT NULL,
    "name_hi" TEXT NOT NULL,
    "party_id" INTEGER NOT NULL,
    "constituency_id" INTEGER NOT NULL,
    "photo_url" TEXT,
    "assets" TEXT,
    "criminal_cases" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Candidate_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "Party" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Candidate_constituency_id_fkey" FOREIGN KEY ("constituency_id") REFERENCES "Constituency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Party" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name_en" TEXT NOT NULL,
    "name_hi" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "colors" TEXT NOT NULL,
    "founded_year" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Election" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "state_id" INTEGER,
    "phase" INTEGER NOT NULL,
    "polling_date" DATETIME NOT NULL,
    CONSTRAINT "Election_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "State" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "epic_number" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "state" TEXT,
    "language_pref" TEXT NOT NULL DEFAULT 'en'
);

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "term_en" TEXT NOT NULL,
    "term_hi" TEXT NOT NULL,
    "definition_en" TEXT NOT NULL,
    "definition_hi" TEXT NOT NULL,
    "category" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "flashcard_id" INTEGER NOT NULL,
    "mastery_level" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "UserProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserProgress_flashcard_id_fkey" FOREIGN KEY ("flashcard_id") REFERENCES "Flashcard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "state_id" INTEGER,
    "title_en" TEXT NOT NULL,
    "title_hi" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_hi" TEXT NOT NULL,
    "event_date" DATETIME NOT NULL,
    "event_type" TEXT NOT NULL,
    CONSTRAINT "TimelineEvent_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "State" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_epic_number_key" ON "User"("epic_number");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_user_id_flashcard_id_key" ON "UserProgress"("user_id", "flashcard_id");
