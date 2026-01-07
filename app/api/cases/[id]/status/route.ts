import { NextResponse } from 'next/server';
import { updateCase } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Note: params is a promise in Next.js 15+
) {
    const session = await getServerSession(authOptions);

    // Disable auth check for demo
    // if (!session) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: "Missing status" }, { status: 400 });
        }

        const updated = await updateCase(parseInt(id), { status });

        return NextResponse.json(updated);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Case not found or Internal Server Error" }, { status: 404 });
    }
}
