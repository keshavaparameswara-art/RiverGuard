import { NextResponse } from 'next/server';
import { readDb, addCase } from '@/lib/db-json';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { CaseSeverity, CaseStatus } from '@/types';

export async function GET() {
    const db = readDb();
    return NextResponse.json(db.cases);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    // Basic protection
    // For demo purposes, we are disabling the strict auth check to allow testing without login
    // if (!session) {
    //    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    try {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const latitude = parseFloat(formData.get('latitude') as string);
        const longitude = parseFloat(formData.get('longitude') as string);
        const severity = formData.get('severity') as string;
        const status = formData.get('status') as string;
        const imageBefore = formData.get('imageBefore') as File | null;
        const imageAfter = formData.get('imageAfter') as File | null;

        // Basic validation
        if (!title || !latitude || !longitude) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let imageUrlBefore = "/placeholder-before.jpg";
        let imageUrlAfter = "/placeholder-after.jpg";

        // Save images
        if (imageBefore) {
            const bytes = await imageBefore.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `before-${Date.now()}-${imageBefore.name}`;
            const path = join(process.cwd(), 'public', 'uploads', filename);
            await writeFile(path, buffer);
            imageUrlBefore = `/uploads/${filename}`;
        }

        if (imageAfter) {
            const bytes = await imageAfter.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `after-${Date.now()}-${imageAfter.name}`;
            const path = join(process.cwd(), 'public', 'uploads', filename);
            await writeFile(path, buffer);
            imageUrlAfter = `/uploads/${filename}`;
        }

        const newCase = addCase({
            title,
            description: description || "",
            latitude,
            longitude,
            severity: (severity as CaseSeverity) || "LOW",
            status: (status as CaseStatus) || "PENDING",
            imageUrlBefore,
            imageUrlAfter
        });

        return NextResponse.json(newCase);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
