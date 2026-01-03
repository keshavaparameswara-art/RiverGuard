import { NextResponse } from 'next/server';
import { readDb, addCase } from '@/lib/db-json';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const db = readDb();
    return NextResponse.json(db.cases);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    // Basic protection
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, description, latitude, longitude, severity, status, zoneId } = body;

        // Basic validation
        if (!title || !latitude || !longitude) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newCase = addCase({
            title,
            description: description || "",
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            severity: severity || "LOW",
            status: status || "PENDING",
            zoneId: zoneId ? parseInt(zoneId) : undefined,
            imageUrlBefore: "/placeholder-before.jpg",
            imageUrlAfter: "/placeholder-after.jpg"
        });

        return NextResponse.json(newCase);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
