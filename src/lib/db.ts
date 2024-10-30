import { initWasm } from '@vlcn.io/wa-sqlite';
import wasmUrl from '@vlcn.io/wa-sqlite/wa-sqlite-async.wasm?url';

let db: any = null;

export async function initDB() {
  if (db) return db;
  
  const sqlite = await initWasm(wasmUrl);
  db = await sqlite.open(':memory:');
  
  // Initialize the database schema
  await db.exec(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      timestamp TEXT NOT NULL,
      provider TEXT NOT NULL,
      status TEXT NOT NULL
    )
  `);
  
  return db;
}

export async function getDB() {
  if (!db) {
    await initDB();
  }
  return db;
}