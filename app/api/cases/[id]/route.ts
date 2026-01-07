import { NextResponse } from 'next/server';
import { getCaseById, deleteCase } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const caseItem = await getCaseById(parseInt(id));

    if (!caseItem) {
        return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json(caseItem);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    // Disable auth check for demo
    // if (!session) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    try {
        const { id } = await params;
        await deleteCase(parseInt(id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Case not found or Internal Server Error" }, { status: 404 });
    }
}
