import { Case } from "@/types";

export async function getCases(): Promise<Case[]> {
    try {
        const res = await fetch('/api/cases', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch cases');
        const data = await res.json();

        // Convert date strings back to Date objects
        return data.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt)
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function createCase(data: Partial<Case>): Promise<Case | null> {
    try {
        const res = await fetch('/api/cases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create case');
        return await res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getStats() {
    // In a real app we'd have an endpoint for this, 
    // for now we can calculate it from getCases or keep it mocked/hybrid
    const cases = await getCases();
    return {
        pending: cases.filter(c => c.status === 'PENDING').length,
        investigating: cases.filter(c => c.status === 'INVESTIGATING').length,
        resolved: cases.filter(c => c.status === 'RESOLVED').length
    };
}

