const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'ops_copilot.db');
const db = new Database(dbPath);

function initSchema() {
    db.exec(`
    -- tickets
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      source TEXT DEFAULT 'form',
      status TEXT DEFAULT 'new',
      category TEXT,
      priority TEXT,
      dedupe_key TEXT,
      summary TEXT
    );

    -- kb (knowledge base articles)
    CREATE TABLE IF NOT EXISTS kb (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    );

    -- kb_embeddings (vectors)
    CREATE TABLE IF NOT EXISTS kb_embeddings (
      kb_id INTEGER,
      dim INTEGER,
      vector BLOB,
      FOREIGN KEY(kb_id) REFERENCES kb(id)
    );

    -- traces (agent run logs)
    CREATE TABLE IF NOT EXISTS traces (
      id INTEGER PRIMARY KEY,
      ticket_id INTEGER,
      step INTEGER,
      thought TEXT,
      action TEXT,
      observation TEXT,
      ts TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(ticket_id) REFERENCES tickets(id)
    );

    -- similar_tickets (optional cache)
    CREATE TABLE IF NOT EXISTS similar_tickets (
      ticket_id INTEGER,
      similar_id INTEGER,
      score REAL
    );
  `);
    console.log('Database schema initialized.');
}

module.exports = { db, initSchema };
