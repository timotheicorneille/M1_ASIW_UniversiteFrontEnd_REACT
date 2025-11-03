import { Database } from "bun:sqlite"

export const db = new Database("data.db")

export const initDatabase = () => {
  db.run(`
  CREATE TABLE IF NOT EXISTS parcours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nomParcours TEXT NOT NULL,
    anneeFormation INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

  db.run(`
  CREATE TABLE IF NOT EXISTS etudiants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    parcours_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parcours_id) REFERENCES parcours(id) ON DELETE SET NULL
  )
`)
}
