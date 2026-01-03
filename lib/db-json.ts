import fs from 'fs';
import path from 'path';
import { Case } from '@/types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

type Database = {
    cases: Case[];
    stats: {
        pending: number;
        investigating: number;
        resolved: number;
    };
};

const INITIAL_DB: Database = {
    cases: [
        {
            id: 1,
            title: "Unauthorized Construction in Zone A",
            description: "New concrete structure detected 15m from riverbank.",
            latitude: 28.6139,
            longitude: 77.2090,
            status: "PENDING",
            severity: "HIGH",
            createdAt: new Date(),
            updatedAt: new Date(),
            zoneId: 1
        }
    ],
    stats: {
        pending: 1,
        investigating: 0,
        resolved: 0
    }
};

export function readDb(): Database {
    if (!fs.existsSync(DB_PATH)) {
        writeDb(INITIAL_DB);
        return INITIAL_DB;
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        // Revive dates
        parsed.cases = parsed.cases.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt)
        }));
        return parsed;
    } catch (error) {
        console.error("DB Read Error:", error);
        return INITIAL_DB;
    }
}

export function writeDb(data: Database) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function addCase(newCase: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): Case {
    const db = readDb();
    const id = db.cases.length > 0 ? Math.max(...db.cases.map(c => c.id)) + 1 : 1;
    const createdCase: Case = {
        ...newCase,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    db.cases.unshift(createdCase); // Add to top

    // Update stats
    if (createdCase.status === 'PENDING') db.stats.pending++;
    // ... logic for other statuses if we were importing verified cases

    writeDb(db);
    return createdCase;
}

export function updateCase(id: number, updates: Partial<Case>): Case | null {
    const db = readDb();
    const index = db.cases.findIndex(c => c.id === id);
    if (index === -1) return null;

    db.cases[index] = {
        ...db.cases[index],
        ...updates,
        updatedAt: new Date()
    };

    // Update stats if status changed
    // For simplicity, recalculating all stats
    const cases = db.cases;
    db.stats.pending = cases.filter(c => c.status === 'PENDING').length;
    db.stats.investigating = cases.filter(c => c.status === 'INVESTIGATING').length;
    db.stats.resolved = cases.filter(c => c.status === 'RESOLVED').length;

    writeDb(db);
    return db.cases[index];
}

export function deleteCase(id: number): boolean {
    const db = readDb();
    const initialLength = db.cases.length;
    db.cases = db.cases.filter(c => c.id !== id);

    if (db.cases.length === initialLength) return false;

    // Recalculate stats
    const cases = db.cases;
    db.stats.pending = cases.filter(c => c.status === 'PENDING').length;
    db.stats.investigating = cases.filter(c => c.status === 'INVESTIGATING').length;
    db.stats.resolved = cases.filter(c => c.status === 'RESOLVED').length;

    writeDb(db);
    return true;
}
