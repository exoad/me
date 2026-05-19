CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  approved INTEGER NOT NULL DEFAULT 0,
  safety_status TEXT NOT NULL DEFAULT 'unchecked',
  safety_reason TEXT,
  safety_scores TEXT
);

CREATE INDEX IF NOT EXISTS idx_approved ON entries(approved);
CREATE INDEX IF NOT EXISTS idx_created_at ON entries(created_at);
CREATE INDEX IF NOT EXISTS idx_safety_status ON entries(safety_status);

CREATE TABLE IF NOT EXISTS bans (
  ip TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
