import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../engagement_ledger.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening SQLite database', err);
    } else {
        console.log('✅ SQLite Engagement Ledger Connected');
        db.run(`CREATE TABLE IF NOT EXISTS engagement (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId TEXT,
            postId TEXT,
            type TEXT, -- 'like' or 'comment'
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

export const logEngagement = (userId, postId, type) => {
    const query = `INSERT INTO engagement (userId, postId, type) VALUES (?, ?, ?)`;
    db.run(query, [userId, postId, type], (err) => {
        if (err) console.error('Error logging to SQL ledger', err);
    });
};

export const getEngagementHistory = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM engagement WHERE userId = ? ORDER BY timestamp DESC`;
        db.all(query, [userId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

export const getTopLikedPostsLastHour = (limit = 10) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT postId, COUNT(*) as likeCount 
            FROM engagement 
            WHERE type = 'like' 
            AND timestamp >= datetime('now', '-1 hour')
            GROUP BY postId 
            ORDER BY likeCount DESC 
            LIMIT ?`;
        db.all(query, [limit], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

export const getEngagementBreakdown = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT type, COUNT(*) as count 
            FROM engagement 
            GROUP BY type`;
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

export default db;
